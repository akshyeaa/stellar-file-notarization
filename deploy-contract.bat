@echo off
REM Deployment script for the File Notarization Smart Contract
REM This script builds and deploys the Soroban contract to the Stellar testnet

echo Building the contract...
cd contracts\hello-world
cargo build --release --target wasm32-unknown-unknown

if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo ✅ Build successful

echo Deploying contract to Stellar testnet...
REM Note: You'll need to replace the source account with your actual secret key
REM and update the RPC URL and network passphrase if needed

soroban contract deploy ^
  --wasm target\wasm32-unknown-unknown\release\file_notarization.wasm ^
  --source <YOUR_SECRET_KEY_HERE> ^
  --rpc-url https://soroban-testnet.stellar.org ^
  --network-passphrase "Test SDF Network ; September 2015"

if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    exit /b 1
)

echo ✅ Contract deployed successfully
echo 📝 Don't forget to update the CONTRACT_ID in apps\web\.env.local with the new contract address