import Head from 'next/head';
import { useState, useEffect } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '@/components/header';
import { useRouter } from 'next/router';

export default function DApp(){
  useEffect(() => {
    AOS.init();
  }, [])

  const [values, setValues] = useState({
    usdtamount:"",
    bnbamount:""
})

const parsedUsdtamount = parseFloat(values.usdtamount)
const equivUSD = isNaN(parsedUsdtamount) ? 0 : (parsedUsdtamount).toFixed(2);
const equivBNBUSD = (isNaN(parsedUsdtamount) ? 0 : (parsedUsdtamount).toFixed(6)) - ((isNaN(parsedUsdtamount) ? 0 : (parsedUsdtamount).toFixed(6)) * 0.005);
const equivBNB = ((equivBNBUSD)/302.2)
const equivUSDreceived = (isNaN(parsedUsdtamount) ? 0 : (parsedUsdtamount).toFixed(2)) - ((isNaN(parsedUsdtamount) ? 0 : (parsedUsdtamount).toFixed(2)) * 0.008);
const equivBNBreceived = (parseFloat(equivUSDreceived)/302.2).toFixed(6)

const parsedbnbamount = parseFloat(values.bnbamount)
const equivBNBtoUSD = (isNaN(parsedbnbamount) ? 0 : (((parsedbnbamount).toFixed(2)) * 302.2));
const equivUSDBNB = (equivBNBtoUSD - (equivBNBtoUSD * 0.005))
const equivUSDBNB2 = (equivBNBtoUSD - (equivBNBtoUSD * 0.005)).toFixed(2)
const equivUSDreceived3 = (equivBNBtoUSD - (equivBNBtoUSD * 0.007)).toFixed(6)
const equivUSDreceived4 = (equivBNBtoUSD - (equivBNBtoUSD * 0.00698)).toFixed(2)
const providerfee1 = (equivBNBtoUSD * 0.00684).toFixed(6)
const providerfee2 = (equivBNBtoUSD * 0.00685).toFixed(2)

const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const ApproveError = async () => {
   document.getElementById("approveerrordiv").innerHTML = "Insufficient BNB for transaction fees!"
  }

  const PreviewError = async () => {
    document.getElementById("previewerrordiv").innerHTML = "You do not have enough BNB to swap!"
   }

  const [swapOption, setSwapOption] = useState(true)
  const changeSwapOption = () => {
    setSwapOption(false);
  }
  const changeSwapOptionBack = () => {
    setSwapOption(true);
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
   <img src="images/bg7.jpg" className='w-[100%] lg:h-[35cm] h-[30cm]' style={{position:"absolute", filter:"blur(3px)"}} />
   <img src="images/starknet.png" width="100" className='lg:mt-[10%] mt-[20%] ml-[5%] blurimage1' style={{position:"absolute"}} />
   <img src="images/starknet.png" width="100" className='lg:mt-[15%] mt-[25%] lg:ml-[85%] ml-[70%] blurimage2' style={{position:"absolute"}} />
   <img src="images/logo.png" width="100" className='lg:mt-[35%] mt-[100%] ml-[8%] blurimage2' style={{position:"absolute"}} />
   <img src="images/logo.png" width="100" className='lg:mt-[45%] mt-[105%] lg:ml-[80%] ml-[75%] blurimage1' style={{position:"absolute"}} />
   <div className='pt-[3cm] w-[100%]' style={{position:"absolute"}}>

<div className='lg:px-[30%] md:px-[25%] p-[5%]'>
{swapOption ? 
(<div className='bg-[#000] p-[1cm] rounded-xl dAppdivs'>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#555] font-[500]'><span>You Pay</span><span className='float-right text-[#02f]'>Max</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
    <div style={{display:"inline-block"}}><img src="images/tether.png" width="40" /></div>
    <div className='ml-[0.5cm]' style={{display:"inline-block"}}><span>USDT</span><br /><span className='text-[80%] text-[#555]'>BNB Smart Chain</span></div>
    <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000] placeholder-[#000]" type="text" id="usdtamount" name="usdtamount" value={values.usdtamount} onChange={handleChange} placeholder='0' />
</div>
<div className='float-right text-[#555]'>≈${equivUSD}</div>
</div>

<div className='text-center text-[120%] my-[0.1cm]'><i className='fa fa-exchange swapbutton rounded-full bg-[#eee] text-[#555] p-[0.3cm] cursor-pointer' onClick={(e) => changeSwapOption()}></i></div>

<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#555] font-[500]'><span>You Get</span></div>
<div className='mt-[0.5cm]' style={{display:"block"}}>
    <img src="images/bnb.png" width="40" className='rounded-full bg-[#ccc]' style={{display:"inline-block"}} />
    <div className='ml-[0.5cm]' style={{display:"inline-block"}}><span>BNB</span></div>
    <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000]" value={equivBNB} type="text" placeholder='0' />
</div>
<div className='float-right text-[#555]'>≈${equivBNBUSD}</div>
</div>

<div className='my-[0.5cm] text-center text-[#555] text-[110%] font-[500]'>1 BNB ≈ 302.265312 USDT &nbsp; <i className='fa fa-exchange text-[#555]'></i></div>

<div className='text-[#e00] font-[500] mb-[1cm] text-center' id="approveerrordiv" style={{transition:"0.5s ease-in-out"}}></div>

<div><span className='text-center py-[0.3cm] bg-[#02f] font-[500] text-[#fff] w-[48%] rounded-full restorebutton cursor-pointer' style={{display:"inline-block"}} onClick={(e) => ApproveError()}>Approve</span><span className='text-center font-[500] w-[48%] py-[0.3cm] bg-[#eee] text-[#555] rounded-full float-right' style={{display:"inline-block"}} >Preview Swap</span></div>

<div className='my-[1cm] text-center text-[#555] text-[110%] font-[500]'>Approve USDT before you can swap it &nbsp; <i className='fa fa-info-circle'></i></div>

<div className='p-[0.5cm] bg-[#eee] rounded-md mb-[4cm]'>
  <div className='mb-[0.5cm]'><span className='text-[#555]'>Minimum Received</span><span className='text-[#000] float-right'>{equivBNBreceived} BNB (≈${equivUSDreceived})</span></div>
  <div><span className='text-[#555]'>Slippage Tolerance</span><span className='text-[#000] float-right'>1.0 &nbsp; <i className='fa fa-pencil text-[#555]'></i></span></div>
</div>
</div>)
  : 
(<div className='bg-[#000] p-[1cm] rounded-xl dAppdivs'>
<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#555] font-[500]'><span>You Pay</span><span className='float-right text-[#02f]'>Max</span></div>
<div className='mt-[0.5cm] clear-both' style={{display:"block"}}>
    <img src="images/bnb.png" width="40" style={{display:"inline-block"}} />
    <div className='ml-[0.5cm]' style={{display:"inline-block"}}><span>BNB</span></div>
    <input style={{display:"inline-block"}} className="font-[600] w-[30%] placeholder-[#000] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000]" type="text" id="bnbamount" name="bnbamount" value={values.bnbamount} onChange={handleChange} placeholder='0' />
</div>
<div className='float-right text-[#555]'>≈${equivBNBtoUSD}</div>
</div>

<div className='text-center text-[120%] my-[0.1cm]'><i className='fa fa-exchange swapbutton text-[#555] rounded-full bg-[#eee] p-[0.3cm] cursor-pointer' onClick={(e) => changeSwapOptionBack()}></i></div>

<div className='p-[0.5cm] pb-[1cm] bg-[#eee] rounded-xl'>
<div className='text-[#555] font-[500]'><span>You Get</span></div>
<div className='mt-[0.5cm]' style={{display:"block"}}>
<div style={{display:"inline-block"}}><img src="images/tether.png" width="40" className='rounded-full bg-[#ccc]' /></div>
    <div className='ml-[0.5cm]' style={{display:"inline-block"}}><span>USDT</span><br /><span className='text-[80%] text-[#555]'>BNB Smart Chain</span></div>
    <input style={{display:"inline-block"}} className="font-[600] w-[30%] float-right text-[150%] text-right bg-[#eee] outline-none text-[#000]" value={equivUSDBNB} type="text" placeholder='0' />
</div>
<div className='float-right text-[#555]'>≈${equivUSDBNB2}</div>
</div>

<div className='my-[1cm] text-center text-[#555] text-[110%] font-[500]'>1 BNB ≈ 302.265312 USDT &nbsp; <i className='fa fa-exchange text-[#555]'></i></div>

<div className='text-[#e00] font-[500] mb-[1cm] text-center' id="previewerrordiv" style={{transition:"0.5s ease-in-out"}}></div>

<div className='text-center py-[0.3cm] bg-[#02f] font-[500] text-[#fff] rounded-full restorebutton cursor-pointer mb-[1cm]' onClick={(e) => PreviewError()}>Preview Swap</div>

<div className='p-[0.7cm] bg-[#eee] rounded-md mb-[4cm]'>
  <div className='mb-[0.5cm]'><span className='text-[#555]'>Minimum Received</span><span className='text-[#000] float-right'>{equivUSDreceived3} USDT (≈${equivUSDreceived4})</span></div>
  <div className='mb-[0.5cm]'><span className='text-[#555]'>Slippage Tolerance</span><span className='text-[#000] float-right'>1.0 &nbsp; <i className='fa fa-pencil text-[#555]'></i></span></div>
  <div><span className='text-[#555]'>Provider Fee &nbsp; <i className='fa fa-info-circle'></i></span><span className='text-[#000] float-right'>{providerfee1} USDT (≈${providerfee2})</span></div>
</div>
</div>)
}

</div>
   </div>

    </div>
   </div>
  </>
  );
};

