import Head from 'next/head';
import { useState, useEffect } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '@/components/header';
import { useRouter } from 'next/router';
import { connect, disconnect } from "get-starknet";
import { Contract, RpcProvider } from 'starknet';

export default function DApp(){
  useEffect(() => {
    AOS.init();
  }, [])

  
const [amount, setamount] = useState()
const [spendToken, setspendToken] = useState("0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9")
const [receiveToken, setreceiveToken] = useState("0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7")
const parsedamount = parseFloat(amount)

  const [swapOption, setSwapOption] = useState(true)
  const changeSwapOption = () => {
    setSwapOption(false);
  }
  const changeSwapOptionBack = () => {
    setSwapOption(true);
  }


  // wallet connection instructions
  const [connectWallet, setConnectWallet] = useState(true)
  const [connectedWallet, setConnectedWallet] = useState(false)
  const [theWalletAddress, setTheWalletaddress] = useState()
  //to connect our wallet
  //we will use cookies to ensure consistency of the connecting button on all pages of the application
  const cookie = require('cookie');
  const connecttheWallet = async (e) => {
    try {
      e.preventDefault();
      const starknet = await connect();
      const walletAddress = starknet.account.address
      console.log(walletAddress)
      setTheWalletaddress(walletAddress)
      
       // Update state
       setConnectedWallet(true);
       setConnectWallet(false);  

     // Set the wallet address as a cookie on the browser
     document.cookie = `walletaddresscookie=${encodeURIComponent(walletAddress)}; secure; max-age=${60 * 60 * 24}; sameSite=strict; path=/`;
    } catch (error) {
      console.log('Error connecting to StarkNet:', error.message);
    }
  };

  // this ensures continous mounting of the connecting button on all pages and it runs once using the useEffect hook
 const confirmCookies = () => {
  // to check if the wallet address cookie is present
  const walletCookie = document.cookie
    .split(';')
    .find((cookie) => cookie.trim().startsWith('walletaddresscookie='));

  if (walletCookie) {
    // Extracting the wallet address from the cookie
    const walletAddress = decodeURIComponent(walletCookie.split('=')[1]);

    // Update state
    setConnectedWallet(true);
    setConnectWallet(false);
    setTheWalletaddress(walletAddress);
  }
};

useEffect(() => {
  confirmCookies();
}, []); 


  //to disconnect our wallet
  const disconnectWallet = async(e) => {
    e.preventDefault();
    const starknet = await disconnect();
    setConnectedWallet(false)
    setConnectWallet(true)
      // Delete the wallet address cookie
    document.cookie = 'walletaddresscookie=; max-age=0; path=/';
  } 
  
  //to write to swap contract to swap single token to another token and to read the smart contract (This contract implements JediSwap)
  const SwapContractAddress = "0x06db8567aafdfe4c70f747d8cda2911401f433da54930ebcdc66248e7dba34a0"
  const SwapABI = [
    {
      type: "impl",
      name: "SwappImpl",
      interface_name: "diverse::swapp::ISwapp",
    },
    {
      type: "struct",
      name: "core::integer::u256",
      members: [
        {
          name: "low",
          type: "core::integer::u128",
        },
        {
          name: "high",
          type: "core::integer::u128",
        },
      ],
    },
    {
      type: "enum",
      name: "core::bool",
      variants: [
        {
          name: "False",
          type: "()",
        },
        {
          name: "True",
          type: "()",
        },
      ],
    },
    {
      type: "struct",
      name: "diverse::swapp::exchangeRecord",
      members: [
        {
          name: "transactionId",
          type: "core::integer::u256",
        },
        {
          name: "fromToken",
          type: "core::starknet::contract_address::ContractAddress",
        },
        {
          name: "toToken",
          type: "core::starknet::contract_address::ContractAddress",
        },
        {
          name: "exchangeAmount",
          type: "core::integer::u256",
        },
        {
          name: "amountReceived",
          type: "core::integer::u256",
        },
      ],
    },
    {
      type: "interface",
      name: "diverse::swapp::ISwapp",
      items: [
        {
          type: "function",
          name: "swapMultipleToken",
          inputs: [
            {
              name: "spendTokens",
              type: "core::array::Array::<core::starknet::contract_address::ContractAddress>",
            },
            {
              name: "spendAmount",
              type: "core::array::Array::<core::integer::u256>",
            },
            {
              name: "receiveToken",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "swapSingleToken",
          inputs: [
            {
              name: "spendToken",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "receiveToken",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "amount",
              type: "core::integer::u256",
            },
          ],
          outputs: [
            {
              type: "core::bool",
            },
          ],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "getSwapHistory",
          inputs: [
            {
              name: "userAddress",
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          outputs: [
            {
              type: "core::array::Array::<core::integer::u256>",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "getSwapDetails",
          inputs: [
            {
              name: "swapId",
              type: "core::integer::u256",
            },
          ],
          outputs: [
            {
              type: "core::array::Array::<diverse::swapp::exchangeRecord>",
            },
          ],
          state_mutability: "view",
        },
        {
          type: "function",
          name: "updateRouter",
          inputs: [
            {
              name: "router",
              type: "core::starknet::contract_address::ContractAddress",
            },
            {
              name: "sqrt_price_limit",
              type: "core::integer::u256",
            },
          ],
          outputs: [],
          state_mutability: "external",
        },
        {
          type: "function",
          name: "viewRouter",
          inputs: [],
          outputs: [
            {
              type: "core::starknet::contract_address::ContractAddress",
            },
          ],
          state_mutability: "view",
        },
      ],
    },
    {
      type: "constructor",
      name: "constructor",
      inputs: [
        {
          name: "routerContract",
          type: "core::starknet::contract_address::ContractAddress",
        },
      ],
    },
    {
      type: "event",
      name: "diverse::swapp::Swapp::Event",
      kind: "enum",
      variants: [],
    },
  ];
  
  
  const DAIcontractAddress = "0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9"
  const DAIabi = [
    {
      members: [
        {
          name: "low",
          offset: 0,
          type: "felt",
        },
        {
          name: "high",
          offset: 1,
          type: "felt",
        },
      ],
      name: "Uint256",
      size: 2,
      type: "struct",
    },
    {
      data: [
        {
          name: "user",
          type: "felt",
        },
      ],
      keys: [],
      name: "Rely",
      type: "event",
    },
    {
      data: [
        {
          name: "user",
          type: "felt",
        },
      ],
      keys: [],
      name: "Deny",
      type: "event",
    },
    {
      data: [
        {
          name: "sender",
          type: "felt",
        },
        {
          name: "recipient",
          type: "felt",
        },
        {
          name: "value",
          type: "Uint256",
        },
      ],
      keys: [],
      name: "Transfer",
      type: "event",
    },
    {
      data: [
        {
          name: "owner",
          type: "felt",
        },
        {
          name: "spender",
          type: "felt",
        },
        {
          name: "value",
          type: "Uint256",
        },
      ],
      keys: [],
      name: "Approval",
      type: "event",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "res",
          type: "Uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "user",
          type: "felt",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "res",
          type: "Uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "owner",
          type: "felt",
        },
        {
          name: "spender",
          type: "felt",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "res",
          type: "Uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "user",
          type: "felt",
        },
      ],
      name: "wards",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "ward",
          type: "felt",
        },
      ],
      name: "constructor",
      outputs: [],
      type: "constructor",
    },
    {
      inputs: [
        {
          name: "account",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "mint",
      outputs: [],
      type: "function",
    },
    {
      inputs: [
        {
          name: "account",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "burn",
      outputs: [],
      type: "function",
    },
    {
      inputs: [
        {
          name: "user",
          type: "felt",
        },
      ],
      name: "rely",
      outputs: [],
      type: "function",
    },
    {
      inputs: [
        {
          name: "user",
          type: "felt",
        },
      ],
      name: "deny",
      outputs: [],
      type: "function",
    },
    {
      inputs: [
        {
          name: "recipient",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "sender",
          type: "felt",
        },
        {
          name: "recipient",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "spender",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "spender",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "spender",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          name: "res",
          type: "felt",
        },
      ],
      type: "function",
    },
  ];

  const USDCcontractAddress = "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"
  const USDCabi = [
    {
      members: [
        {
          name: "low",
          offset: 0,
          type: "felt",
        },
        {
          name: "high",
          offset: 1,
          type: "felt",
        },
      ],
      name: "Uint256",
      size: 2,
      type: "struct",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "name",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "symbol",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "totalSupply",
          type: "Uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "decimals",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "account",
          type: "felt",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "Uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "owner",
          type: "felt",
        },
        {
          name: "spender",
          type: "felt",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "remaining",
          type: "Uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "permittedMinter",
      outputs: [
        {
          name: "minter",
          type: "felt",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "name",
          type: "felt",
        },
        {
          name: "symbol",
          type: "felt",
        },
        {
          name: "decimals",
          type: "felt",
        },
        {
          name: "minter_address",
          type: "felt",
        },
      ],
      name: "constructor",
      outputs: [],
      type: "constructor",
    },
    {
      inputs: [
        {
          name: "recipient",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "success",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "sender",
          type: "felt",
        },
        {
          name: "recipient",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "success",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "spender",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "success",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "spender",
          type: "felt",
        },
        {
          name: "added_value",
          type: "Uint256",
        },
      ],
      name: "increaseAllowance",
      outputs: [
        {
          name: "success",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "spender",
          type: "felt",
        },
        {
          name: "subtracted_value",
          type: "Uint256",
        },
      ],
      name: "decreaseAllowance",
      outputs: [
        {
          name: "success",
          type: "felt",
        },
      ],
      type: "function",
    },
    {
      inputs: [
        {
          name: "recipient",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "permissionedMint",
      outputs: [],
      type: "function",
    },
    {
      inputs: [
        {
          name: "account",
          type: "felt",
        },
        {
          name: "amount",
          type: "Uint256",
        },
      ],
      name: "permissionedBurn",
      outputs: [],
      type: "function",
    },
  ];
  
  
  const provider = new RpcProvider({nodeUrl:"https://starknet-goerli.g.alchemy.com/v2/pGPx7iRpQNfUa7C8tJAVoslLtXkkIUi-"}); 
  const ReadSwapContractSettings = new Contract(SwapABI, SwapContractAddress, provider)
             //to write to Swap contract to swap single token
             const [swapSuccessAlert, setswapSuccessAlert] = useState(false)
             const writeToSwapSingleToken = async() => {
                 try {
                     const starknet = await connect();
                      setConnectedWallet(true);
                      setConnectWallet(false);
                     const signer = starknet.account
                     const writeToSwapContractSettings = new Contract(SwapABI, SwapContractAddress, signer)
                     console.log(spendToken)
                     console.log(receiveToken)
                     console.log(amount)
                     const amountAsBigInt = BigInt(amount * 10**18);
                     console.log(amountAsBigInt)
                      const swapSingleToken = await writeToSwapContractSettings.swapSingleToken(spendToken, receiveToken, {low: amountAsBigInt, high: 0});
                      setswapSuccessAlert(true);
                 } catch (error) {
                   console.log(error)  
                 }
             }

           //for multiple tokens
             const [selectedTokens, setSelectedTokens] = useState([]);
             const [amounts, setAmounts] = useState([]);
             const handleTokenChange = (e, index) => {
              const newSelectedTokens = [...selectedTokens];
              const newAmounts = [...amounts];
            
              newSelectedTokens[index] = e.target.value;
              newAmounts[index] = e.target.value; // This line should be adjusted
            
              setSelectedTokens(newSelectedTokens);
              setAmounts(newAmounts);
            };

            const writeToSwapMultipleTokens = async () => {
              try {
                const starknet = await connect();
                setConnectedWallet(true);
                setConnectWallet(false);
            
                const signer = starknet.account;
                const writeToSwapContractSettings = new Contract(SwapABI, SwapContractAddress, signer);
            
                console.log(selectedTokens);
                console.log(receiveToken);
            
                // Convert each amount to BigInt if needed
                const amountsAsBigInt = amounts.map(amount => BigInt(amount) * BigInt(10 ** 18));
                console.log(amountsAsBigInt);
            
                const swapMultipleToken = await writeToSwapContractSettings.swapMultipleToken(
                  selectedTokens,
                  { low: amountsAsBigInt, high: BigInt(0) },
                  receiveToken
                );
            
                setswapSuccessAlert(true);
              } catch (error) {
                console.error(error);
              }
            };
            
            

             const closeswapSuccessAlert = () => {
              setswapSuccessAlert(false)
                 } 
                 
                 const writeToApproveSingleToken = async() => {
                  try {
                    const starknet = await connect();
                      setConnectedWallet(true);
                      setConnectWallet(false);
                      const signer = starknet.account
                      const writeToApproveDAIContractSettings = new Contract(DAIabi, DAIcontractAddress, signer)
                      const writeToApproveUSDCContractSettings = new Contract(USDCabi, USDCcontractAddress, signer)
                       if (spendToken === "0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9" || receiveToken === "0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9"){
                      const approveDAIToken = await writeToApproveDAIContractSettings.approve(SwapContractAddress, {low: 10000, high: 100000})}
                      if (spendToken === "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426" || receiveToken === "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"){
                        const approveUSDCToken = await writeToApproveUSDCContractSettings.approve(SwapContractAddress, {low: 10000, high: 100000})}
                  } catch (error) {
                    console.log(error)  
                  }
                }

                const writeToApproveMultipleTokens = async() => {
                  try {
                    const starknet = await connect();
                      setConnectedWallet(true);
                      setConnectWallet(false);
                      const signer = starknet.account
                      const writeToApproveDAIContractSettings = new Contract(DAIabi, DAIcontractAddress, signer)
                      const writeToApproveUSDCContractSettings = new Contract(USDCabi, USDCcontractAddress, signer)
                       if (selectedTokens === "0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9" || receiveToken === "0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9"){
                      const approveDAIToken = await writeToApproveDAIContractSettings.approve(SwapContractAddress, {low: 10000, high: 100000})}
                      if (selectedTokens === "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426" || receiveToken === "0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426"){
                        const approveUSDCToken = await writeToApproveUSDCContractSettings.approve(SwapContractAddress, {low: 10000, high: 100000})}
                  } catch (error) {
                    console.log(error)  
                  }
                }

  return (
    <>
    <Head>
   <title>The Diverse dApp</title>
   <link rel="shortcut icon" href="/favicon.ico" />
   </Head>
   <div className='bg-[#002]'>
   <Header />
   <div>
   <img src="images/starknet.png" width="100" className='lg:mt-[10%] mt-[20%] ml-[5%] blurimage1' style={{position:"absolute"}} />
   <img src="images/starknet.png" width="100" className='lg:mt-[15%] mt-[25%] lg:ml-[85%] ml-[70%] blurimage2' style={{position:"absolute"}} />
   <img src="images/logo.png" width="100" className='lg:mt-[35%] mt-[100%] ml-[8%] blurimage2' style={{position:"absolute"}} />
   <img src="images/logo.png" width="100" className='lg:mt-[45%] mt-[105%] lg:ml-[80%] ml-[75%] blurimage1' style={{position:"absolute"}} />
   <div className='pt-[3cm] w-[100%]' style={{position:"absolute"}}>

<div className='lg:px-[30%] md:px-[25%] p-[5%]'>
{swapOption ? 
(<div className='bg-[#111] p-[1cm] rounded-xl dAppdivs'>
<div className='mb-[1cm] text-center font-[500]'>Swap single token using the JediSwap implementation</div>
<form>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#333] font-[500]'><span>You Pay</span><span className='float-right text-right text-[#003]'>Amount</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
<select className='text-[#222] outline-none' onChange={(e) => setspendToken(e.target.value)}>
<option value="0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9">DAI</option>
  <option value="0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7">ETH</option>
  <option value="0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426">USDC</option>
</select>
  <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" id="amount" name="amount" onChange={(e) => setamount(e.target.value)} placeholder='0' />
</div>
</div>

<div className='text-center text-[120%] my-[0.1cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#eee] text-[#502] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => changeSwapOption()}></i></div>

<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#333] font-[500]'><span>You Get</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
<select className='text-[#222] outline-none' onChange={(e) => setreceiveToken(e.target.value)}>
  <option value="0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7">ETH</option>
  <option value="0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9">DAI</option>
  <option value="0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426">USDC</option>
</select>
</div>
</div>
<div className='my-[1cm] text-center text-[#aaa] text-[110%] font-[500]'>Approve token before you can swap it &nbsp; <i className='fa fa-info-circle'></i></div>

{connectedWallet ?
(<div className='mt-[1cm]'>
<button className='text-center py-[0.3cm] bg-[#003] font-[500] text-[#fff] w-[100%] rounded-full generalbutton2 cursor-pointer' style={{display:"inline-block"}} onClick={(e) => {e.preventDefault();writeToApproveSingleToken()}}>Approve</button>
<button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full generalbutton2 cursor-pointer' style={{display:"inline-block"}} onClick={(e) => {e.preventDefault();writeToSwapSingleToken(spendToken, receiveToken, amount)}}>Swap</button>
</div>) : 
(<div className="text-center mt-[1cm]">
{connectWallet ? (<div className="bg-[#000] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer" style={{border:"2px solid #fff"}} onClick={(e) => connecttheWallet(e)}><img src="images/wallet.png" width="23" style={{display:"inline-block"}} /> &nbsp; Connect wallet</div>) : (<div></div>)}
{connectedWallet ? (<div className="bg-[#502] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer disconnectwalletbutton" style={{border:"2px solid #502"}} onClick={(e) => disconnectWallet(e)}><img src="images/wallet.png" width="23" style={{display:"inline-block"}} /> &nbsp; Connected &nbsp; {theWalletAddress.substring(0, 5)}...{theWalletAddress.substring(60, 65)}</div>) : (<div></div>)}
</div>)}
</form>
</div>)
  :
(<div className='bg-[#001] p-[1cm] rounded-xl dAppdivs'>
<div className='mb-[1cm] text-center font-[500]'>Select and swap multiple tokens using the JediSwap implementation</div>
<form>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#333] font-[500]'><span>You Pay</span><span className='float-right text-right text-[#003]'>Amount</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
<select
        className='text-[#222] outline-none'
        onChange={(e) => setSelectedTokens(Array.from(e.target.selectedOptions, option => option.value))}
        multiple
      >
        <option value="0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9">DAI</option>
        <option value="0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7">ETH</option>
        <option value="0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426">USDC</option>
      </select>

      {selectedTokens.map((token, index) => (
        <input
          key={index}
          style={{ display: "inline-block" }}
          className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]"
          type="text"
          id={`amount${index}`}
          name={`amount${index}`}
          onChange={(e) => handleTokenChange(e, index)}
          placeholder={`Amount for ${token}`}
        />
      ))}
</div>
</div>

<div className='text-center text-[120%] my-[0.1cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#502] text-[#eee] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => changeSwapOptionBack()}></i></div>

<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#333] font-[500]'><span>You Get</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
<select className='text-[#222] outline-none' onChange={(e) => setreceiveToken(e.target.value)}>
  <option value="0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7">ETH</option>
  <option value="0x03E85bFbb8E2A42B7BeaD9E88e9A1B19dbCcf661471061807292120462396ec9">DAI</option>
  <option value="0x5a643907b9a4bc6a55e9069c4fd5fd1f5c79a22470690f75556c4736e34426">USDC</option>
</select>
</div>
</div>
<div className='my-[1cm] text-center text-[#aaa] text-[110%] font-[500]'>Approve token before you can swap it &nbsp; <i className='fa fa-info-circle'></i></div>

{connectedWallet ?
(<div className='mt-[1cm]'>
<button className='text-center py-[0.3cm] bg-[#003] font-[500] text-[#fff] w-[100%] rounded-full generalbutton2 cursor-pointer' style={{display:"inline-block"}} onClick={(e) => {e.preventDefault();writeToApproveMultipleTokens()}}>Approve</button>
<button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] mt-[0.5cm] rounded-full generalbutton2 cursor-pointer' style={{display:"inline-block"}} onClick={(e) => {e.preventDefault();writeToSwapMultipleTokens(selectedTokens, receiveToken, [amounts])}}>Swap</button>
</div>) : 
(<div className="text-center mt-[1cm]">
{connectWallet ? (<div className="bg-[#000] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer" style={{border:"2px solid #fff"}} onClick={(e) => connecttheWallet(e)}><img src="images/wallet.png" width="23" style={{display:"inline-block"}} /> &nbsp; Connect wallet</div>) : (<div></div>)}
{connectedWallet ? (<div className="bg-[#502] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer disconnectwalletbutton" style={{border:"2px solid #502"}} onClick={(e) => disconnectWallet(e)}><img src="images/wallet.png" width="23" style={{display:"inline-block"}} /> &nbsp; Connected &nbsp; {theWalletAddress.substring(0, 5)}...{theWalletAddress.substring(60, 65)}</div>) : (<div></div>)}
</div>)}
</form>
</div>)
}

</div>
   </div>
    </div>
       {swapSuccessAlert ? 
        (<div>
        <div data-aos="slide-up" className="fixed ml-[5%] top-[0.5cm] right-[5%] bg-[rgba(0,0,0,0.9)] text-white px-4 py-2 rounded-xl" style={{transition:"0.5s ease-in-out", zIndex:"9999", border:"2px solid #fff"}}>
        <span className='text-[#eee]'>Success!!!</span>
        <button className='ml-[0.5cm]'><i className="fa fa-circle-xmark text-[130%] font-[600] text-[#f00]" onClick={closeswapSuccessAlert}></i></button>
        </div>
        </div>
        ) : 
        (<div></div>)
        }
   </div>
  </>
  );
};

