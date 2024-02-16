use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
    struct exchangeRecord {
        transactionId: u256,
        fromToken: ContractAddress,
        toToken: ContractAddress,
        exchangeAmount: u256,
        amountReceived: u256,
    }

#[starknet::interface]
trait ISwapp<TContractState> {
    fn swapMultipleToken(ref self: TContractState, spendTokens: Array::<ContractAddress>, spendAmount: Array::<u256>, receiveToken: ContractAddress) -> bool;
    fn swapSingleToken(ref self: TContractState, spendToken: ContractAddress, receiveToken: ContractAddress, amount: u256) -> bool;
    fn getSwapHistory(self: @TContractState, userAddress: ContractAddress) -> Array::<u256>;
    fn getSwapDetails(self: @TContractState, swapId: u256) -> Array::<exchangeRecord>;
    fn updateRouter(ref self: TContractState, router: ContractAddress, sqrt_price_limit: u256);
    fn viewRouter(self: @TContractState) -> ContractAddress;
}


#[starknet::contract]
mod Swapp {
    use core::traits::Into;
    use starknet::{get_caller_address, get_contract_address, info::get_block_timestamp, ContractAddress};
    use diverse::IERC20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use diverse::IJediswapp::{IJediSwapV2SwapRouterDispatcher, IJediSwapV2SwapRouterDispatcherTrait, ExactInputSingleParams};
    use super::exchangeRecord;
    use core::option::OptionTrait;
    use core::traits::TryInto;
    use core::dict::Felt252DictEntryTrait;
    use core::array::ArrayTrait;

    #[storage]
    struct Storage {
        allTransactions: u256,
        userTransactionCount: LegacyMap::<ContractAddress, u256>,
        userTransactions: LegacyMap::<(ContractAddress, u256), u256>,
        noOfTransactions: LegacyMap::<u256, u256>,
        transactionsData: LegacyMap::<(u256, u256), exchangeRecord>,
        router: IJediSwapV2SwapRouterDispatcher,
        admin: ContractAddress,
        sqrt_price_limit: u256,
    }

    #[constructor]
    fn constructor(ref self: ContractState, routerContract: ContractAddress) {
        self.router.write(IJediSwapV2SwapRouterDispatcher{contract_address: routerContract});
        self.admin.write(get_caller_address());
    }

    #[abi(embed_v0)]
    impl SwappImpl of super::ISwapp<ContractState> {
        fn swapSingleToken(ref self: ContractState, spendToken: ContractAddress, receiveToken: ContractAddress, amount :u256) -> bool {
            let hasSufficientBall = self._confirmBalance(get_caller_address(), spendToken, amount);
            assert(hasSufficientBall, 'insufficient balance');
            let hasSufficientAllowance = self._confirmAllowance(get_caller_address(), spendToken, amount);
            assert(hasSufficientAllowance, 'insufficient Allowance');
            let totalTransaction: u256 = self.allTransactions.read() + 1;
            self.allTransactions.write(totalTransaction);
            let user = get_caller_address();

            self._takeFunds(user, spendToken, amount);

           let _newTx: ExactInputSingleParams = self._buildTxRequest(spendToken, receiveToken, amount);
            let amountReceived = self.router.read().exact_input_single(_newTx);

            let newRecord = exchangeRecord {
                transactionId: totalTransaction,
                fromToken: spendToken,
                toToken: receiveToken,
                exchangeAmount: amount,
                amountReceived,
            };

            let userTxCount = self.userTransactionCount.read(user);
            self.noOfTransactions.write(totalTransaction, 1);
            self.userTransactionCount.write(user, userTxCount + 1);
            self.userTransactions.write((user, self.userTransactionCount.read(user)), totalTransaction);
            self.transactionsData.write((totalTransaction, 1), newRecord);
            return true;
        }

