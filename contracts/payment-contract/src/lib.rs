#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, Env, Symbol, String, Address,
};

#[contract]
pub struct PaymentContract;

#[contracttype]
#[derive(Clone)]
pub struct Payment {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
    pub note: String,
}

#[contracttype]
pub enum PaymentKey {
    Payment(u32),
    Count,
}

#[contractimpl]
impl PaymentContract {
    pub fn make_payment(
        env: Env,
        from: Address,
        to: Address,
        amount: i128,
        note: String,
    ) -> Symbol {
        if amount <= 0 {
            return Symbol::new(&env, "INVALID");
        }

        from.require_auth();

        let mut count: u32 = env
            .storage()
            .instance()
            .get(&PaymentKey::Count)
            .unwrap_or(0);

        let payment = Payment {
            from: from.clone(),
            to,
            amount,
            note,
        };

        env.storage()
            .instance()
            .set(&PaymentKey::Payment(count), &payment);

        count += 1;
        env.storage()
            .instance()
            .set(&PaymentKey::Count, &count);

        Symbol::new(&env, "SUCCESS")
    }
}