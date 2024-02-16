use starknet::{ClassHash, class_hash_to_felt252, ContractAddress};
#[starknet::interface]
trait IRegistry<TContractState> {
    fn create_account(
        ref self: TContractState,
        implementation_hash: felt252,
        token_contract: ContractAddress,
        token_id: u256,
        salt: felt252
    ) -> ContractAddress;
    fn get_account(
        self: @TContractState,
        implementation_hash: felt252,
        token_contract: ContractAddress,
        token_id: u256,
        salt: felt252
    ) -> ContractAddress;
    fn total_deployed_accounts(
        self: @TContractState, token_contract: ContractAddress, token_id: u256
    ) -> u8;
}



////////////////////////////////
// Registry contract
////////////////////////////////
#[starknet::contract]
mod Registry {
    use core::result::ResultTrait;
    use core::hash::HashStateTrait;
    use starknet::{
        ContractAddress, get_caller_address, syscalls::call_contract_syscall, class_hash::ClassHash,
        class_hash::Felt252TryIntoClassHash, syscalls::deploy_syscall, SyscallResultTrait, Zeroable
    };
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use core::array::{ArrayTrait, SpanTrait};
    use core::pedersen::PedersenTrait;

    use diverse::IERC721::{IERC721DispatcherTrait, IERC721Dispatcher};
    // use token_bound_accounts::IRegistry;

    #[storage]
    struct Storage {
        registry_deployed_accounts: LegacyMap<
            (ContractAddress, u256), u8
        >, // tracks no. of deployed accounts by registry for an NFT
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        AccountCreated: AccountCreated
    }

    /// @notice Emitted when a new tokenbound account is deployed/created
    /// @param account_address the deployed contract address of the tokenbound acccount
    /// @param token_contract the contract address of the NFT
    /// @param token_id the ID of the NFT
    #[derive(Drop, starknet::Event)]
    struct AccountCreated {
        account_address: ContractAddress,
        token_contract: ContractAddress,
        token_id: u256,
    }

    #[external(v0)]
    impl IRegistryImpl of super::IRegistry<ContractState> {
        /// @notice deploys a new tokenbound account for an NFT
        /// @param implementation_hash the class hash of the reference account
        /// @param token_contract the contract address of the NFT
        /// @param token_id the ID of the NFT
        /// @param salt random salt for deployment
        fn create_account(
            ref self: ContractState,
            implementation_hash: felt252,
            token_contract: ContractAddress,
            token_id: u256,
            salt: felt252
        ) -> ContractAddress {
            let owner = self._get_owner(token_contract, token_id);
            // assert(owner == get_caller_address(), 'CALLER_IS_NOT_OWNER');

            let mut constructor_calldata: Array<felt252> = array![
                token_contract.into(), token_id.low.into(), token_id.high.into()
            ];

            let class_hash: ClassHash = implementation_hash.try_into().unwrap();
            let result = deploy_syscall(class_hash, salt, constructor_calldata.span(), true);
            let (account_address, _) = result.unwrap_syscall();

            let new_deployment_index: u8 = self
                .registry_deployed_accounts
                .read((token_contract, token_id))
                + 1_u8;
            self.registry_deployed_accounts.write((token_contract, token_id), new_deployment_index);

            self.emit(AccountCreated { account_address, token_contract, token_id, });

            account_address
        }

        /// @notice calculates the account address for an existing tokenbound account
        /// @param implementation_hash the class hash of the reference account
        /// @param token_contract the contract address of the NFT
        /// @param token_id the ID of the NFT
        /// @param salt random salt for deployment
        fn get_account(
            self: @ContractState,
            implementation_hash: felt252,
            token_contract: ContractAddress,
            token_id: u256,
            salt: felt252
        ) -> ContractAddress {
            let constructor_calldata_hash = PedersenTrait::new(0)
                .update(token_contract.into())
                .update(token_id.low.into())
                .update(token_id.high.into())
                .update(3)
                .finalize();

            let prefix: felt252 = 'STARKNET_CONTRACT_ADDRESS';
            let account_address = PedersenTrait::new(0)
                .update(prefix)
                .update(0)
                .update(salt)
                .update(implementation_hash)
                .update(constructor_calldata_hash)
                .update(5)
                .finalize();

            account_address.try_into().unwrap()
        }

        /// @notice returns the total no. of deployed tokenbound accounts for an NFT by the registry
        /// @param token_contract the contract address of the NFT 
        /// @param token_id the ID of the NFT
        fn total_deployed_accounts(
            self: @ContractState, token_contract: ContractAddress, token_id: u256
        ) -> u8 {
            self.registry_deployed_accounts.read((token_contract, token_id))
        }
    }

    #[generate_trait]
    impl internalImpl of InternalTrait {
        /// @notice internal function for getting NFT owner
        /// @param token_contract contract address of NFT
        // @param token_id token ID of NFT
        // NB: This function aims for compatibility with all contracts (snake or camel case) but do not work as expected on mainnet as low level calls do not return err at the moment. Should work for contracts which implements CamelCase but not snake_case until starknet v0.15.
        fn _get_owner(
            self: @ContractState, token_contract: ContractAddress, token_id: u256
        ) -> ContractAddress {
            // let mut calldata: Array<felt252> = ArrayTrait::new();
            // Serde::serialize(@token_id, ref calldata);
            // let mut res = call_contract_syscall(
            //     token_contract, selector!("ownerOf"), calldata.span()
            // );
            // if (res.is_err()) {
            //     res = call_contract_syscall(token_contract, selector!("owner_of"), calldata.span());
            // }
            // let mut address = res.unwrap();
            let NftDistaptcher: IERC721Dispatcher = IERC721Dispatcher{contract_address: token_contract};
            let owner: ContractAddress = NftDistaptcher.ownerOf(token_id);
            // Serde::<ContractAddress>::deserialize(ref address).unwrap()
            return owner;
        }
    }
}
