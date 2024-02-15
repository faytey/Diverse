use starknet::ContractAddress;
use starknet::ClassHash;
use starknet::account::Call;

#[starknet::interface]
trait IAccount<TContractState> {
    fn is_valid_signature(
        self: @TContractState, hash: felt252, signature: Span<felt252>
    ) -> felt252;
    fn __validate__(ref self: TContractState, calls: Array<Call>) -> felt252;
    fn __validate_declare__(self: @TContractState, class_hash: felt252) -> felt252;
    fn __validate_deploy__(
        self: @TContractState, class_hash: felt252, contract_address_salt: felt252
    ) -> felt252;
    fn __execute__(ref self: TContractState, calls: Array<Call>) -> Array<Span<felt252>>;
    fn token(self: @TContractState) -> (ContractAddress, u256);
    fn owner(
        self: @TContractState, token_contract: ContractAddress, token_id: u256
    ) -> ContractAddress;
    fn upgrade(ref self: TContractState, implementation: ClassHash);
    fn lock(ref self: TContractState, duration: u64);
    fn is_locked(self: @TContractState) -> (bool, u64);
    fn supports_interface(self: @TContractState, interface_id: felt252) -> bool;
}
