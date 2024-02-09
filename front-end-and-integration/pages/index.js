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

  return (
    <>
    <Head>
   <title>Diverse - The most efficient swap and integration platform on StarkNet</title>
   <link rel="shortcut icon" href="/favicon.ico" />
   </Head>
   <div style={{backgroundImage:"url(images/bg6.jpg)", backgroundPositionX:"50%", backgroundPositionY:"50%", backgroundAttachment:"fixed"}}>
   <Header />



   <div className='lg:px-[8%] px-[5%] pt-[3cm]'>
  
   </div>

   <div className='mt-[2cm] bg-[#000012] px-[2cm] py-[1cm] text-center'>
    <Footer />
   </div>

   </div>
  </>
  );
};

