import React, { useEffect, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import feed from "../utils/feedAbi.json";
import { connect, disconnect } from "get-starknet";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from "@/components/header";
import Footer from "@/components/footer";

const pricefeed = () => {
  const [connection, setConnection] = useState("");
  const [account, setAccount] = useState("");
  const [address, setAddress] = useState("");
  const [feedOne, setFeedOne] = useState("");
  const [feedTwo, setFeedTwo] = useState("");
  const [feedThree, setFeedThree] = useState("");
  const [feedFour, setFeedFour] = useState("");
  const [feedFive, setFeedFive] = useState("");
  const [feedSix, setFeedSix] = useState("");
  const [feedSeven, setFeedSeven] = useState("");

  const provider = new RpcProvider({
    nodeUrl: process.env.NEXT_PUBLIC_RPC,
  });

  const feedAddress =
    "0x01b2bd8f05940bf95f2eae9a02fcd8f283c02ace54e9af68670349c3f16d4d55";

  const readContract = new Contract(feed, feedAddress, provider);

  const getBtc = async () => {
    try {
      const balance = await readContract.get_btc_to_usd_median();

      setFeedOne(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getEth = async () => {
    try {
      const balance = await readContract.get_eth_to_usd_median();

      setFeedTwo(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getDoge = async () => {
    try {
      const balance = await readContract.get_doge_to_usd_median();

      setFeedThree(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAvax = async () => {
    try {
      const balance = await readContract.get_avax_to_usd_median();

      setFeedFour(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getWbtc = async () => {
    try {
      const balance = await readContract.get_wbtc_to_usd_median();

      setFeedFive(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getWsteth = async () => {
    try {
      const balance = await readContract.get_wsteth_to_usd_median();

      setFeedSix(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSol = async () => {
    try {
      const balance = await readContract.get_sol_to_usd_median();

      setFeedSeven(balance.toString());
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    AOS.init();
  }, [])

  // create countdown for auto-refresh
  const [count, setCount] = useState(30);
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(countdownInterval);
  }, []);

  //auto-refresh code
  const [allowAutoNav, setAllowAutoNav] = useState(true);
  useEffect(() => {
    const autoNav = allowAutoNav && setTimeout(() => {
      window.location.reload();
    }, 30000);

    // Cleanup function to clear the timeout when the component is unmounted
    return () => clearTimeout(autoNav);
}, [allowAutoNav])

  //stop auto-refresh
  const stopNav = () => {
    setAllowAutoNav(false)
  }

  return (
    <main className="flex flex-col">
      <Header />
      <div>
      <img src="images/starknet.png" width="100" className='lg:mt-[10%] mt-[20%] ml-[5%] blurimage1' style={{position:"absolute"}} />
     <img src="images/starknet.png" width="100" className='lg:mt-[15%] mt-[25%] lg:ml-[85%] ml-[70%] blurimage2' style={{position:"absolute"}} />
     <img src="images/logo.png" width="100" className='lg:mt-[35%] mt-[100%] ml-[8%] blurimage2' style={{position:"absolute"}} />
     <img src="images/logo.png" width="100" className='lg:mt-[45%] mt-[105%] lg:ml-[80%] ml-[75%] blurimage1' style={{position:"absolute"}} />
      <div className="w-[100%] pt-[3cm]" style={{overflow:"auto", position:"absolute"}} >
      <div className="text-center lg:text-[200%] md:text-[180%] text-[150%] text-[#fff] mt-[3cm] font-[500]">Price feeds implementing Pragma Oracles on StarkNet  <img src="images/pricefeed.png" width="35" className="ml-[0.5cm]" style={{display:"inline-block"}} /></div>
      {allowAutoNav ? (<div className='text-center mt-[1cm]'>Page will refresh automatically in {count} seconds to update price feeds....</div>) : 
   (<div className='text-center mt-[1cm]'>Auto-refresh cancelled....</div>)}
   <div className='text-center'>
    {allowAutoNav ? (<button onClick={(e) => stopNav(e)} className='mt-[0.5cm] rounded-md bg-[#fff] px-[0.3cm] py-[0.2cm] text-[#001]' style={{boxShadow:"2px 2px 2px 2px #502", animationDuration:"5s"}}>Cancel auto-refresh</button>) : (<div></div>)}
   </div>
      <div data-aos="zoom-in" className="flex flex-row justify-center text-center py-[1cm] gap-8 mt-[3em] mb-[10em]">
        <div className="flex flex-col gap-8 justify-around">
          <div className="rounded-md py-4 px-8 bg-[#502] text-center pricefeeddivs">
            <p onLoad={getBtc()}>BTC/USD {`$${feedOne / 100000000}`}</p>
          </div>
          <div className="rounded-md py-4 px-8 bg-[#502] text-center pricefeeddivs">
            <p onLoad={getEth()}>ETH/USD {`$${feedTwo / 100000000}`}</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 justify-around">
          <div className="rounded-md py-4 px-8 bg-[#502] text-center pricefeeddivs">
            <p onLoad={getDoge()}>DOGE/USD {`$${feedThree / 100000000}`}</p>
          </div>
          <div className="rounded-md py-4 px-8 bg-[#502] text-center pricefeeddivs">
            <p onLoad={getAvax()}>AVAX/USD {`$${feedFour / 100000000}`}</p>
          </div>
          <div className="rounded-md py-4 px-8 bg-[#502] text-center pricefeeddivs">
            <p onLoad={getWbtc()}>WBTC/USD {`$${feedFive / 100000000}`}</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 justify-around">
          <div className="rounded-md py-4 px-8 bg-[#502] text-center pricefeeddivs">
            <p onLoad={getWsteth()}>WSTETH/USD {`$${feedSix / 100000000}`}</p>
          </div>
          <div className="rounded-md py-4 px-8 bg-[#502] text-center pricefeeddivs">
            <p onLoad={getSol()}>SOL/USD {`$${feedSeven / 100000000}`}</p>
          </div>
        </div>
      </div>
      </div>
      </div>
    </main>
  );
};

export default pricefeed;
