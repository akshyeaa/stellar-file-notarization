# Deployment Instructions

## Prerequisites

1. Rust and Cargo installed
2. Soroban CLI installed
3. Stellar account with testnet funds

## Building the Contract

```bash
cd contracts/hello-world
cargo build --release --target wasm32-unknown-unknown
```

## Deploying the Contract

1. Install Soroban CLI:
   ```bash
   cargo install --locked soroban-cli
   ```

2. Deploy the contract:
   ```bash
   soroban contract deploy \
     --wasm target/wasm32-unknown-unknown/release/file_notarization.wasm \
     --source <your-account-secret-key> \
     --rpc-url https://soroban-testnet.stellar.org \
     --network-passphrase "Test SDF Network ; September 2015"
   ```

3. Update the CONTRACT_ID in `.env.local` with the deployed contract address

## Testing the Contract

After deployment, you can test the contract functions:

```bash
# Notarize a file
soroban contract invoke \
  --id <contract-id> \
  --source <your-account-secret-key> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- notarize --file_hash <32-byte-hash> --owner <owner-address>

# Verify a file
soroban contract invoke \
  --id <contract-id> \
  --source <your-account-secret-key> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- verify --file_hash <32-byte-hash>
```