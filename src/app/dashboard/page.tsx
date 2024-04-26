/* eslint-disable @next/next/no-img-element */
"use client";

import { getTokensOwners } from "@/utils/3rd-party-apis";
import ApiService from "@/utils/api-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const router = useRouter();
  const [frames, setFrames] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOwners, setLoadingOwners] = useState(true);

  const getOwners = async () => {
    setLoadingOwners(true);
    const tokenAddresses = frames.map(
      (frame) => frame.nftTokenAddress as string
    );
    const data = await getTokensOwners(tokenAddresses);
    setOwners(data);
    console.log(data, "owners");
    setLoadingOwners(false);
  };

  useEffect(() => {
    setLoadingOwners(true);
    ApiService.fetchFramesByCurrentUser().then((data: any[]) => {
      if (data.length > 0) {
        console.log({ frames: data });
        setFrames(data);
        setLoading(false);
      } else {
        router.push("/create-frame");
      }
    });
  }, []);

  // GET THE TOKENS OWNERS
  useEffect(() => {
    if (owners.length < 1 && frames.length > 0) {
      getOwners();
    }
  }, [frames]);

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
        <div className="flex flex-col text-center justify-center text-lg">
          <div className="mt-2 mb-3" role="status">
            <Spinner />
          </div>
          Loading your Memes ...
        </div>
      ) : (
        <div className="flex flex-col w-full p-8 bg-white bg-opacity-70 rounded-[10px] text-black">
          <div className="flex justify-center mt-4">
            <a
              href="/create-frame"
              className="rounded-full mb-8 px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
            >
              Create another Meme
            </a>
          </div>
          <div className="flex flex-col">
            <div className="flex">Previous Memes ({frames?.length || 0})</div>
            <div className="flex mt-4 mb-12 flex-col">
              {frames.map((frame) => (
                <div className="flex md:flex-col" key={frame.id}>
                  <div className="flex items-start flex-col md:flex-row md:items-center">
                    <div
                      className="flex justify-start cursor-pointer mt-4 w-10/12 sm:w-2/4 "
                      onClick={() => router.push(`/share/${frame.id}`)}
                    >
                      {frame?.nftImgUrl && (
                        <img
                          src={frame?.nftImgUrl || ""}
                          alt="Uploaded meme"
                          className="object-contain"
                        />
                      )}
                    </div>

                    <div
                      className="flex mt-2 md:mt-0 md:ml-6 justify-start w-full text-xl text-purple-500 cursor-pointer hover:text-purple-900 hover:text-decoration-1"
                      onClick={() => router.push(`/share/${frame.id}`)}
                    >
                      {frame.name}
                    </div>
                    <div className="flex justify-start w-full items-center">
                      {loadingOwners ? (
                        <div className="text-xs mr-1">Loading ... </div>
                      ) : (
                        owners[frame.nftTokenAddress]?.length || 0
                      )}{" "}
                      Mints
                    </div>
                  </div>
                  <div className="mt-4 hidden sm:flex w-full">
                    <div
                      className="flex items-center text-purple-500 w-full cursor-pointer"
                      onClick={() => handleCopyClick(frame?.slug)}
                    >
                      {frameUrl + frame?.slug}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-copy ml-2"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="line mb-5 mt-6 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
