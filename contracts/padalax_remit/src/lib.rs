#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, Bytes,
    BytesN, Env, String, Symbol,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum PadalaError {
    AlreadyInitialized = 1,
    RemittanceNotFound = 2,
    RemittanceAlreadyClaimed = 3,
    RemittanceAlreadyRefunded = 4,
    RemittanceExpired = 5,
    RemittanceNotExpired = 6,
    InvalidPreimage = 7,
    InvalidAmount = 8,
    InvalidExpiry = 9,
    Unauthorized = 10,
}

#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum RemittanceStatus {
    Pending = 0,
    Claimed = 1,
    Refunded = 2,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Remittance {
    pub id: u32,
    pub sender: Address,
    pub recipient: Address,
    pub token: Address,
    pub claim_hash: BytesN<32>,
    pub amount: i128,
    pub expiry_timestamp: u64,
    pub status: RemittanceStatus,
    pub memo: String,
}

#[contracttype]
pub enum DataKey {
    Remittance(u32),
    TotalVolume,
}

const TOPIC_REMIT: Symbol = symbol_short!("remit");
const EVENT_CREATE: Symbol = symbol_short!("created");
const EVENT_CLAIM: Symbol = symbol_short!("claimed");
const EVENT_REFUND: Symbol = symbol_short!("refunded");

// Storage TTL configuration (Ledger sequence bumps)
const PERSISTENT_BUMP_AMOUNT: u32 = 100_000;
const PERSISTENT_LIFETIME_THRESHOLD: u32 = 50_000;

#[contract]
pub struct PadalaXRemitContract;

#[contractimpl]
impl PadalaXRemitContract {
    /// 1. Create a new locked remittance voucher and transfer tokens into contract escrow
    pub fn create_remittance(
        env: Env,
        sender: Address,
        token: Address,
        id: u32,
        claim_hash: BytesN<32>,
        amount: i128,
        expiry_timestamp: u64,
        memo: String,
    ) -> u32 {
        sender.require_auth();

        if amount <= 0 {
            panic!("Amount must be greater than zero");
        }

        let current_time = env.ledger().timestamp();
        if expiry_timestamp <= current_time {
            panic!("Expiry must be in the future");
        }

        let key = DataKey::Remittance(id);
        if env.storage().persistent().has(&key) {
            panic!("Remittance ID already exists");
        }

        // Lock funds into contract escrow
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&sender, &env.current_contract_address(), &amount);

        // Initialize with sender as placeholder recipient until claimed
        let remittance = Remittance {
            id,
            sender: sender.clone(),
            recipient: sender.clone(),
            token,
            claim_hash,
            amount,
            expiry_timestamp,
            status: RemittanceStatus::Pending,
            memo,
        };

        env.storage().persistent().set(&key, &remittance);
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);

        // Update Total Volume
        let total_vol: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::TotalVolume)
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&DataKey::TotalVolume, &(total_vol + amount));
        env.storage().persistent().extend_ttl(
            &DataKey::TotalVolume,
            PERSISTENT_LIFETIME_THRESHOLD,
            PERSISTENT_BUMP_AMOUNT,
        );

        // Emit Creation Event
        env.events()
            .publish((TOPIC_REMIT, EVENT_CREATE, sender), (id, amount, expiry_timestamp));

        id
    }

    /// 2. Claim remittance using secret preimage code and transfer escrowed funds to recipient
    pub fn claim_remittance(
        env: Env,
        recipient: Address,
        id: u32,
        claim_preimage: Bytes,
    ) -> bool {
        recipient.require_auth();

        let key = DataKey::Remittance(id);
        let mut remittance: Remittance = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("Remittance not found"));

        if remittance.status != RemittanceStatus::Pending {
            panic!("Remittance already claimed or refunded");
        }

        let current_time = env.ledger().timestamp();
        if current_time > remittance.expiry_timestamp {
            panic!("Remittance has expired; cannot be claimed");
        }

        // Verify SHA-256 Hash Preimage
        let calculated_hash: BytesN<32> = env.crypto().sha256(&claim_preimage).into();
        if calculated_hash != remittance.claim_hash {
            panic!("Invalid claim code preimage");
        }

        // Transfer funds from contract escrow to recipient
        let token_client = token::Client::new(&env, &remittance.token);
        token_client.transfer(&env.current_contract_address(), &recipient, &remittance.amount);

        // Update state to Claimed
        remittance.status = RemittanceStatus::Claimed;
        remittance.recipient = recipient.clone();
        env.storage().persistent().set(&key, &remittance);
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);

        // Emit Claim Event
        env.events()
            .publish((TOPIC_REMIT, EVENT_CLAIM, recipient), (id, remittance.amount));

        true
    }

    /// 3. Refund unclaimed remittance back to sender after expiration
    pub fn refund_remittance(env: Env, sender: Address, id: u32) -> bool {
        sender.require_auth();

        let key = DataKey::Remittance(id);
        let mut remittance: Remittance = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("Remittance not found"));

        if remittance.sender != sender {
            panic!("Unauthorized: Only original sender can refund");
        }

        if remittance.status != RemittanceStatus::Pending {
            panic!("Remittance not in pending status");
        }

        let current_time = env.ledger().timestamp();
        if current_time <= remittance.expiry_timestamp {
            panic!("Remittance has not expired yet");
        }

        // Transfer funds from contract escrow back to sender
        let token_client = token::Client::new(&env, &remittance.token);
        token_client.transfer(&env.current_contract_address(), &sender, &remittance.amount);

        // Update state to Refunded
        remittance.status = RemittanceStatus::Refunded;
        env.storage().persistent().set(&key, &remittance);
        env.storage()
            .persistent()
            .extend_ttl(&key, PERSISTENT_LIFETIME_THRESHOLD, PERSISTENT_BUMP_AMOUNT);

        // Emit Refund Event
        env.events()
            .publish((TOPIC_REMIT, EVENT_REFUND, sender), (id, remittance.amount));

        true
    }

    /// 4. View Remittance Details (Read-only query)
    pub fn get_remittance(env: Env, id: u32) -> Remittance {
        let key = DataKey::Remittance(id);
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("Remittance not found"))
    }

    /// 5. View Total Protocol Volume (Read-only query)
    pub fn get_total_volume(env: Env) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::TotalVolume)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
