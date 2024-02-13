use starknet::ContractAddress;

#[starknet::interface]
trait ISwapp<TContractState> {
    fn swapSingleToken(ref self: TcontractState, spendToken: ContractAddress, receiveToken: ContractAddress, amount :u256) -> bool;
    fn swapMultipleToken(ref self: TContractState, spendTokens: Array::<ContractAddress>, spendAmount: Array::<u256>, receiveToken: ContractAddress) -> bool;
    fn getSwapHistory(self: @TContractState, userAddress: ContractAddress) -> Array::<u256>;
    fn getSwapDetails(self: @TContractState, swapId: u256) -> Array::<exchangeRecord>;
}


#[starknet::contract]
mod Swapp {
    use starknet::{get_caller_address, get_contract_address, info::get_block_timestamp, ArrayTrait, ContractAddress};
    use diverse::interfaces::IERC20::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        allTransactions: u256,
        userTransactions: LegacyMap::<ContractAddress, Array::<u256>>,
        transactionsData: LegacyMap::<u256, Array::<exchangeRecord>>
    }

    struct exchangeRecord {
        transactionId: u256,
        fromToken: ContractAddress,
        toToken: ContractAddress,
        exchangeAmount: u256,
    }

    #[abi(embed_v0)]
    impl SwappImpl of super::ISwapp<ContractState> {
        fn swapSingleToken(self: @ContractState, spendToken: ContractAddress, receiveToken: ContractAddress, amount :u256) {
            let hasSufficientBall = _confirmBalance(get_caller_address(), spendToken, amount);
            assert(hasSufficient, 'insufficient balance');
            let hasSufficientAllowance = _confirmAllowance(get_caller_address(), spendToken, amount);
            assert(hasSufficientAllowance, 'insufficient Allowance');
            let totalTransaction: u256 = self.allTransactions.read() + 1;
            self.allTransactions.write(totalTransaction);

            let newRecord = exchangeRecord {
                transactionId: totalTransaction,
                fromToken: spendToken,
                toToken: receiveToken,
                exchangeAmount: amount,
            };

            let mut userTransactions = self.userTransactions.read(get_caller_address());
            userTransactions.append(totalTransaction);
            self.userTransactions.write(get_caller_address(), userTransactions);
            self.transactionsData.write(totalTransaction, newRecord);
            return true;
        }

        fn swapMultipleToken(self: @TContractState, spendTokens: Array::<ContractAddress>, spendAmount: Array::<u256>, receiveToken: ContractAddress) -> bool {
            assert( spendTokens.length == spendAmount.length(), 'ERROR: Tokens and amount length mismatch');
            let totalTransaction: u256 = self.allTransactions.read() + 1;
            self.allTransactions.write(totalTransaction);
            let batchTransactions: Array<exchangeRecord> = ArrayTrait::new();
            let mut i: u256 = 0;

            loop {
                if i >= spendTokens.length(){
                    break;
                }
                let hasSufficientBall = _confirmBalance(get_caller_address(), spendToken[i], amount[i]);
                assert(hasSufficient, 'insufficient balance');
                let hasSufficientAllowance = _confirmAllowance(get_caller_address(), spendToken[i], amount[i]);
                assert(hasSufficientAllowance, 'insufficient Allowance');

                let newRecord = exchangeRecord {
                    transactionId: totalTransaction,
                    fromToken: spendToken[i],
                    toToken: receiveToken,
                    exchangeAmount: amount[i],
                };

                batchTransactions.append(newRecord);
                i = i + 1;
            }

            let totalTransaction: u256 = self.allTransactions.read() + 1;
            self.allTransactions.write(totalTransaction);

            let mut userTransactions = self.userTransactions.read(get_caller_address());
            userTransactions.append(totalTransaction);
            self.userTransactions.write(get_caller_address(), userTransactions);
            self.transactionsData.write(totalTransaction, batchTransactions);
            return true;
        }

        fn getSwapHistory(self: @TContractState, userAddress: ContractAddress) -> Array::<u256> {
            let userTransactions = self.userTransactions.read(ContractAddress);
            return userTransactions;
        }

        fn getSwapDetails(self: @TContractState, swapId: u256) -> Array::<exchangeRecord> {
            let swapDetails = self.transactionsData.read(swapId);
            return swapDetails;
        }        

    }

    #[generate_trait]
    impl Private of PrivateTrait {
        fn _confirmBalance( self: @TContractState, userAddress: ContractAddress, tokensAddress: ContractAddress, amount: u256) -> bool {
            let token = IERC20Dispatcher{contract_address: tokensAddress};
            let userBalance = token.balanceOf(userAddress);
            assert(userBalance >= amount, 'ERROR: Insufficient balance');
            return true;
        }

        fn _confirmAllowance( self: @TContractState, userAddress: ContractAddress, tokensAddress: ContractAddress, amount: u256) -> bool {
            let token = IERC20Dispatcher{contract_address: tokensAddress};
            let userBalance = token.allowance(userAddress, get_contract_address());
            assert(userBalance >= amount, 'ERROR: Insufficient allowance');
            return true;
        }

    }
}
