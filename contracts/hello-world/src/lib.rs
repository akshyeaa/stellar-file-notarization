#![no_std]

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, Map, Symbol, Vec, Val, IntoVal};

#[contract]
pub struct Notarization;

#[contractimpl]
impl Notarization {
    /// Store a file's SHA-256 hash with owner & timestamp.
    /// - `file_hash`: 32-byte SHA-256 (BytesN<32>)
    /// - `owner`: account that notarizes
    pub fn notarize(env: Env, file_hash: BytesN<32>, owner: Address) {
        let key = Symbol::new(&env, "records");

        // Load existing map or create a new one
        let mut records: Map<BytesN<32>, (Address, u64)> =
            env.storage().persistent().get(&key).unwrap_or(Map::new(&env));

        let timestamp = env.ledger().timestamp();
        records.set(file_hash.clone(), (owner, timestamp));
        env.storage().persistent().set(&key, &records);
    }

    /// Check if a file hash exists in storage.
    pub fn verify(env: Env, file_hash: BytesN<32>) -> bool {
        let key = Symbol::new(&env, "records");
        if let Some(records) =
            env.storage()
                .persistent()
                .get::<_, Map<BytesN<32>, (Address, u64)>>(&key)
        {
            records.contains_key(file_hash)
        } else {
            false
        }
    }
    
    /// Get the details of a notarized file.
    /// Returns a vector with [exists, owner_address, timestamp] 
    /// exists: 1 if found, 0 if not found
    /// owner_address: the owner's address as a string value
    /// timestamp: the timestamp when notarized
    pub fn get_details(env: Env, file_hash: BytesN<32>) -> Vec<Val> {
        let key = Symbol::new(&env, "records");
        let mut result = Vec::new(&env);
        
        if let Some(records) =
            env.storage()
                .persistent()
                .get::<_, Map<BytesN<32>, (Address, u64)>>(&key)
        {
            if let Some((owner, timestamp)) = records.get(file_hash) {
                result.push_back(1i32.into()); // exists
                result.push_back(owner.to_val()); // owner address
                result.push_back(timestamp.into_val(&env)); // timestamp
            } else {
                result.push_back(0i32.into()); // not found
            }
        } else {
            result.push_back(0i32.into()); // not found
        }
        
        result
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, BytesN, Env};

    #[test]
    fn test_notarize_and_verify() {
        let env = Env::default();
        let owner = Address::random(&env);
        let file_hash = BytesN::<32>::from_array(&env, &[7; 32]);

        let contract_id = env.register(Notarization, ());
        let client = NotarizationClient::new(&env, &contract_id);

        client.notarize(&file_hash, &owner);
        assert!(client.verify(&file_hash));

        let other = BytesN::<32>::from_array(&env, &[1; 32]);
        assert!(!client.verify(&other));
    }
}