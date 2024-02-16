use starknet::{ClassHash, class_hash_to_felt252, ContractAddress};
use core::dict::Felt252DictEntryTrait;
use core::array::ArrayTrait;

#[derive(Drop, Serde, starknet::Store)]
struct walletData {
    walletId: u256,
    contractAddr: ContractAddress,
    creationTime: u256,
    creatorAddress: ContractAddress,
    current_owner: ContractAddress,
}

#[starknet::interface]
trait INftWalletTwo<TContractState> {
    fn create_wallet(ref self: TContractState, tokenUri: felt252) -> ContractAddress;
    fn get_user_Wallets(self: @TContractState, user: ContractAddress) -> Array<u256>;
    fn get_walletDetails(self: @TContractState, walletId: u256) -> walletData;
    fn transfer_wallet(ref self: TContractState,  walletID: u256, receiver: ContractAddress);
}

#[starknet::contract]
mod NftWalletTwo {
    use core::traits::Into;
use diverse::IRegistry::{IRegistryDispatcherTrait, IRegistryDispatcher};
    use super::{ClassHash, walletData};
    use diverse::IERC721::{IERC721DispatcherTrait, IERC721Dispatcher};
    use starknet::{get_caller_address, get_contract_address, info::get_block_timestamp, ContractAddress, Zeroable};
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use super::{ArrayTrait, class_hash_to_felt252};

    #[storage]
    struct Storage {
        balance: felt252, 
        acct_class_hash: felt252,
        registryContract: IRegistryDispatcher,
        total_accounts: u256,
        // users_accounts: LegacyMap<ContractAddress, Array<u256>>,
        users_accounts: LegacyMap<ContractAddress, u256>,
        user_acc_Id: LegacyMap<u256, u256>,
        walletDataRec: LegacyMap<u256, walletData>,
        user_account_count: LegacyMap<ContractAddress, u256>,
        NftContract: IERC721Dispatcher,
        moderator: ContractAddress,
        NftTotalOwner: LegacyMap<u256, u256>,
        allOwners: LegacyMap<u256, ContractAddress>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, registryContract: ContractAddress, account_hash: ClassHash, NftContract: ContractAddress) {
        self.moderator.write(get_caller_address());
        self.acct_class_hash.write(class_hash_to_felt252(account_hash));
        self.registryContract.write(IRegistryDispatcher { contract_address: registryContract });
        self.NftContract.write(IERC721Dispatcher { contract_address: NftContract });
    }

    #[abi(embed_v0)]
    impl NftWalletTwo of super::INftWalletTwo<ContractState> {
        fn create_wallet(ref self: ContractState, tokenUri: felt252) -> ContractAddress {
            self.NftContract.read().mint(get_caller_address(), self.total_accounts.read(), tokenUri);
            let wallet_address = self.registryContract.read()
                .create_account(self.acct_class_hash.read(),
                                self.NftContract.read().contract_address, 
                                self.total_accounts.read(), 
                                self.user_account_count.read(get_caller_address()).try_into().unwrap());
            self.update_storage(get_caller_address(), wallet_address);
            return wallet_address;
        }

        fn transfer_wallet(ref self: ContractState,  walletID: u256, receiver: ContractAddress) {
            assert(receiver.is_non_zero(), 'ERROR: address zero receiver');
            assert(self.walletDataRec.read(walletID).current_owner == get_caller_address(), 'ERROR: Not a valid caller');
            self.NftContract.read().transfer_from(get_caller_address(), receiver, walletID);
            self.after_transfer(get_caller_address(), receiver, walletID);
        }

        fn get_user_Wallets(self: @ContractState, user: ContractAddress) -> Array<u256> {
            assert(user.is_non_zero(), 'ERROR: address zero user');
            let mut userAccounts = ArrayTrait::new();
            let totalAccounts = self.users_accounts.read(user);
            let mut i = 1;
            loop {
                if i > totalAccounts {
                    break;
                }
                let newWallet = self.user_acc_Id.read(i);
                userAccounts.append(newWallet);
                i += 1;
            };
            return userAccounts;
        }

        fn get_walletDetails(self: @ContractState, walletId: u256) -> walletData {
            assert (walletId <= self.total_accounts.read(), 'ERROR: Invalid walletId');
            let walletDetails = self.walletDataRec.read(walletId);
            return walletDetails;
        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn update_storage(ref self: ContractState, user: ContractAddress, contractAddr: ContractAddress) {
            let newWallet = walletData {
                walletId: self.total_accounts.read(),
                contractAddr: contractAddr,
                creationTime: get_block_timestamp().into(),
                creatorAddress: user,
                current_owner: user,
                // allOwners: ArrayTrait::new(),
            };
            self.walletDataRec.write(self.total_accounts.read(), newWallet);
            self.users_accounts.write(user, self.users_accounts.read(user) + 1);
            self.user_acc_Id.write(self.users_accounts.read(user), self.total_accounts.read());
            self.total_accounts.write(self.total_accounts.read() + 1);
            self.user_account_count.write(user, self.user_account_count.read(user) + 1);
        }

        fn after_transfer(ref self: ContractState, prevOwner: ContractAddress, newOwner: ContractAddress, walletID: u256) {
            let mut walletData = self.walletDataRec.read(walletID);
            walletData.current_owner = newOwner;
            self.walletDataRec.write(walletID, walletData);
            self.NftTotalOwner.write(walletID, self.NftTotalOwner.read(walletID) + 1);
            self.allOwners.write(self.NftTotalOwner.read(walletID), prevOwner);
            self.update_users_wallets(prevOwner, walletID);
            self.users_accounts.write(prevOwner, self.users_accounts.read(newOwner) + 1);
            self.user_acc_Id.write(self.users_accounts.read(prevOwner), walletID);
            self.user_account_count.write(newOwner, self.user_account_count.read(newOwner) + 1);
        }

        fn update_users_wallets (ref self: ContractState, user: ContractAddress, walletID: u256) {
            let (found, index) = self.findIndex(user, walletID);
            assert(found, 'ERROR:PrevOwner index not found');

            let userAccCount = self.users_accounts.read(user);
            let lastAccount = self.user_acc_Id.read(userAccCount);
            self.users_accounts.write(user, self.users_accounts.read(user) - 1);
            self.user_acc_Id.write(index, lastAccount);
        }

        fn findIndex (self: @ContractState, user: ContractAddress, walletID: u256) -> (bool, u256) {
            let accCount = self.users_accounts.read(user);

            let mut i: u256 = 1;
            let mut found = false;
            let mut index = 0;
            loop {
                if (i > accCount ) {
                    break;
                }
                if (self.user_acc_Id.read(i) == walletID) {
                    found = true;
                    index = i;
                    break;
                };

                i = i + 1;               
            };
            return (found, index);
        }

    }


}