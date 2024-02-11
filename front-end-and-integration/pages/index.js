import Head from 'next/head';
import { useState, useEffect } from "react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Home(){
  useEffect(() => {
    AOS.init();
  }, [])
 
  const [display1, setdisplay1] = useState("block")
  const [display2, setdisplay2] = useState("none")
  const [display3, setdisplay3] = useState("none")
  
  const changeDisplay = () => {
    for (let i = 5; i <= 25; i ++) {
      setTimeout(() => {
        if (i === 5) {
          setdisplay1("block");
          setdisplay2("none");
          setdisplay3("none");
        } else if (i === 8) {
          setdisplay1("none");
          setdisplay2("block");
          setdisplay3("none");
        } else if (i === 12) {
          setdisplay1("none");
          setdisplay2("none");
          setdisplay3("block");
        }
      }, i * 2000);
    }
  };
  
  changeDisplay();
  
  

  return (
    <>
    <Head>
   <title>Diverse - The most efficient swap and integration platform on StarkNet</title>
   <link rel="shortcut icon" href="/favicon.ico" />
   </Head>
   <div>
   <Header />


   <div className='lg:mx-[8%] mx-[5%] pt-[3cm]'>

   <div className='lg:mx-[-8%] mx-[-5%] pb-[2cm]' style={{backgroundImage:"url(images/bg1.jpg)", backgroundSize:"100%", backgroundPositionX:"", backgroundPositionY:"50%", backgroundAttachment:"fixed"}}>
   <div className='text-center text-[300%] pt-[1.5cm] font-[500]'>Mass adoption of StarkNet-based technologies</div>
   <div className='mt-[1cm] text-center text-[140%] mx-[20%] py-[1cm] px-[2cm] text-[#ccc] bg-[rgba(0,0,0,0.9)]' style={{border:"1px solid #502"}}>
    <div data-aos="fade-in" className='info1' style={{display:display1, transition:"0.5s ease-in-out"}}>AVNU decentralised exchange protocol to empower traders and dApps with the finest execution and an unparalleled user experience that sets the standard for the industry. 
      Designed to deliver the best execution and provide liquidity infrastructure. 
    </div>
    <div data-aos="fade-in" className='info2' style={{display:display2, transition:"0.5s ease-in-out"}}>ArgentX - Using the open-source, audited ArgentX wallet, you may explore the Starknet ecosystem while benefiting from improved security features like multisig, 
      real-time fraud monitoring, and 2FA. Your assets are only accessible to you. <br></br>
      Braavos - Asset management for self-custodial use is now simpler than ever with Braavos Smart Wallet for Starknet! You can manage your assets from within your browser 
      and safely access decentralised applications on Starknet with Braavos.
    </div>
    <div data-aos="fade-in" className='info1' style={{display:display3, transition:"0.5s ease-in-out"}}>cccc decentralised exchange protocol to empower traders and dApps with the finest execution and an unparalleled user experience that sets the standard for the industry. 
      Designed to deliver the best execution and provide liquidity infrastructure. 
    </div>

   </div>
   <div className='mt-[1cm] text-center'>
    <button className='m-[0.2cm] rounded-md bg-[#502] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3 ecobutton' style={{border:"2px solid #502"}}>Explore Ecosystem <img src="images/blockchain.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></button>
    <button className='m-[0.2cm] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3 docbutton' style={{border:"2px solid #502"}}>Documentation <img src="images/documentation.png" width="25" className='ml-[0.2cm]' style={{display:"inline-block"}}/></button>
    <button className='m-[0.2cm] rounded-md bg-[#111] px-[0.3cm] py-[0.2cm] text-[#fff] generalbutton3 githubbutton' style={{border:"2px solid #502"}}>GitHub <img src="images/github.png" width="25" className='ml-[0.2cm] bg-[#ddd]' style={{display:"inline-block"}}/></button>
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

