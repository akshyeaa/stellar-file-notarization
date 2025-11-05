#![cfg(test)]

use super::*;
use soroban_sdk::{Env, testutils::Address as _, Address, BytesN};

#[test]
fn test_notarize_and_verify() {
    let env = Env::default();

    // Create a test account (mock Address)
    let owner = Address::random(&env);

    // Create a fake 32-byte file hash
    let file_hash = BytesN::<32>::from_array(&env, &[1; 32]); // [1,1,1,1,...]

    // Register and call the contract
    let contract_id = env.register(Notarization, ());
    let client = NotarizationClient::new(&env, &contract_id);

    // Notarize file
    client.notarize(&file_hash, &owner);

    // Verify file exists
    let result = client.verify(&file_hash);

    // Check that verification passes
    assert!(result);
}
