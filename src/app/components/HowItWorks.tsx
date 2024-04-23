"use client";

import { useState } from "react";
import Modal from "./Modal";

const HowItWorks: React.FC = () => {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  return (
    <>
      <div
        className="text-center cursor-pointer hover:underline text-purple-500"
        onClick={() => setShowHowItWorks(true)}
      >
        [ how it works ]
      </div>
      <Modal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
        showCloseButton={false}
      >
        <div className="flex flex-col">
          <div className="flex text-black text-xl font-semibold">
            How it Works
          </div>
        </div>
        <div className="flex m-4 justify-center w-full text-black text-sm">
          <ol className="list-decimal list-outside">
            <li className="mb-2">
              {" "}
              Upload a meme, select your memecoin community and create a custom
              mint frame{" "}
            </li>
            <li className="mb-2">
              {" "}
              Share your meme frame far and wide on Farcaster{" "}
            </li>
            <li className="mb-2">
              {" "}
              Each time your meme is minted, your memecoin community gets 50% of
              the mint revenue{" "}
            </li>
            <li className="mb-2">
              {" "}
              The memecoin community with highest mint revenue across all frames
              on 04/30 wins $${" "}
            </li>
            <li className="mb-2">
              {" "}
              The winning prize is split between meme creators proportionately
              based on your mint frames&apos; revenue contribution
            </li>
          </ol>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowHowItWorks(false)}
            className="rounded-full px-4 py-2 bg-purple-500 hover:bg-purple-700 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
          >
            I&apos;m ready to meme
          </button>
        </div>
      </Modal>
    </>
  );
};

export default HowItWorks;
