/* eslint-disable @next/next/no-img-element */
"use client";

import ApiService from "@/utils/api-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Dashboard() {
  const router = useRouter();
  const [frames, setFrames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    ApiService.fetchFramesByCurrentUser().then((data: any[]) => {
      if (data.length > 0) {
        setFrames(data);
        setLoading(false);
      } else {
        router.push("/create-frame");
      }
    });
  }, []);

  const frameUrl = process.env.NEXT_PUBLIC_SERVER_URL + "frames-transaction/";

  const handleCopyClick = (text: string) => {
    navigator.clipboard
      .writeText(frameUrl + text)
      .then(() => {
        toast("Success! Link was copied.");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
        toast("Copying the link failed. Try again.");
      });
  };
  return (
    <div className="flex flex-col w-full md:w-4/5">
      {loading ? (
        <div className="flex text-center justify-center text-lg">
          Loading your Memes ...
        </div>
      ) : (
        <div className="flex flex-col mt-8 p-8 bg-white bg-opacity-70 rounded-[10px] text-black">
          <div className="flex flex-col">
            <div className="flex">Active Frames ({frames?.length || 0})</div>
            <div className="flex mt-4 mb-12 flex-col">
              {frames.map((frame) => (
                <div className="flex flex-col items-center" key={frame.id}>
                   <div
                    className="flex text-purple-500 cursor-pointer hover:text-purple-900 hover:text-decoration-1"
                    onClick={() => router.push(`/share/${frame.id}`)}
                  >
                    {frame.name}
                  </div>
                  <div
                    className="flex cursor-pointer mt-4 justify-center"
                    onClick={() => router.push(`/share/${frame.id}`)}
                  >
                    {frame?.nftImgUrl && (
                      <img
                        src={frame?.nftImgUrl || ""}
                        alt="Uploaded meme"
                        className="mt-1 w-10/12 sm:w-2/4 object-contain"
                      />
                    )}
                  </div>
                  <div className="mt-4 hidden sm:flex">
                    <a
                      href="#"
                      className="text-purple-500"
                      onClick={() => handleCopyClick(frame?.slug)}
                    >
                      {frameUrl + frame?.slug}
                    </a>
                  </div>
                  <div className="line mb-5 mt-6"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-12">
            <a
              href="/create-frame"
              className="rounded-full px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
            >
              Create another Meme NFT
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
