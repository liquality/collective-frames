"use client";
import CopyFrameModal from "@/app/components/CopyModal";
import useGetFrameById from "@/hooks/useGetFrameById";

import { useState } from "react";
import { toast } from "react-toastify";

export default function Share() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { frame, loading } = useGetFrameById();

  const frameUrl = "http://localhost:3000/frames/";

  const handleCopyClick = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast("Frame URL copied to clipboard, paste it in a cast!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };
  return (
    <div className="flex flex-col mt-8">
      <div className="flex w-full mt-5 flex-col">
        <div className="flex justify-center mx-24">
          Share this frame link and encourage others to mint your meme. More
          mints = more hype and profits for you and your community
        </div>

        <div className="flex w-full">
          <div
            className={
              frame
                ? "flex flex-1 text-gray-400 items-center"
                : "flex flex-1 items-center"
            }
          >
            <b className="text-lg mr-3">1</b>
            Choose meme & community
          </div>
          <div
            className={
              frame
                ? "flex flex-1 items-center"
                : "flex flex-1 text-gray-400 items-center"
            }
          >
            <b className="text-lg mr-3">2</b>
            Get link to share
          </div>
        </div>
        <div className="flex mt-4 justify-center">
          <img
            src={frame?.frame.imageUrl || ""}
            alt="Uploaded meme"
            style={{ width: "40%", height: "40%" }}
            className="object-cover"
          />
        </div>
        <div className="flex mt-12 justify-center">
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            style={{ width: 300 }}
            className="rounded-full text-center px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
          >
            Share on Warpcast
          </button>
        </div>
        <div className="flex mt-4 justify-center">
          <a
            target="_blank"
            href={frame?.zoraUrl}
            style={{ width: 300 }}
            className="rounded-full text-center px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
          >
            Check out on Zora.co
          </a>
        </div>
        <div className="flex mt-4 justify-center">
          <button
            onClick={() => handleCopyClick(frameUrl + frame?.frame?.slug)}
            style={{ width: 300 }}
            className="rounded-full px-4 py-2 border border-purple-500 text-purple-500 focus:outline-none focus:ring-0 mb-3"
          >
            Copy Link to share
          </button>
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
