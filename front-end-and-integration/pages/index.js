import Head from 'next/head';
import { useState, useEffect } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useRouter } from 'next/router';

export default function Home(){
  useEffect(() => {
    AOS.init();
  }, [])

  // create countdown for navigation
  const [count, setCount] = useState(60);
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(countdownInterval);
  }, []);

  //navigate to swap page
  const [allowAutoNav, setAllowAutoNav] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const autoNav = allowAutoNav && setTimeout(() => {
      router.push("/dapp");
    }, 60000);

    // Cleanup function to clear the timeout when the component is unmounted or auto navigation is stopped
    return () => clearTimeout(autoNav);
}, [allowAutoNav, router])

  //stop navigation to swap page
  const stopNav = () => {
    setAllowAutoNav(false)
  }

  return (
    <>
    <Head>
   <title>Diverse - The most efficient swap and integration platform on StarkNet</title>
   <link rel="shortcut icon" href="/favicon.ico" />
   </Head>
   <div>
   <Header />
   <div className='lg:mx-[8%] mx-[5%] pt-[3cm]'>


   <div className='lg:mx-[-8%] mx-[-5%] pb-[2cm] firstsectiondiv' style={{backgroundImage:"url(images/bg1.jpg)"}}>
   <div className='text-center text-[180%] lg:text-[300%] md:text-[250%] pt-[1.5cm] font-[500]'>Mass adoption of StarkNet-based technologies</div>
   <div className='mt-[1cm] text-center lg:text-[140%] text-[120%] lg:mx-[20%] md:mx-[10%] mx-[5%] p-[1cm] lg:px-[2cm] text-[#ccc] bg-[rgba(0,0,0,0.9)]' style={{border:"1px solid #502"}}>
    <div data-aos="fade-in" className='info1' style={{transition:"0.5s ease-in-out"}}>
    ArgentX - Using the open-source, audited ArgentX wallet, you may explore the Starknet ecosystem while benefiting from improved security features like multisig, 
      real-time fraud monitoring, and 2FA. Your assets are only accessible to you. <br></br>
      Braavos - Asset management for self-custodial use is now simpler than ever with Braavos Smart Wallet for Starknet! You can manage your assets from within your browser 
      and safely access decentralised applications on Starknet with Braavos.
    </div>
    <div data-aos="fade-in" className='info2' style={{transition:"0.5s ease-in-out"}}>
    JediSwap - Creating tools and applications with StarkNet's largest community-driven crypto project. Quick tutorials, documentation, an open source platform, and a Javascript SDK are provided at first.
    </div>
    <div data-aos="fade-in" className='info3' style={{transition:"0.5s ease-in-out"}}>Nimbora - Using Zero Knowledge Rollups, thousands of transactions can be handled in one batch of processing. By offering validity proofs rather 
    than publishing full transaction data on the Ethereum blockchain, this can be accomplished.
    gas fee concerns are no longer a concern!  When engaging with your preferred L1 protocols, ZK technology in conjunction with Account Abstraction results in a 
    significant decrease in gas fees.
    </div>
    <div data-aos="fade-in" className='info4' style={{transition:"0.5s ease-in-out"}}>
    Pragma - Your smart contracts are decentralized, transparent and composable
    </div>
    <div data-aos="fade-in" className='info5' style={{transition:"0.5s ease-in-out"}}>
    Herodotus - This API allows developers to focus on creating by mutualizing the costs of generating storage proofs and saving them a considerable amount of time.
    </div>
   </div>
   <div className='mt-[1cm] text-center'>
    <Link href="/dapp"><button className='m-[0.2cm] rounded-md bg-[#502] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3 ecobutton' style={{border:"2px solid #502"}}>Explore Ecosystem <img src="images/blockchain.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></button></Link>
    <Link href="https://github.com/faytey/Diverse"><button className='m-[0.2cm] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3 docbutton' style={{border:"2px solid #502"}}>Documentation <img src="images/documentation.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></button></Link>
    <Link href="https://github.com/faytey/Diverse"><button className='m-[0.2cm] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3 githubbutton' style={{border:"2px solid #502"}}>GitHub <img src="images/github.png" width="25" className='ml-[0.2cm] bg-[#ddd]' style={{display:"inline-block"}}/></button></Link>
   </div>
   {allowAutoNav ? (<div className='text-center mt-[1cm]'>You will be automatically navigated to the dApp in {count} seconds....</div>) : 
   (<div className='text-center mt-[1cm]'>Automatic navigation cancelled....</div>)}
   <div className='text-center'>
    {allowAutoNav ? (<button onClick={(e) => stopNav(e)} className='fa-fade mt-[0.5cm] rounded-md bg-[#fff] px-[0.3cm] py-[0.2cm] text-[#001]' style={{boxShadow:"2px 2px 2px 2px #502", animationDuration:"5s"}}>Cancel auto navigation</button>) : (<div></div>)}
   </div>
   </div>


   <div id="diversecomponents" className='mt-[2cm]'>
    <div className='grid lg:grid-cols-3 grid-cols-1 gap-4'>
      <div className='grid-cols-1 lg:col-span-2 col-span-3'>
      <div className='lg:h-[15.85cm] h-[7cm] rounded-xl lg:p-[1cm] p-[0.5cm] homepagedappdiv' style={{backgroundImage:"url(images/dapps.png)", boxShadow:"2px 2px 10px 1px #502"}}>
        <div className='lg:text-[200%] text-[150%] lg:mt-[10%] mt-[3%] text-[#fff] font-[500]'>dApp on StarkNet testnet</div>
        <div className='lg:text-[400%] text-[200%] mt-[3%] text-[#eee] font-[500]'>Live Now</div>
        <Link href="/dapp"><button className='lg:mt-[10%] mt-[3%] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3' style={{border:"2px solid #502"}}>Access dApp</button></Link>
      </div>
      </div>
      <div className='grid-cols-1 lg:col-span-1 col-span-3'>
        <div className='grid grid-cols-1 gap-4'>
        <div className='grid-cols-1 h-[5cm] rounded-xl p-[0.5cm]' style={{backgroundImage:"url(images/argentx.jpg)", backgroundPositionY:"20%", backgroundSize:"120%", boxShadow:"2px 2px 10px 1px #502"}}>
        <div className='text-[120%] text-[#000] font-[600]'>ArgentX mobile wallet</div>
        <div className='text-[130%] mt-[3%] text-[#502] font-[500]'>User-friendly wallet designed for StarkNet applications</div>
        <button className='mt-[3%] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3' style={{border:"2px solid #502"}}>Access wallet</button>
        </div>
        <div className='grid-cols-1 h-[5cm] rounded-xl p-[0.5cm]' style={{backgroundImage:"url(images/jediswap.png)",  backgroundPositionY:"80%", backgroundSize:"130%", boxShadow:"2px 2px 10px 1px #502"}}>
        <div className='text-[120%] text-[#fff] font-[600]'>JediSwap</div>
        <div className='text-[130%] mt-[3%] text-[#eee] font-[500]'>Tools for concentrated liquidity providers</div>
        <Link href="/dapp"><button className='mt-[3%] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3' style={{border:"2px solid #502"}}>Access dApp</button></Link>
        </div>
        <div className='grid-cols-1 h-[5cm] rounded-xl p-[0.5cm]' style={{backgroundImage:"url(images/nimbora.png)", backgroundPositionY:"40%", backgroundSize:"120%", boxShadow:"2px 2px 10px 1px #502"}}>
        <div className='text-[120%] text-[#fff] font-[600]'>Nimbora</div>
        <div className='text-[130%] mt-[3%] text-[#eee] font-[500]'>Handle thousands of transactions in one click</div>
        <Link href="/dapp"><button className='mt-[3%] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3' style={{border:"2px solid #502"}}>Visit dApp</button></Link>
        </div>
        </div>
      </div>
    </div>
   </div>


      <div id="forum" className='mt-[2cm]'>
       <div className="text-[180%] lg:text-[300%] md:text-[250%] text-center font-[600] mb-[5%]">Diverse Forum</div>
       <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
        <div className="grid grid-cols-1 px-[5%] py-[10%] rounded-xl bg-[#111]" data-aos="flip-down" style={{border:"2px solid #502"}}>
            <div><img src="images/forum2.png" width="70" className="m-[auto]" /></div>
        <div className="lg:text-[200%] md:text-[180%] text-[150%] font-[600] mt-[10%]">Rewards system</div>
        <div className="lg:text-[120%] md:text-[110%] text-[105%] mt-[5%]"> 
        With a robust reward system, Diverse aims to reward users based on their usage of the platform. Diverse tokens 
        are rewarded for transactions. To learn more about the reward system, visit Diverse forum below.
        </div>
        <div className="mt-[5%]">
          <Link href="https://discord.com"><button className='rounded-md bg-[#000] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3'>Forum discussion</button></Link>
          <Link href="/dapp"><button className='rounded-md bg-[#000] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3 ml-[0.5cm]'>Go to dApp</button></Link>
        </div>
        </div>
        <div className="grid grid-cols-1 px-[5%] py-[10%] rounded-xl bg-[#010]" data-aos="flip-down" style={{border:"2px solid #502"}}>
        <div className="m-[auto]"><img src="images/forum.png" width="70"/></div>
        <div className="lg:text-[200%] md:text-[180%] text-[150%] font-[600] mt-[10%]">Resource Management</div>
        <div className="lg:text-[120%] md:text-[110%] text-[105%] mt-[5%]">
        We place a high priority on responsibility, transparency, and a value-oriented approach because we are stewards of an important protocol and have the capacity to influence the financial results of many products on StarkNet.
        </div>
        <div className="mt-[5%]"><Link href="https://discord.com"><button className='rounded-md bg-[#000] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3'>Visit forum</button></Link></div>
        </div>
       </div>
      </div>


      <div id="community" className="mt-[2cm]">
            <div className="text-[180%] lg:text-[300%] md:text-[250%] text-center font-[600] mb-[5%]">Join the Diverse Community</div>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
            <div className="grid-cols-1 px-[8%] pt-[10%] pb-[20%] rounded-xl socialcols1">
             <div><span className="px-[0.5cm] py-[0.3cm] bg-[rgba(0,0,0,0.8)] rounded-md">Twitter</span></div>
             <div className="mt-[0.5cm] text-center"><Link href="https://twitter.com"><img src="images/twitter.png" width="50" className='m-[0.2cm]' style={{display:"inline-block"}} /></Link></div>
            </div>
            <div className="grid-cols-1 px-[8%] pt-[10%] pb-[20%] rounded-xl socialcols2">
             <div><span className="px-[0.5cm] py-[0.3cm] bg-[rgba(0,0,0,0.8)] rounded-md">Telegram</span></div>
             <div className="mt-[0.5cm] text-center"><Link href="https://telegram.org"><img src="images/telegram.png" width="50" className='m-[0.2cm]' style={{display:"inline-block"}} /></Link></div>
            </div>
            <div className="grid-cols-1 px-[8%] pt-[10%] pb-[20%] rounded-xl socialcols3">
             <div><span className="px-[0.5cm] py-[0.3cm] bg-[rgba(0,0,0,0.8)] rounded-md">Discord</span></div>
             <div className="mt-[0.5cm] text-center"><Link href="https://discord.com"><img src="images/discord.png" width="50" className='m-[0.2cm]' style={{display:"inline-block"}} /></Link></div>
            </div>
            <div className="grid-cols-1 px-[8%] pt-[10%] pb-[20%] rounded-xl socialcols4">
             <div><span className="px-[0.5cm] py-[0.3cm] bg-[rgba(0,0,0,0.8)] rounded-md">LinkedIn</span></div>
             <div className="mt-[0.5cm] text-center"><Link href="https://linkedin.com"><img src="images/linkedin.png" width="50" className='m-[0.2cm]' style={{display:"inline-block"}} /></Link></div>
            </div>
            </div>
        </div>


       <div id="developers" className="mt-[2cm]">
            <div className="text-[180%] lg:text-[300%] md:text-[250%] text-center font-[600] mb-[5%]">Meet our Team of Developers</div>
       <div className="grid md:grid-cols-3 lg:grid-cols-3 grid-cols-1 gap-8 mb-[1%] lg:mx-[10%]" style={{transition:"0.5s ease-in-out"}}>
       <div data-aos="zoom-in" className="grid-cols-1 mb-[5%] rounded-xl text-center teamcols1">
            <img src="images/patrick.jpg" className='w-[100%] rounded-xl developersimages' />
            <div className="text-center mx-[5%] mt-[0.2cm] py-[0.2cm] bg-[rgba(20,20,20,0.8)] rounded-xl teaminfo" style={{transition:"0.5s ease-in-out"}}>
            <div className="text-md">PATRICK OMINISAN</div>
            <div><i class="fa fa-chevron-circle-down text-[#fff]"></i></div>
            <div className="font-[600]">Blockchain engineer</div>
            </div>
           </div>
       <div data-aos="zoom-in" className="grid-cols-1 mb-[5%] rounded-xl text-center teamcols1">
            <img src="images/faith.jpg" className='w-[100%] rounded-xl developersimages' />
            <div className="text-center mx-[5%] mt-[0.2cm] py-[0.2cm] bg-[rgba(20,20,20,0.8)] rounded-xl teaminfo" style={{transition:"0.5s ease-in-out"}}>
            <div className="text-md">FAITH ROBERTS</div>
            <div><i class="fa fa-chevron-circle-down text-[#fff]"></i></div>
            <div className="font-[600]">Smart contract engineer</div>
            </div>
           </div>
       <div data-aos="zoom-in" className="grid-cols-1 mb-[5%] rounded-xl text-center teamcols1">
            <img src="images/nonso.jpg" className='w-[100%] rounded-xl developersimages' />
            <div className="text-center mx-[5%] mt-[0.2cm] py-[0.2cm] bg-[rgba(20,20,20,0.8)] rounded-xl teaminfo" style={{transition:"0.5s ease-in-out"}}>
            <div className="text-md">IDOGWU CHINONSO</div>
            <div><i class="fa fa-chevron-circle-down text-[#fff]"></i></div>
            <div className="font-[600]">Smart contract engineer</div>
            </div>
           </div>
         </div>
        </div>


   </div>

   <div className='mt-[2cm] bg-[#000012] px-[2cm] py-[1cm] text-center'>
    <Footer />
   </div>

   </div>
  </>
  );
};

