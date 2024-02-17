import React, { useEffect, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import feed from "../utils/feedAbi.json";
import { connect, disconnect } from "get-starknet";
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
  return (
    <main className="flex flex-col">
      <Header />
      <div className="bg-[#001]">
      <div className="text-center lg:text-[200%] md:text-[180%] text-[150%] text-[#fff] mt-[3cm] font-[500]">Price feeds implementing Pragma Oracles on StarkNet  <img src="images/pricefeed.png" width="35" className="ml-[0.5cm]" style={{display:"inline-block"}} /></div>
      <div className="flex flex-row justify-center items-center gap-8 mt-[5em] mb-[10em]" style={{overflow:"auto"}}>
        <div className="flex flex-col gap-8 justify-around">
          <div className="border-2 rounded-md py-4 px-8 bg-[#502]">
            <p onLoad={getBtc()}>BTC/USD {`$${feedOne / 100000000}`}</p>
          </div>
          <div className="border-2 rounded-md py-4 px-8 bg-[#502]">
            <p onLoad={getEth()}>ETH/USD {`$${feedTwo / 100000000}`}</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 justify-around">
          <div className="border-2 rounded-md py-4 px-8 bg-[#502]">
            <p onLoad={getDoge()}>DOGE/USD {`$${feedThree / 100000000}`}</p>
          </div>
          <div className="border-2 rounded-md py-4 px-8 bg-[#502]">
            <p onLoad={getAvax()}>AVAX/USD {`$${feedFour / 100000000}`}</p>
          </div>
          <div className="border-2 rounded-md py-4 px-8 bg-[#502]">
            <p onLoad={getWbtc()}>WBTC/USD {`$${feedFive / 100000000}`}</p>
          </div>
        </div>
        <div className="flex flex-col gap-8 justify-around">
          <div className="border-2 rounded-md py-4 px-8 bg-[#502]">
            <p onLoad={getWsteth()}>WSTETH/USD {`$${feedSix / 100000000}`}</p>
          </div>
          <div className="border-2 rounded-md py-4 px-8 bg-[#502]">
            <p onLoad={getSol()}>SOL/USD {`$${feedSeven / 100000000}`}</p>
          </div>
        </div>
      </div>
      </div>
      <div className="py-[1cm] bg-[#000]">
      <Footer />
      </div>
    </main>
  );
};

export default pricefeed;
