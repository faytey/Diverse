# Diverse: Multi-functional DeFi Project on Starknet

Diverse is a comprehensive DeFi project built on Starknet, offering a one-stop solution for various DeFi utilities. It encompasses a token swap with multi-token support, a lending and staking pool manager, a price feed section, and an NFT account manager.

## Technologies Utilized:

### ERC-6551 (TokenBound)

The ERC-6551 token standard is implemented in Diverse, allowing users to create and utilize NFTs as wallets for holding tokens. With this standard, users can create NFTs that represent their token holdings and transfer them to other users, who can then spend the tokens owned by those NFTs.

### JediSwapp

Diverse incorporates MultiSwapp, utilizing JediSwapp as a liquidity source. MultiSwapp enables users to swap multiple tokens for one base token in a single function call. This functionality streamlines the swapping process and provides users with a more efficient way to manage their token portfolios.

### Pragma Oracle

Diverse utilizes the Pragma oracle to provide real-time price feeds to users. With Pragma, users can access up-to-date price information for various tokens, enhancing their trading and investment decisions. The Pragma oracle ensures the accuracy and reliability of price data, contributing to a seamless user experience.

### Braavos

Braavos integration enriches the user experience within Diverse by facilitating seamless wallet connectivity. Users have the option to connect their Braavos wallets to Diverse, empowering them to effortlessly access and manage their assets. This integration with Braavos ensures a secure and convenient means for users to interact with the platform.

### Argent

Argent wallet integration enhances the user experience within Diverse by providing seamless wallet connectivity. Users can connect their Argent wallets to Diverse, enabling them to access and manage their assets with ease. The integration with Argent wallet offers users a secure and convenient way to interact with the platform.

### Nimbura

Nimbura is leveraged in Diverse to provide staking and lending options to users. Through Nimbura, users can stake their assets to earn rewards or participate in lending pools to earn interest. The integration with Nimbura expands liquidity and DeFi opportunities within the platform, empowering users to maximize their returns on investment.

## Deployed Contracts:

### Swapp Contract (JEDI SWAPP)

The Swapp contract facilitates token swapping functionality within Diverse. Users can swap multiple tokens for one base token using this contract. The Swapp contract enhances the user experience by providing efficient and cost-effective token swapping capabilities.

- Contract Address: [View on StarkScan](https://testnet.starkscan.co/contract/0x06db8567aafdfe4c70f747d8cda2911401f433da54930ebcdc66248e7dba34a0)

### ERC-6551 Wallet Manager

The ERC-6551 Wallet Manager contract manages NFT-based wallets within Diverse. Users can create, transfer, and manage NFT wallets that represent their token holdings. The Wallet Manager contract ensures the security and integrity of NFT-based wallet functionality.

- Contract Address: [View on StarkScan](https://testnet.starkscan.co/contract/0x05ce86092d32dc61e706674f15228f552fbc0c5f07f26f7d2151b183c4f9afaf)

### Nimbora Strategy Addresses:

- Eth Goerli DefaultProxyAdmin: [View on Etherscan](https://goerli.etherscan.io/address/0xA72C18e208AfdE40F239780C1672A60c6518E6A7)
- Eth Goerli Pooling Manager Implementation: [View on Etherscan](https://goerli.etherscan.io/address/0xb91f7e37825996845C5043eAB96EadFFa1ddFe29)
- Eth Goerli Pooling Manager Proxy: [View on Etherscan](https://goerli.etherscan.io/address/0x1468833C722a853F7F27B1e4f58A14B22dbbb7Ac)
- Eth Goerli Pooling Manager: [View on Etherscan](https://goerli.etherscan.io/address/0x1468833C722a853F7F27B1e4f58A14B22dbbb7Ac)
- SavingDaiToken: [View on Etherscan](https://goerli.etherscan.io/address/0x01E98c136d661b2287d5335E23CD2643c98C43c5)
- Weth Contract: [View on Etherscan](https://goerli.etherscan.io/address/0x9fC0C8851c664B565b248315002eC7CE8c4aE31a)
- WethPriceFeed: [View on Etherscan](https://goerli.etherscan.io/address/0xA9e2B716B4C5Ac3D8eA69701c9f2C7a97345db47)
- DefaultProxyAdmin: [View on Etherscan](https://goerli.etherscan.io/address/0xA72C18e208AfdE40F239780C1672A60c6518E6A7)
- SavingDaiStrategy_Implementation: [View on Etherscan](https://goerli.etherscan.io/address/0x2c2Ff62624f3E7aCA3C337a843DeDae4bC485837)
- SavingDai: [View on Etherscan](https://goerli.etherscan.io/address/0x5a79C73d77Ec9c376D2471331a9A08B3A2fc6ad4)
- Starknet PoolingManager: [View on StarkScan](https://testnet.starkscan.co/contract/0x4d4d71f62110bde88904d69a1501472bbf68e79acdf4016c4f3e76b71b85a39)
- Starknet Factory Contract: [View on StarkScan](https://testnet.starkscan.co/contract/0x7783e47d0ad1c04c8d2604be67f72196d5b162d4d549e88ed8f9231d5282930)

### PRAGMA Oracle Implementation:

The PRAGMA Oracle provides real-time price feeds to users within Diverse. With the PRAGMA Oracle, users can access accurate and up-to-date price information for various tokens, enhancing their trading decisions and overall user experience.

- PriceFeed Contract: [View on Voyager](https://goerli.voyager.online/contract/0x01b2bd8f05940bf95f2eae9a02fcd8f283c02ace54e9af68670349c3f16d4d55)

### Contributors

- [Patrick Ominisan](https://github.com/mrpatrick030) - Blockchain Engineer (Telegram @mrpatrick030)
- [Faith M. Roberts](https://github.com/faytey) - Smart Contract Engineer (Telegram @faithia7)
- [Idogwu Chinonso](https://github.com/Nonnyjoe) - Smart Contract Engineer (Telegram @chinonso_I)
