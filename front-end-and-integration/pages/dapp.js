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
const parsedamount = parseFloat(amount)
const equivUSD = isNaN(parsedamount) ? 0 : (parsedamount).toFixed(2);
const equivDVS1 = isNaN(parsedamount) ? 0 : (parsedamount) * 1000;
const equivDVS2 = isNaN(parsedamount) ? 0 : ((parsedamount) * 1000).toFixed(2);
const providerfee1 = (equivUSD * 0.00684).toFixed(6)
const providerfee2 = (equivUSD * 0.00685).toFixed(2)

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
<div className='p-[0.5cm] pb-[1.5cm] bg-[#eee] rounded-xl'>
<div className='text-[#333] font-[500]'><span>You Pay</span><span className='float-right text-right text-[#003]'>Amount</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
  <select className='text-[#222] outline-none' style={{textDecorationColor:"none"}}>
    <option>USDT</option>
    <option>DAI</option>
    <option>USDC</option>
  </select>
    <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" id="amount" name="amount" onChange={(e) => setamount(e.target.value)} placeholder='0' />
</div>
<div className='float-right clear-both text-[#555]'>≈${Intl.NumberFormat().format(equivUSD)}</div>
</div>

<div className='text-center text-[120%] my-[0.1cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#502] text-[#eee] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => changeSwapOption()}></i></div>

<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#333] font-[500]'><span>You Get</span></div>
<div className='mt-[0.5cm]' style={{display:"block"}}>
    <img src="images/tokens.png" width="40" style={{display:"inline-block"}} />
    <div className='ml-[0.5cm]' style={{display:"inline-block"}}><span className='text-[#222]'>DVS</span></div>
    <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000]" value={Intl.NumberFormat().format(equivDVS1)} type="text" placeholder='0' />
</div>
<div className='float-right text-[#555]'>≈${Intl.NumberFormat().format(equivDVS2)}</div>
</div>

<div className='my-[0.5cm] text-center text-[#555] text-[110%] font-[500]'>$1 ≈ 1000 DVS &nbsp; <i className='fa fa-exchange text-[#555]'></i></div>

<div><button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] rounded-full generalbutton2 cursor-pointer' style={{display:"inline-block"}}>Swap</button></div>

<div className='my-[1cm] text-center text-[#aaa] text-[110%] font-[500]'>Approve token before you can swap it &nbsp; <i className='fa fa-info-circle'></i></div>

<div className='p-[0.5cm] bg-[#eee] rounded-md mb-[4cm]'>
  <div className='mb-[0.5cm]'><span className='text-[#555]'>Minimum Received</span><span className='text-[#000] float-right'>{equivDVS2} DVS (≈${equivUSD})</span></div>
  <div className='mb-[0.5cm]'><span className='text-[#555]'>Provider Fee &nbsp; <i className='fa fa-info-circle'></i></span><span className='text-[#000] float-right'>${providerfee1} (≈${providerfee2})</span></div>
</div>
</div>)
  : 
(<div className='bg-[#111] p-[1cm] rounded-xl dAppdivs'>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#333] font-[500]'><span>You Pay</span><span className='float-right text-right text-[#003]'>Amount</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
    <div style={{display:"inline-block"}}><img src="images/ether.png" width="40" /></div>
    <div className='ml-[0.5cm]' style={{display:"inline-block"}}><span className='text-[#222]'>ETH</span><br /><span className='text-[80%] text-[#502]'>StarkNet</span></div>
    <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" id="amount" name="amount" onChange={(e) => setamount(e.target.value)} placeholder='0' />
</div>
</div>

<div className='text-center text-[120%] my-[0.1cm]'><i className='fa fa-exchange switchbutton rounded-full bg-[#eee] text-[#502] p-[0.3cm] cursor-pointer font-[600]' onClick={(e) => changeSwapOptionBack()}></i></div>

<div><button className='text-center py-[0.3cm] bg-[#502] font-[500] text-[#fff] w-[100%] rounded-full generalbutton2 cursor-pointer' style={{display:"inline-block"}}>Swap</button></div>

</div>)
}

</div>
   </div>

    </div>
   </div>
  </>
  );
};

