use starknet::{class_hash, class_hash_to_felt252, ContractAddress};

struct walletData {
    walletId: u256,
    contractAddr: ContractAddress,
    creationTime: u256,
    creatorAddress: ContractAddress,
    current_owner: u256,
    allOwners: Array<ContractAddress>
}

#[starknet::interface]
trait INftWallet<TContractState> {
    fn increase_balance(ref self: TContractState, amount: felt252);
    fn get_balance(self: @TContractState) -> felt252;
    fn create_wallet(ref self: TContractState, tokenUri: felt252) -> ContractAddress;
    fn get_user_Wallets(self: @TContractState, user: ContractAddress) -> Array<u256>;
    fn get_walletDetails(self: @TContractState, walletId: u256) -> walletData;
    fn transfer_wallet(ref self: TContractState,  walletID: u256, receiver: ContractAddress);
}

#[starknet::contract]
mod NftWallet {
    use diverse::interfaces::IERC721::{IERC721DispatcherTrait, IERC721Dispatcher};
    use diverse::interfaces::IRegistry::{IRegistryTrait, IRegistryDispatcher};
    use super::{class_hash, walletData};
    use starknet::{get_caller_address, get_contract_address, info::get_block_timestamp, ArrayTrait, ContractAddress};
    use zeroable::Zeroable;

    #[storage]
    struct Storage {
        balance: felt252, 
        acct_class_hash: felt252,
        registryContract: IRegistryDispatcher,
        total_accounts: u256,
        users_accounts: LegacyMap<ContractAddress, Array<u256>>,
        walletData: LegacyMap<u256, walletData>,
        user_account_count: LegacyMap<ContractAddress, u256>,
        NftContract: IERC721Dispatcher,
        moderator: ContractAddress,
    }



    #[constructor]
    fn constructor(ref self: ContractState, registryContract: ContractAddress, account_hash: class_hash, NftContract: ContractAddress) {
        self.moderator.write(get_caller_address());
        self.acct_class_hash.write((account_hash).tryInto().unwrap());
        self.registryContract.write(IRegistryDispatcher { contract_address: registryContract });
        self.NftContract.write(IERC721Dispatcher { contract_address: NftContract });
    }

    #[abi(embed_v0)]
    impl HelloStarknetImpl of super::IHelloStarknet<ContractState> {

        fn create_wallet(ref self: @ContractState, tokenUri: felt252) -> ContractAddress {
            self.NftContract.read().mint(get_caller_address(), self.total_accounts.read(), tokenUri)
            let wallet_address = self.registryContract.read().create_account(self.acct_class_hash.read(), self.NftContract.read().contract_address, self.total_accounts.read(), self.user_account_count.read(get_caller_address()).tryInto());
            self.update_storage(get_caller_address(), wallet_address);
        }

        fn transfer_wallet(ref self: TContractState,  walletID: u256, receiver: ContractAddress) {
            assert(receiver.is_non_zero(), 'ERROR: address zero receiver');
            assert(self.walletData.read(walletID).current_owner == get_caller_address(), 'ERROR: Not a valid caller');
            self.NftContract.read().transfer_from(get_caller_address(), receiver, walletID);
            self.after_transfer(get_caller_address(), receiver, walletID);
        }

        fn get_user_Wallets(self: @TContractState, user: ContractAddress) -> Array<u256> {
            assert(user.is_non_zero(), 'ERROR: address zero user');
            let userAccounts = self.users_accounts.read(user);
            return userAccounts;
        }

        fn get_walletDetails(self: @TContractState, walletId: u256) -> walletData {
            assert (walletId <= self.total_accounts.read(), 'ERROR: Invalid walletId');
            let walletDetails = self.walletData.read(walletId);
            return walletDetails;
        }

        
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn update_storage(ref self: ContractState, user: ContractAddress, contractAddr: ContractAddress) {
            let newWallet = walletData {
                walletId: self.total_accounts.read(),
                contractAddress: contractAddr,
                creationTime: get_block_timestamp(),
                creatorAddress: user,
                current_owner: user,
                allOwners: array![],
            };
            self.walletData.write(self.total_accounts.read(), newWallet);
            let mut usersAccounts = self.users_accounts.read(user);
            usersAccounts.append(self.total_accounts.read());
            self.users_accounts.write(user, usersAccounts);
            self.total_accounts.write(self.total_accounts.read() + 1);
            self.user_account_count.write(user, self.user_account_count.read(user) + 1);
        }

        fn after_transfer(ref self: ContractState, prevOwner: ContractAddress, newOwner: ContractAddress, walletID: u256) {
            let mut walletData = self.walletData.read(walletID);
            walletData.current_owner = newOwner;
            wallet_address = walletData.allOwners.append(prevOwner);
            self.walletData.write(walletID, walletData);
            self.update_users_wallets(prevOwner, walletID);
            let mut userAccounts = self.users_accounts.read(newOwner);
            userAccounts.append(walletID);
            self.users_accounts.write(newOwner, userAccounts);
        }

        fn update_users_wallets (ref self: ContractState, user: ContractAddress, walletID: u256) {
            let mut userAccounts = self.users_accounts.read(user);
            let (found, index) = self.findIndex(userAccounts, walletID);
            assert(found, 'ERROR: index not found in prevOwner');
            userAccounts[index] = userAccounts[userAccounts.length - 1];

            // confirm pop or popfront.
            userAccounts.pop();

            self.users_accounts.write(user, userAccounts);
        }

        fn findIndex (dataArray: Array<u256>, data: u256) -> (bool, u256) {
            let mut i = 0;
            let mut found = false;
            let index = 0;
            loop {
                if (i >= dataArray.length ) {
                    break;
                }
                if (dataArray[i] == data) {
                    found = true;
                    index = i;
                    break;
                }

                i = i + 1;               
            }
            return (found, index);
        }
    }
}
