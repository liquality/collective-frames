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
      <div className="flex flex-col items-center justify-center mt-12 mb-12">
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

      {isMobileState ? (
        <div className="flex flex-col items-center mt-12  border-2 border-white justify-center rounded-2xl bg-white bg-opacity-30 p-4">
          <Image
            className="img-responsive"
            width={30}
            height={30}
            src="/sdk_logo.svg"
            alt="SDK Logo"
          />
          <div className="w-[281px] text-white text-[32px] font-bold  leading-9 tracking-wide mb-3">
            Built with the Liquality Collective SDK{" "}
          </div>
          <div className="w-[281px] text-white text-xl font-medium  leading-[30px]">
            Liquality provides open-source infrastructure legos that make web3
            easy for users and developers while maintaining the values of Web3.
          </div>
        </div>
      ) : (
        <div className="p-12 bg-violet-50 bg-opacity-30 rounded-[40px] border-2 border-violet-50 justify-start items-center gap-16 inline-flex">
          <div className="">
            <Image
              className="img-responsive"
              width={40}
              height={40}
              src="/sdk_logo.svg"
              alt="SDK Logo"
            />
          </div>
          <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-6 inline-flex">
            <div className="self-stretch text-white text-[38px] font-semibold  leading-[56px] tracking-wide">
              Built with the Liquality Collective SDK{" "}
            </div>
            <div className="self-stretch text-white text-xl font-normal  leading-[29px]">
              Liquality provides open-source infrastructure legos that make web3
              easy for users and developers while maintaining the values of
              Web3.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurVision;
