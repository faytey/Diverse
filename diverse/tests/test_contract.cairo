use starknet::{ContractAddress, ClassHash};

use snforge_std::{declare, ContractClassTrait};
use diverse::IERC721::{IERC721DispatcherTrait, IERC721Dispatcher};
use core::option::OptionTrait;
use core::traits::TryInto;


fn deploy_contract(name: felt252) -> (ContractAddress, ContractAddress, ContractAddress) {
let user1:ContractAddress = 1.try_into().unwrap();
    // let contract = declare(name);
    // contract.deploy(@ArrayTrait::new()).unwrap();

    let erc721_contract = declare('ERC721');
    let name: felt252 = 'Diverse';
    let symbol: felt252 = 'DVE';
    let mut erc721_constructor_calldata = array![name, symbol, 1.try_into().unwrap()];
    let erc721_contract_address = erc721_contract.deploy(@erc721_constructor_calldata).unwrap();

    // mint a new token
    let dispatcher = IERC721Dispatcher { contract_address: erc721_contract_address };
    // let recipient: ContractAddress = ACCOUNT.try_into().unwrap();
    // dispatcher.mint(recipient, u256_from_felt252(1));

    // deploy registry contract
    let registry_contract = declare('Registry');
    let registry_contract_address = registry_contract.deploy(@array![]).unwrap();

    let NftWallet = declare('NftWalletTwo');
    let accountHash: ClassHash = '0x019e6b92d2634e732118ee2ebf13644e6119d249cb13d8a099a5d4a48dc5e660'.try_into().unwrap();
    let mut calldata = array![registry_contract_address, accountHash.try_into().unwrap(), erc721_contract_address];
    
    let NftWalletAddress = NftWallet.deploy(@calldata).unwrap();

    (registry_contract_address, erc721_contract_address, NftWalletAddress)
}

#[test]
fn test_increase_balance() {
    let (contract_address, Nft_Address, NftWalletAddress) = deploy_contract('HelloStarknet');

    // let dispatcher = IHelloStarknetDispatcher { contract_address };

    assert(contract_address != Nft_Address, 'Invalid deployment');
    // println!("declared contract: {}", NftWalletAddress);

    // let balance_before = dispatcher.get_balance();
    // assert(balance_before == 0, 'Invalid balance');

    // dispatcher.increase_balance(42);

    // let balance_after = dispatcher.get_balance();
    // assert(balance_after == 42, 'Invalid balance');
}

// #[test]
// fn test_cannot_increase_balance_with_zero_value() {
//     let contract_address = deploy_contract('HelloStarknet');

//     let safe_dispatcher = IHelloStarknetSafeDispatcher { contract_address };

//     #[feature("safe_dispatcher")]
//     let balance_before = safe_dispatcher.get_balance().unwrap();
//     assert(balance_before == 0, 'Invalid balance');

//     #[feature("safe_dispatcher")]
//     match safe_dispatcher.increase_balance(0) {
//         Result::Ok(_) => panic_with_felt252('Should have panicked'),
//         Result::Err(panic_data) => {
//             assert(*panic_data.at(0) == 'Amount cannot be 0', *panic_data.at(0));
//         }
//     };
// }
