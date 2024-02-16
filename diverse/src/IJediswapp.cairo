use starknet::{get_caller_address, get_contract_address, info::get_block_timestamp, ContractAddress};


#[derive(Drop, Serde, starknet::Store)]
struct ExactInputSingleParams {
    token_in: ContractAddress,
    token_out: ContractAddress,
    fee: u32,
    recipient: ContractAddress,
    deadline: u64,
    amount_in: u256,
    amount_out_minimum: u256,
    sqrt_price_limit_X96: u256
}



#[starknet::interface]
trait IJediSwapV2SwapRouter<TContractState> {
    // fn get_factory(self: @TContractState) -> ContractAddress;
    fn exact_input_single(ref self: TContractState, params: ExactInputSingleParams) -> u256;
    // fn exact_input(ref self: TContractState, params: ExactInputParams) -> u256;
    // fn exact_output_single(ref self: TContractState, params: ExactOutputSingleParams) -> u256;
    // fn exact_output(ref self: TContractState, params: ExactOutputParams) -> u256;
    // fn jediswap_v2_swap_callback(ref self: TContractState, amount0_delta: i256, amount1_delta: i256, callback_data_span: Span<felt252>);
}