use starknet::{class_hash, class_hash_to_felt252}

#[starknet::interface]
trait INftWallet<TContractState> {
    fn increase_balance(ref self: TContractState, amount: felt252);
    fn get_balance(self: @TContractState) -> felt252;
    fn create_wallet;
    fn get_user_Wallets();
    fn get_walletDetails();
    fn transfer_wallet;
}

#[starknet::contract]
mod NftWallet {
    use diverse::interfaces::IERC721::{IERC721DispatcherTrait, IERC721Dispatcher};
    use diverse::interfaces::IRegistry::{IRegistryTrait, IRegistryDispatcher}

    #[storage]
    struct Storage {
        balance: felt252, 
        acct_class_hash: felt252,
        total_accounts: u256,
        users_accounts: Array<u256>.
        walletData: LegacyMap<u256, walletData>,
    }

    struct walletData {
        walletId: u256,
        creationTime: u256,
        creatorAddress: ContractAddress,
        current_owner: u256,
        allOwners: Array<ContractAddress>
    }

    #[abi(embed_v0)]
    impl HelloStarknetImpl of super::IHelloStarknet<ContractState> {
        fn increase_balance(ref self: ContractState, amount: felt252) {
            assert(amount != 0, 'Amount cannot be 0');
            self.balance.write(self.balance.read() + amount);
        }

        fn get_balance(self: @ContractState) -> felt252 {
            self.balance.read()
        }
    }
}
