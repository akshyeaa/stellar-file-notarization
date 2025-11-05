"use client";
import {
  Address,
  Contract,
  nativeToScVal,
  TransactionBuilder,
  xdr,
  Keypair,
  rpc as StellarRpc,
  Transaction,
} from "@stellar/stellar-sdk";

const RPC_URL = process.env.NEXT_PUBLIC_SOROBAN_RPC;
const NETWORK_PASSPHRASE = process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE;
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID;

const server = new StellarRpc.Server(RPC_URL, { allowHttp: false });

async function loadFreighter() {
  const mod = await import("@stellar/freighter-api");
  return mod.default || mod;
}

// -------------------------------
// 👛 CONNECT FREIGHTER WALLET
// -------------------------------
export async function connectFreighter() {
  const freighter = await loadFreighter();
  const conn = await freighter.isConnected();
  if (!conn.isConnected) throw new Error("Freighter not connected");
  const access = await freighter.requestAccess();
  if (access.error) throw new Error(access.error);
  console.log("✅ Connected wallet:", access.address);
  return access.address;
}

// -------------------------------
// 🔍 VERIFY FILE WITH DETAILS
// -------------------------------
export async function verifyFileWithDetails(fileHashHex) {
  try {
    const hashBytes = Buffer.from(fileHashHex, "hex");
    if (hashBytes.length !== 32) {
      throw new Error("Invalid SHA-256 hash length (must be 32 bytes)");
    }

    // First, check if file exists using the existing verify function
    const isNotarized = await verifyFile(fileHashHex);
    
    if (isNotarized) {
      // File is notarized, but we can't get owner details without the updated contract
      return {
        notarized: true,
        owner: "Unknown (requires updated contract)",
        timestamp: "Unknown (requires updated contract)"
      };
    } else {
      // File is not notarized
      return {
        notarized: false
      };
    }
  } catch (err) {
    console.error("🚨 Verify Error:", err);
    return { notarized: false };
  }
}

// -------------------------------
// 🔍 VERIFY FILE
// -------------------------------
export async function verifyFile(fileHashHex) {
  try {
    const hashBytes = Buffer.from(fileHashHex, "hex");
    if (hashBytes.length !== 32) {
      throw new Error("Invalid SHA-256 hash length (must be 32 bytes)");
    }

    // Ensure we're using the correct contract ID
    const contract = new Contract(CONTRACT_ID);
    
    // Create a proper dummy account for simulation
    const dummyPublicKey = "GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF";
    const dummyAccount = {
      accountId: () => dummyPublicKey,
      sequenceNumber: () => "0",
      incrementSequenceNumber: () => {}
    };

    // Create the verify operation
    const op = contract.call("verify", nativeToScVal(hashBytes, { type: "bytes" }));

    // Build the transaction
    const tx = new TransactionBuilder(dummyAccount, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(op)
      .setTimeout(60)
      .build();

    console.log("🧪 Simulating verify...");
    const sim = await server.simulateTransaction(tx);
    
    if (sim.error) {
      console.error("❌ Simulation failed:", sim.error);
      // Even if simulation fails, we can still return false for verification
      return false;
    }

    const val = sim.result?.retval;
    const verified = val?.switch() === xdr.ScValType.scvBool() ? val.b() : false;

    console.log("✅ Verify result:", verified);
    return verified;
  } catch (err) {
    console.error("🚨 Verify Error:", err);
    // Return false instead of throwing to allow the UI to handle gracefully
    return false;
  }
}

// -------------------------------
// 🧾 NOTARIZE FILE
// -------------------------------
export async function notarizeFile(publicKey, fileHashHex) {
  try {
    const freighter = await loadFreighter();
    const hashBytes = Buffer.from(fileHashHex, "hex");

    if (hashBytes.length !== 32) {
      throw new Error("Invalid SHA-256 hash length (must be 32 bytes)");
    }

    // First, check if the file is already notarized
    console.log("🔍 Checking if file is already notarized...");
    const isAlreadyNotarized = await verifyFile(fileHashHex);
    if (isAlreadyNotarized) {
      throw new Error("File is already notarized on the blockchain");
    }

    console.log("📝 Proceeding with notarization...");
    const contract = new Contract(CONTRACT_ID);
    const acc = await server.getAccount(publicKey);

    const op = contract.call(
      "notarize",
      nativeToScVal(hashBytes, { type: "bytes" }),
      Address.fromString(publicKey).toScVal()
    );

    const tx = new TransactionBuilder(acc, {
      fee: "100",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(op)
      .setTimeout(60)
      .build();

    console.log("🧪 Simulating notarize transaction...");
    const sim = await server.simulateTransaction(tx);
    if (sim.error) {
      console.error("❌ Simulation failed:", sim.error);
      throw new Error("Simulation failed: " + JSON.stringify(sim.error));
    }

    console.log("🛠 Preparing transaction...");
    const preparedTx = await server.prepareTransaction(tx, sim); // ✅ returns Transaction object

    console.log("✍️ Requesting Freighter signature...");
    const signedXdr = await freighter.signTransaction(preparedTx.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
      address: publicKey,
    });

    // Parse the signed XDR back into a Transaction object
    const signedTx = TransactionBuilder.fromXDR(signedXdr.signedTxXdr, NETWORK_PASSPHRASE);

    console.log("📡 Sending transaction...");
    const sendResult = await server.sendTransaction(signedTx); // Send Transaction object

    if (!sendResult || !sendResult.hash) {
      console.error("❌ Send failed:", sendResult);
      throw new Error("Transaction submission failed: " + JSON.stringify(sendResult));
    }

    console.log(`✅ TX submitted successfully: ${sendResult.hash}`);
    return {
      hash: sendResult.hash,
      timestamp: Math.floor(Date.now() / 1000)
    };
  } catch (err) {
    console.error("🚨 Full Notarize Error Dump:", err);
    throw new Error("Error notarizing file: " + (err.message || "Unknown error occurred"));
  }
}
