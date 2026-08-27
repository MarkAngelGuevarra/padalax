#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Bytes, Env, String};

#[test]
fn test_create_and_claim_remittance_success() {
    let env = Env::default();
    env.mock_all_auths();

    // Set initial ledger timestamp to 1000
    env.ledger().set_timestamp(1000);

    let contract_id = env.register_contract(None, PadalaXRemitContract);
    let client = PadalaXRemitContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    let remittance_id: u32 = 88001;
    let amount: i128 = 250_0000000; // 250 XLM
    let expiry_timestamp: u64 = 5000; // 4000 seconds later
    let memo = String::from_str(&env, "Monthly OFW Allowance");

    // Secret claim code: "SECRET_PIN_2026"
    let secret_preimage = Bytes::from_slice(&env, b"SECRET_PIN_2026");
    let claim_hash: BytesN<32> = env.crypto().sha256(&secret_preimage).into();

    // 1. Create Remittance
    let created_id = client.create_remittance(
        &sender,
        &remittance_id,
        &claim_hash,
        &amount,
        &expiry_timestamp,
        &memo,
    );
    assert_eq!(created_id, remittance_id);

    // Verify Pending State
    let initial_remittance = client.get_remittance(&remittance_id);
    assert_eq!(initial_remittance.status, RemittanceStatus::Pending);
    assert_eq!(initial_remittance.amount, amount);
    assert_eq!(client.get_total_volume(), amount);

    // Advance time to 2000 (before expiry 5000)
    env.ledger().set_timestamp(2000);

    // 2. Claim Remittance with Secret Preimage
    let claim_success = client.claim_remittance(&recipient, &remittance_id, &secret_preimage);
    assert!(claim_success);

    // Verify Claimed State
    let claimed_remittance = client.get_remittance(&remittance_id);
    assert_eq!(claimed_remittance.status, RemittanceStatus::Claimed);
    assert_eq!(claimed_remittance.recipient, recipient);
}

#[test]
#[should_panic(expected = "Invalid claim code preimage")]
fn test_claim_with_wrong_preimage_panics() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1000);

    let contract_id = env.register_contract(None, PadalaXRemitContract);
    let client = PadalaXRemitContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);

    let remittance_id: u32 = 88002;
    let amount: i128 = 100_0000000;
    let expiry_timestamp: u64 = 5000;
    let memo = String::from_str(&env, "Test Wrong Preimage");

    let secret_preimage = Bytes::from_slice(&env, b"REAL_SECRET");
    let claim_hash: BytesN<32> = env.crypto().sha256(&secret_preimage).into();

    client.create_remittance(
        &sender,
        &remittance_id,
        &claim_hash,
        &amount,
        &expiry_timestamp,
        &memo,
    );

    // Try claiming with wrong preimage
    let wrong_preimage = Bytes::from_slice(&env, b"WRONG_GUESS");
    client.claim_remittance(&recipient, &remittance_id, &wrong_preimage);
}

#[test]
fn test_refund_after_expiration_success() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1000);

    let contract_id = env.register_contract(None, PadalaXRemitContract);
    let client = PadalaXRemitContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let remittance_id: u32 = 88003;
    let amount: i128 = 500_0000000;
    let expiry_timestamp: u64 = 3000;
    let memo = String::from_str(&env, "Emergency Medical Aid");

    let secret_preimage = Bytes::from_slice(&env, b"UNCLAIMED_CODE");
    let claim_hash: BytesN<32> = env.crypto().sha256(&secret_preimage).into();

    client.create_remittance(
        &sender,
        &remittance_id,
        &claim_hash,
        &amount,
        &expiry_timestamp,
        &memo,
    );

    // Fast-forward past expiry: timestamp 3001
    env.ledger().set_timestamp(3001);

    // Trigger Refund
    let refund_success = client.refund_remittance(&sender, &remittance_id);
    assert!(refund_success);

    let refunded_remittance = client.get_remittance(&remittance_id);
    assert_eq!(refunded_remittance.status, RemittanceStatus::Refunded);
}

#[test]
#[should_panic(expected = "Remittance has not expired yet")]
fn test_refund_before_expiration_fails() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1000);

    let contract_id = env.register_contract(None, PadalaXRemitContract);
    let client = PadalaXRemitContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let remittance_id: u32 = 88004;
    let amount: i128 = 150_0000000;
    let expiry_timestamp: u64 = 5000;
    let memo = String::from_str(&env, "Cannot Refund Early");

    let secret_preimage = Bytes::from_slice(&env, b"SECRET");
    let claim_hash: BytesN<32> = env.crypto().sha256(&secret_preimage).into();

    client.create_remittance(
        &sender,
        &remittance_id,
        &claim_hash,
        &amount,
        &expiry_timestamp,
        &memo,
    );

    // Try refunding at timestamp 2000 (before 5000) -> Should Panic
    env.ledger().set_timestamp(2000);
    client.refund_remittance(&sender, &remittance_id);
}

#[test]
#[should_panic(expected = "Unauthorized: Only original sender can refund")]
fn test_unauthorized_sender_cannot_refund() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1000);

    let contract_id = env.register_contract(None, PadalaXRemitContract);
    let client = PadalaXRemitContractClient::new(&env, &contract_id);

    let original_sender = Address::generate(&env);
    let malicious_attacker = Address::generate(&env);
    let remittance_id: u32 = 88005;
    let amount: i128 = 300_0000000;
    let expiry_timestamp: u64 = 3000;
    let memo = String::from_str(&env, "Unauthorized Refund Attack");

    let secret_preimage = Bytes::from_slice(&env, b"SECRET_KEY_2026");
    let claim_hash: BytesN<32> = env.crypto().sha256(&secret_preimage).into();

    client.create_remittance(
        &original_sender,
        &remittance_id,
        &claim_hash,
        &amount,
        &expiry_timestamp,
        &memo,
    );

    // Fast-forward past expiry
    env.ledger().set_timestamp(3001);

    // Attacker tries to refund funds they did not send -> Panic
    client.refund_remittance(&malicious_attacker, &remittance_id);
}

#[test]
#[should_panic(expected = "Remittance has expired; cannot be claimed")]
fn test_cannot_claim_expired_remittance() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().set_timestamp(1000);

    let contract_id = env.register_contract(None, PadalaXRemitContract);
    let client = PadalaXRemitContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let recipient = Address::generate(&env);
    let remittance_id: u32 = 88006;
    let amount: i128 = 200_0000000;
    let expiry_timestamp: u64 = 2500;
    let memo = String::from_str(&env, "Expired Claim Attempt");

    let secret_preimage = Bytes::from_slice(&env, b"VALID_CODE");
    let claim_hash: BytesN<32> = env.crypto().sha256(&secret_preimage).into();

    client.create_remittance(
        &sender,
        &remittance_id,
        &claim_hash,
        &amount,
        &expiry_timestamp,
        &memo,
    );

    // Advance time past expiry
    env.ledger().set_timestamp(2600);

    // Recipient tries to claim after expiry -> Panic
    client.claim_remittance(&recipient, &remittance_id, &secret_preimage);
}
