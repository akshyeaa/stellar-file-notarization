#!/bin/bash

# Deployment script for the File Notarization Smart Contract
# This script builds and deploys the Soroban contract to the Stellar testnet

echo "Building the contract..."
cd contracts/hello-world
cargo build --release --target wasm32-unknown-unknown

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

echo "Deploying contract to Stellar testnet..."
# Note: You'll need to replace the source account with your actual secret key
# and update the RPC URL and network passphrase if needed

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/file_notarization.wasm \
  --source <YOUR_SECRET_KEY_HERE> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo "✅ Contract deployed successfully"
echo "📝 Don't forget to update the CONTRACT_ID in apps/web/.env.local with the new contract address"