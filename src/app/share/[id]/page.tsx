/* eslint-disable @next/next/no-img-element */
"use client";
import CopyFrameModal from "@/app/components/CopyModal";
import useGetFrameById from "@/hooks/useGetFrameById";

import { useState } from "react";
import { toast } from "react-toastify";

export default function Share() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { frame } = useGetFrameById();

  const frameUrl = process.env.NEXT_PUBLIC_SERVER_URL + "frames-transaction/";

  const handleCopyClick = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Success! Link was copied.");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  return (
    <div className="flex flex-col w-full md:w-4/5 px-8 bg-white bg-opacity-70 p-3 rounded-[10px] text-black">
      <div className="flex w-full flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 items-center hidden md:flex text-gray-400">
            <div className="text-3xl  font-bold leading-loose mr-4">1</div>
            Choose your meme
          </div>
          <div className="flex flex-1 text-slate-900 items-center">
            <div className="text-3xl font-bold leading-loose mr-4">2</div>
            Get link to share
          </div>
        </div>
        <div className="mt-1">
          Cast the meme frame on Warpcast. More mints boost profits and
          awareness for your community and memecoin!
        </div>

        <div className="flex flex-col mt-4 items-center ">
          <p className="text-xl font-semibold">{frame?.frame.name || ""}</p>
          {frame?.frame?.frameImgUrl && (
            <img
              src={frame?.frame.frameImgUrl || ""}
              alt="Uploaded meme"
              className="object-contain mt-3 w-10/12 sm:w-2/4"
            />
          )}
        </div>
        <div className="flex mt-12 justify-center">
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="rounded-full text-center px-8 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
          >
            Share on Warpcast
          </button>
        </div>
        <div className="flex mt-4 justify-center">
          <button
            onClick={() => handleCopyClick(frameUrl + frame?.frame?.slug)}
            className="rounded-full text-center px-8 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
          >
            Copy Link to share
          </button>
        </div>

        <div className="flex mt-4 justify-center">
          <a
            target="_blank"
            href={frame?.zoraUrl}
            className="rounded-full text-center px-10 py-2 border border-purple-500 text-purple-500 focus:outline-none focus:ring-0 mb-3"
          >
            View on Zora.co
          </a>
        </div>
      </div>
      {frame ? (
        <CopyFrameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          frameData={frame}
        />
      ) : null}
    </div>
  );
}
