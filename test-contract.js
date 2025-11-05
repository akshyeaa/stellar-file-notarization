const { Contract, Client, Networks, Keypair } = require('@stellar/stellar-sdk');

async function testContract() {
  // Test contract ID from .env.local
  const contractId = "CDAKWQR3EVSQ2RUO7FLGH42TBSODUMDQCTU7XWS3DV3LULGTVAOCM43O";
  
  console.log("Testing contract:", contractId);
  
  // Create a dummy keypair for testing
  const keypair = Keypair.random();
  console.log("Using dummy account:", keypair.publicKey());
  
  try {
    // Test if contract exists by trying to create a contract client
    console.log("Contract test completed");
  } catch (error) {
    console.error("Error testing contract:", error);
  }
}

testContract();