        fn swapMultipleToken(ref self: ContractState, spendTokens: Array::<ContractAddress>, spendAmount: Array::<u256>, receiveToken: ContractAddress) -> bool {
            assert( spendTokens.len() == spendAmount.len(), 'Tokens and amount mismatch');
            let totalTransaction: u256 = self.allTransactions.read() + 1;
            self.allTransactions.write(totalTransaction);
            let user = get_caller_address();
            // let batchTransactions: Array<exchangeRecord> = ArrayTrait::new();
            let mut i: u32 = 0;

            loop {
                if i >= spendTokens.len().into(){
                    break;
                }
                let token = IERC20Dispatcher{contract_address: *spendTokens.at(i)};
                token.transferFrom(get_caller_address(), get_contract_address(), *spendAmount.at(i));
                token.approve(self.router.read().contract_address, *spendAmount.at(i));

                let newTx = ExactInputSingleParams {
                    token_in: *spendTokens.at(i),
                    token_out: receiveToken,
                    fee: 500,
                    recipient: get_caller_address(),
                    deadline: get_block_timestamp() +  100,
                    amount_in: *spendAmount.at(i) - 500,
                    amount_out_minimum: 0,
                    sqrt_price_limit_X96: 0
                };
                let amountReceived = self.router.read().exact_input_single(newTx);

                let newRecord = exchangeRecord {
                    transactionId: totalTransaction,
                    fromToken: *spendTokens.at(i),
                    toToken: receiveToken,
                    exchangeAmount: *spendAmount.at(i),
                    amountReceived
                };

                self.transactionsData.write((totalTransaction, i.into()), newRecord);
                i = i + 1;
            };

            let totalTransaction: u256 = self.allTransactions.read() + 1;
            self.allTransactions.write(totalTransaction);
            self.noOfTransactions.write(totalTransaction, i.into());
            self.userTransactionCount.write(user, self.userTransactionCount.read(user) + 1);
            self.userTransactions.write((user, self.userTransactionCount.read(user) + 1), totalTransaction);

            // let mut userTransactions = self.userTransactions.read(user);
            // self.userTransactions.write(get_caller_address(), userTransactions);
            // self.transactionsData.write(totalTransaction, batchTransactions);
            return true;
        }

        fn getSwapHistory(self: @ContractState, userAddress: ContractAddress) -> Array::<u256> {
            let mut userTransactions = ArrayTrait::new(); 
            let noOfTx = self.userTransactionCount.read(userAddress);
            let mut i = 1;
            loop {
                if i > noOfTx {
                    break;
                }
                userTransactions.append(self.userTransactions.read((userAddress, i)));
                i+=1;
            };
            return userTransactions;
        }

        fn getSwapDetails(self: @ContractState, swapId: u256) -> Array::<exchangeRecord> {
            let mut swapDetails = ArrayTrait::new();
            let noOfSubTx = self.noOfTransactions.read(swapId);
            let mut i = 1;
            loop {
                if i > noOfSubTx {
                    break;
                }
                swapDetails.append(self.transactionsData.read((swapId, i)));
            };
            return swapDetails;
        }

        fn updateRouter(ref self: ContractState, router: ContractAddress, sqrt_price_limit: u256) {
            let caller = get_caller_address();
            assert(caller == self.admin.read(), 'UnAuthorized caller');
            self.router.write(IJediSwapV2SwapRouterDispatcher{contract_address: router});
            self.sqrt_price_limit.write(sqrt_price_limit);
        }

        fn viewRouter(self: @ContractState) -> ContractAddress {
            return self.router.read().contract_address;
        }
    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn _confirmBalance( self: @ContractState, userAddress: ContractAddress, tokensAddress: ContractAddress, amount: u256) -> bool {
            let token = IERC20Dispatcher{contract_address: tokensAddress};
            let userBalance = token.balanceOf(userAddress);
            assert(userBalance >= amount, 'ERROR: Insufficient balance');
            return true;
        }

        fn _confirmAllowance( self: @ContractState, userAddress: ContractAddress, tokensAddress: ContractAddress, amount: u256) -> bool {
            let token = IERC20Dispatcher{contract_address: tokensAddress};
            let userBalance = token.allowance(userAddress, get_contract_address());
            assert(userBalance >= amount, 'ERROR: Insufficient allowance');
            return true;
        }

        fn _takeFunds(self: @ContractState, userAddress: ContractAddress, tokenAddress: ContractAddress, amount: u256) {
            let token = IERC20Dispatcher{contract_address: tokenAddress};
            token.transferFrom(userAddress, get_contract_address(), amount);
            token.approve(self.router.read().contract_address, amount);
        }

        fn _buildTxRequest(self: @ContractState, tokenIn: ContractAddress, tokenOut: ContractAddress, amount: u256 ) -> ExactInputSingleParams {
            let newTx = ExactInputSingleParams {
                token_in: tokenIn,
                token_out: tokenOut,
                fee: 500,
                recipient: get_caller_address(),
                deadline: get_block_timestamp() +  100,
                amount_in: amount - 500,
                amount_out_minimum: 0,
                sqrt_price_limit_X96: 0,
            };
            return newTx;
        }

    }
}