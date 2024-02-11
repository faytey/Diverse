import Head from 'next/head';
import { useState, useEffect } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { connect, disconnect } from "get-starknet";
import { Contract, RpcProvider } from 'starknet';

export default function Header(){
  const [menu, setmenu] = useState(true)
  const changemenubehaviour1 = () => {
    setmenu(false)
  }
  const changemenubehaviour2 = () => {
    setmenu(true)
  }

  const [EcosystemButton, setEcosystemButton] = useState(true)
  const changeEcosystemButton = () => {
    setEcosystemButton(false)
  }
  const returnEcosystemButton = () => {
    setEcosystemButton(true)
  }

  const [smallMenuEcosystemButton, setsmallMenuEcosystemButton] = useState(true)
  const changesmallMenuEcosystemButton = () => {
    setsmallMenuEcosystemButton(false)
  }
  const returnsmallMenuEcosystemButton = () => {
    setsmallMenuEcosystemButton(true)
  }

  useEffect(() => {
    AOS.init();
  }, [])

  // wallet instructions
  const [connectWallet, setConnectWallet] = useState(true)
  const [connectedWallet, setConnectedWallet] = useState(false)
  //to connect our wallet
  const connecttheWallet = async (e) => {
    try {
      e.preventDefault();
      const starknet = await connect();
      const walletAddress = starknet.account.address
      console.log(walletAddress)

       // Update state
       setConnectedWallet(true);
       setConnectWallet(false);  
    } catch (error) {
      console.log('Error connecting to StarkNet:', error.message);
    }
  };


  //to disconnect our wallet
  const disconnectWallet = async(e) => {
    e.preventDefault();
    const starknet = await disconnect();
    setConnectedWallet(false)
    setConnectWallet(true)
  } 
  
    return (
      <div>

      <div className='text-center w-[100%] py-[0.3cm] text-[#fff] bg-[rgba(0,0,0,0.97)] headerdivforlarge' style={{boxShadow:"-1px 1px 1px 1px rgba(0,0,0,0.2)", zIndex:"9999", position:"fixed"}}>
      <Link href="/"><img src="images/logo.png" width="80" style={{display:"inline-block"}} alt="logo" /></Link>
      <div className='ml-[2cm]' style={{display:"inline-block"}}>
      {EcosystemButton ? (<button onClick={(e) => changeEcosystemButton(e)} className='ml-[1cm] menuitems'><span>Ecosystem</span><i className='fa fa-caret-down ml-[0.2cm]'></i></button>) : 
      (<div style={{display:"inline-block"}}>
      <button onClick={(e) => returnEcosystemButton(e)} className='ml-[1cm] menuitems'><span>Ecosystem</span><i className='fa fa-caret-up ml-[0.2cm]'></i></button>
      <div data-aos="fade-down" className='w-[5cm] h-[7.1cm] mt-[0.2cm] rounded-md bg-[rgba(0,30,0,0.95)] p-[0.4cm]' style={{position:"absolute", transition:"0.3s ease-in-out"}}>
      <Link href="/"><button onClick={(e) => returnEcosystemButton(e)} className='menuitems2 p-[0.2cm] w-[95%] rounded-md bg-[#000] mb-[0.3cm]'>AVNU</button></Link>
      <Link href="/"><button onClick={(e) => returnEcosystemButton(e)} className='menuitems2 p-[0.2cm] w-[95%] rounded-md bg-[#000] mb-[0.3cm]'>Wallets</button></Link>
      <Link href="/"><button onClick={(e) => returnEcosystemButton(e)} className='menuitems2 p-[0.2cm] w-[95%] rounded-md bg-[#000] mb-[0.5cm]'>JediSwap</button></Link>
      <div className='mb-[0.5cm]' style={{borderBottom:"2px solid #aaa"}}></div>
      <Link href="/"><div onClick={(e) => returnEcosystemButton(e)} className='menuitems3 mb-[0.2cm] bg-[#bb0] py-[0.2cm] mx-[-0.4cm]'>Nimbora</div></Link>
      <Link href="/"><div onClick={(e) => returnEcosystemButton(e)} className='menuitems3 mb-[0.5cm] bg-[#030] py-[0.2cm] mx-[-0.4cm] rounded-b-md'>Pragma</div></Link>
      </div>
      </div>)
      }
      <Link href="/"><button className='ml-[1cm] menuitems'>Community</button><img src="images/community.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></Link>
      <Link href="/"><button className='ml-[1cm] menuitems'>Developers</button><img src="images/developers.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></Link>
      <Link href="/"><button className='ml-[1cm] menuitems'>Blog</button><img src="images/blog.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></Link>
      </div>
      <Link href="/#allhomepageitems">
      <div className='ml-[2cm]' style={{display:"inline-block"}}>
      <span className='text-[#fff] font-[600]'>Explore StarkNet's most efficient swap and integration platform</span>
      <img src="images/starknet.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}} />
      </div>
      </Link>
      <div className="ml-[2cm]" style={{display:"inline-block"}}>
        {connectWallet ? (<span className="bg-[#001] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer connectwalletbutton" style={{border:"2px solid #fff"}} onClick={(e) => connecttheWallet(e)}>Connect wallet</span>) : (<div></div>)}
        {connectedWallet ? (<span className="bg-[#003] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer disconnectwalletbutton" style={{border:"2px solid #502"}} onClick={(e) => disconnectWallet(e)}><i className="fa fa-circle text-[80%] text-[#060]"></i> &nbsp; Connected &nbsp; 0x652D9xac...</span>) : (<div></div>)}
      </div>
      </div>

      <div className='w-[100%] headerdivforsmallandmedium' style={{position:"fixed", zIndex:"9999"}}>
      {menu ? 
      (<div className='px-[0.3cm] pb-[0.3cm] bg-[#000]' style={{display:"block"}}>
      <img src="images/side-menu.png" width="40" onClick={(e) => changemenubehaviour1(e)} className='cursor-pointer my-[auto] pt-[0.3cm]' style={{display:"inline-block"}}/>
      <Link href="/"><img src="images/logo.png" width="70" className='float-right py-[0.1cm]' style={{display:"inline-block"}}/></Link>
      </div>) : 
 
      (<div className='bg-[rgba(0,0,0,0.85)] pb-[100%]'>
      <div data-aos="fade-right" className='bg-[#111] text-[#fff] w-[87%] pb-[15%]'>
      <div className='py-[0.3cm] px-[0.2cm] text-right' style={{boxShadow:"-2px 0px 5px 2px #000", display:"block"}}><img src="images/cancel2.png" width="40" onClick={(e) => changemenubehaviour2(e)} className='cursor-pointer' style={{display:"inline-block"}} /></div>
      <div className='px-[0.5cm]'>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='py-[0.5cm] menuitems4' style={{borderBottom:"3px solid #000"}}>Home <img src="images/home.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></div></Link>
       {smallMenuEcosystemButton ? (<div className='py-[0.5cm] menuitems4' onClick={(e) =>changesmallMenuEcosystemButton(e)} style={{borderBottom:"3px solid #000"}}>Ecosystem <i className='fa fa-caret-down ml-[0.2cm] text-[120%]'></i></div>) : 
       (<div>
       <div className='py-[0.5cm] menuitems4' onClick={(e) => returnsmallMenuEcosystemButton(e)}>Ecosystem <i className='fa fa-caret-up ml-[0.2cm] text-[120%]'></i></div>
       <div data-aos="fade-down" className='ml-[0.3cm] bg-[#121]'>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='p-[0.3cm] menuitems3' style={{borderBottom:"2px solid #111"}}>AVNU</div></Link>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='p-[0.3cm] menuitems3' style={{borderBottom:"2px solid #111"}}>Wallets</div></Link>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='p-[0.3cm] menuitems3' style={{borderBottom:"2px solid #111"}}>JediSwap</div></Link>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='p-[0.3cm] menuitems3' style={{borderBottom:"2px solid #111"}}>Nimbora</div></Link>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='p-[0.3cm] menuitems3'>Pragma</div></Link>
       </div>
       </div>)
      }
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='py-[0.5cm] menuitems4' style={{borderBottom:"3px solid #000"}}>Community <img src="images/community.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></div></Link>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='py-[0.5cm] menuitems4' style={{borderBottom:"3px solid #000"}}>Developers <img src="images/developers.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></div></Link>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><div className='py-[0.5cm] menuitems4' style={{borderBottom:"3px solid #000"}}>Blog <img src="images/blog.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></div></Link>
       <div className="text-center pt-[1cm]">
        {connectWallet ? (<span className="bg-[#001] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer connectwalletbutton" style={{border:"2px solid #fff"}} onClick={(e) => connecttheWallet(e)}>Connect wallet</span>) : (<div></div>)}
        {connectedWallet ? (<span className="bg-[#003] px-[0.5cm] py-[0.2cm] font-[600] rounded-full cursor-pointer disconnectwalletbutton" style={{border:"2px solid #502"}} onClick={(e) => disconnectWallet(e)}><i className="fa fa-circle text-[80%] text-[#060]"></i> &nbsp; Connected &nbsp; 0x652D9xac...</span>) : (<div></div>)}
      </div>
       <div className='mt-[1cm]' style={{display:"block"}}>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><img src="images/logo.png" width="80" style={{display:"inline-block"}}/></Link>
       <Link href="/" onClick={(e) => changemenubehaviour2(e)}><img src="images/starknet.png" width="40" className='ml-[0.5cm]' style={{display:"inline-block"}}/></Link>
       </div>
      </div>
      </div>
      </div>)
       }
      </div> 

      </div>
    )
}