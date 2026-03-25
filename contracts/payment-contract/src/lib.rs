#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod advanced_dapp {
    use ink::storage::Mapping;

    #[ink(storage)]
    pub struct AdvancedDapp {
        owner: AccountId,
        balances: Mapping<AccountId, Balance>,
        total_deposit: Balance,
    }

    #[ink(event)]
    pub struct Deposited {
        #[ink(topic)]
        user: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct Withdrawn {
        #[ink(topic)]
        user: AccountId,
        amount: Balance,
    }

    #[ink(event)]
    pub struct OwnershipTransferred {
        #[ink(topic)]
        old_owner: AccountId,
        #[ink(topic)]
        new_owner: AccountId,
    }

    impl AdvancedDapp {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                owner: Self::env().caller(),
                balances: Mapping::default(),
                total_deposit: 0,
            }
        }

        /// Deposit funds into contract
        #[ink(message, payable)]
        pub fn deposit(&mut self) {
            let caller = self.env().caller();
            let amount = self.env().transferred_value();

            let current_balance = self.balances.get(caller).unwrap_or(0);
            self.balances.insert(caller, &(current_balance + amount));

            self.total_deposit += amount;

            self.env().emit_event(Deposited {
                user: caller,
                amount,
            });
        }

        /// Withdraw funds
        #[ink(message)]
        pub fn withdraw(&mut self, amount: Balance) -> Result<(), &'static str> {
            let caller = self.env().caller();
            let balance = self.balances.get(caller).unwrap_or(0);

            if balance < amount {
                return Err("Insufficient balance");
            }

            // Update state first (important for safety)
            self.balances.insert(caller, &(balance - amount));
            self.total_deposit -= amount;

            if self.env().transfer(caller, amount).is_err() {
                return Err("Transfer failed");
            }

            self.env().emit_event(Withdrawn {
                user: caller,
                amount,
            });

            Ok(())
        }

        /// Only owner can call
        fn only_owner(&self) -> Result<(), &'static str> {
            if self.env().caller() != self.owner {
                return Err("Not owner");
            }
            Ok(())
        }

        /// Transfer ownership
        #[ink(message)]
        pub fn transfer_ownership(
            &mut self,
            new_owner: AccountId,
        ) -> Result<(), &'static str> {
            self.only_owner()?;

            let old_owner = self.owner;
            self.owner = new_owner;

            self.env().emit_event(OwnershipTransferred {
                old_owner,
                new_owner,
            });

            Ok(())
        }

        /// Get user balance
        #[ink(message)]
        pub fn get_balance(&self, user: AccountId) -> Balance {
            self.balances.get(user).unwrap_or(0)
        }

        /// Get total deposited in contract
        #[ink(message)]
        pub fn get_total_deposit(&self) -> Balance {
            self.total_deposit
        }

        /// Get contract owner
        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
            self.owner
        }
    }
}