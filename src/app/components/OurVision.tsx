"use client";
import Image from "next/image";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import Footer from "./Footer";

const OurVision = () => {
  const [isMobileState, setIsMobileState] = useState(false);
  useEffect(() => {
    setIsMobileState(isMobile);
  }, []);

  return (
    <div className="flex items-center justify-center flex-col mb-3">
      <div className="line mb-5 mt-12"></div>
      <div className="flex flex-col items-center justify-center mt-12 mb-6">
        <div className=" text-center text-white text-[32px] font-bold leading-[56px] tracking-wide mb-4">
          OUR VISION
        </div>
        <div className=" text-center text-zinc-100 text-xl leading-[33.60px]">
          We champion collective action as a cornerstone of Web3 by introducing
          our tech to the Warpcast community, home to innovators. Your
          participation earns rewards, and we value your feedback at{" "}
          <a className="text-purple-500" href="mailto:info@liquality.io">
            info@liquality.io
          </a>
        </div>
      </div>
      <div className="line mb-5 mt-6"></div>
      {/* bg-violet-50 bg-opacity-30 rounded-[40px] border-2 border-violet-50 */}
      <div className="flex flex-col md:flex-row items-center mt-6  border-2 border-white justify-center rounded-2xl bg-white bg-opacity-30 p-4">
        <img className="w-4/6 md:p-24" src="/sdk_logo.svg" alt="SDK Logo" />
        <div className="flex flex-col">
          <div className="mt-6 text-white text-[1.8rem] md:text-[3.8rem] font-bold leading-9 md:leading-[5rem] tracking-wide mb-3">
            Built with the Liquality Collective SDK{" "}
          </div>
          <div className="text-white text-xl md:pr-24 font-medium leading-[30px] mt-4">
            Liquality provides open-source infrastructure legos that make web3
            easy for users and developers while maintaining the values of Web3.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurVision;
