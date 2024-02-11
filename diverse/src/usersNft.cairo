use starknet::ContractAddress;

#[starknet::interface]
trait IERC721<TContractState> {
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn ownerOf(self: @TContractState, token_id: u256) -> ContractAddress;
    fn owner_of(self: @TContractState, token_id: u256) -> ContractAddress;
    fn transfer_from(
        ref self: TContractState, from: ContractAddress, to: ContractAddress, token_id: u256
    );
    fn approve(ref self: TContractState, to: ContractAddress, token_id: u256);
    fn set_approval_for_all(ref self: TContractState, operator: ContractAddress, approved: bool);
    fn get_approved(self: @TContractState, token_id: u256) -> ContractAddress;
    fn is_approved_for_all(
        self: @TContractState, owner: ContractAddress, operator: ContractAddress
    ) -> bool;
    // IERC721Metadata
    fn name(self: @TContractState) -> felt252;
    fn symbol(self: @TContractState) -> felt252;
    fn token_uri(self: @TContractState, token_id: u256) -> felt252;
    // Internal
    fn mint(ref self: TContractState, to: ContractAddress, token_id: u256, tokenUri: felt252);
}

#[starknet::contract]
mod ERC721 {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use zeroable::Zeroable;
    use starknet::contract_address_to_felt252;
    use traits::Into;
    use traits::TryInto;
    use option::OptionTrait;

    #[storage]
    struct Storage {
        name: felt252,
        symbol: felt252,
        owners: LegacyMap::<u256, ContractAddress>,
        balances: LegacyMap::<ContractAddress, u256>,
        token_approvals: LegacyMap::<u256, ContractAddress>,
        operator_approvals: LegacyMap::<(ContractAddress, ContractAddress), bool>,
        token_uri: LegacyMap<u256, felt252>,
        moderator: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Approval: Approval,
        Transfer: Transfer,
        ApprovalForAll: ApprovalForAll
    }

    #[derive(Drop, starknet::Event)]
    struct Approval {
        owner: ContractAddress,
        to: ContractAddress,
        token_id: u256
    }

    #[derive(Drop, starknet::Event)]
    struct Transfer {
        from: ContractAddress,
        to: ContractAddress,
        token_id: u256
    }

    #[derive(Drop, starknet::Event)]
    struct ApprovalForAll {
        owner: ContractAddress,
        operator: ContractAddress,
        approved: bool
    }

    #[constructor]
    fn constructor(ref self: ContractState, _name: felt252, _symbol: felt252, _moderator: ContractAddress) {
        self.name.write(_name);
        self.symbol.write(_symbol);
        self.moderator.write(_moderator);
    }

    #[external(v0)]
    impl ERC721Impl of super::IERC721<ContractState> {
        fn name(self: @ContractState) -> felt252 {
            self.name.read()
        }

        fn symbol(self: @ContractState) -> felt252 {
            self.symbol.read()
        }

        fn ownerOf(self: @ContractState, token_id: u256) -> ContractAddress {
            let owner = self.owners.read(token_id);
            assert(owner.is_non_zero(), 'ERC721: invalid token ID');
            owner
        }

        fn owner_of(self: @ContractState, token_id: u256) -> ContractAddress {
            let owner = self.owners.read(token_id);
            assert(owner.is_non_zero(), 'ERC721: invalid token ID');
            owner
        }

        fn token_uri(self: @ContractState, token_id: u256) -> felt252 {
            self.token_uri.read(token_id)
        }

        fn balance_of(self: @ContractState, account: ContractAddress) -> u256 {
            assert(account.is_non_zero(), 'ERC721: address zero');
            self.balances.read(account)
        }

        fn get_approved(self: @ContractState, token_id: u256) -> ContractAddress {
            assert(self._exists(token_id), 'ERC721: invalid token ID');
            self.token_approvals.read(token_id)
        }

        fn is_approved_for_all(
            self: @ContractState, owner: ContractAddress, operator: ContractAddress
        ) -> bool {
            self.operator_approvals.read((owner, operator))
        }

        fn approve(ref self: ContractState, to: ContractAddress, token_id: u256) {
            let owner = self.ownerOf(token_id);
            assert(to != owner, 'Approval to current owner');
            assert(
                get_caller_address() == owner
                    || self.is_approved_for_all(owner, get_caller_address()),
                'Not token owner'
            );
            self.token_approvals.write(token_id, to);
            self.emit(Approval { owner: self.ownerOf(token_id), to: to, token_id: token_id });
        }

        fn set_approval_for_all(
            ref self: ContractState, operator: ContractAddress, approved: bool
        ) {
            let owner = get_caller_address();
            assert(owner != operator, 'ERC721: approve to caller');
            self.operator_approvals.write((owner, operator), approved);
            self.emit(ApprovalForAll { owner: owner, operator: operator, approved: approved });
        }

        fn transfer_from(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256
        ) {
            assert(
                self._is_approved_or_owner(get_caller_address(), token_id),
                'neither owner nor approved'
            );
            self._transfer(from, to, token_id);
        }

        fn mint(ref self: ContractState, to: ContractAddress, token_id: u256, tokenUri: felt252) {
            assert(to.is_non_zero(), 'to is zero address');
            assert(get_caller_address() === self.moderator.read(), 'ERROR: not a valid caller');

            let receiver_balance = self.balances.read(to);
            self.balances.write(to, receiver_balance + 1.into());
            self.owners.write(token_id, to);
            self._set_token_uri(token_id, token_uri);
            self.emit(Transfer { from: Zeroable::zero(), to: to, token_id: token_id });
        }
    }

    #[generate_trait]
    impl ERC721HelperImpl of ERC721HelperTrait {
        fn _exists(self: @ContractState, token_id: u256) -> bool {
            self.ownerOf(token_id).is_non_zero()
        }

        fn _is_approved_or_owner(
            self: @ContractState, spender: ContractAddress, token_id: u256
        ) -> bool {
            let owner = self.owners.read(token_id);
            spender == owner
                || self.is_approved_for_all(owner, spender)
                || self.get_approved(token_id) == spender
        }

        fn _set_token_uri(ref self: ContractState, token_id: u256, token_uri: felt252) {
            assert(self._exists(token_id), 'ERC721: invalid token ID');
            self.token_uri.write(token_id, token_uri)
        }

        fn _transfer(
            ref self: ContractState, from: ContractAddress, to: ContractAddress, token_id: u256
        ) {
            assert(from == self.ownerOf(token_id), 'ERC721: Caller is not owner');
            assert(to.is_non_zero(), 'ERC721: transfer to 0 address');

            self.token_approvals.write(token_id, Zeroable::zero());
            self.balances.write(from, self.balances.read(from) - 1.into());
            self.balances.write(to, self.balances.read(to) + 1.into());
            self.owners.write(token_id, to);

            self.emit(Transfer { from: from, to: to, token_id: token_id });
        }
    }
}
