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
        <div className="flex flex-col text-center justify-center text-lg">
          <div className="mt-2 mb-3" role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          Loading your Memes ...
        </div>
      ) : (
        <div className="flex flex-col p-8 bg-white bg-opacity-70 rounded-[10px] text-black">
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
                <div className="flex justify-start flex-col" key={frame.id}>
                  <div className="flex items-center">
                    <div
                      className="flex cursor-pointer mt-4"
                      onClick={() => router.push(`/share/${frame.id}`)}
                    >
                      {frame?.nftImgUrl && (
                        <img
                          src={frame?.nftImgUrl || ""}
                          alt="Uploaded meme"
                          className="w-10/12 sm:w-2/4 object-contain"
                        />
                      )}
                    </div>
                    <div
                      className="flex text-purple-500 cursor-pointer hover:text-purple-900 hover:text-decoration-1"
                      onClick={() => router.push(`/share/${frame.id}`)}
                    >
                      {frame.name}
                    </div>
                  </div>
                  <div className="mt-4 ml-2 hidden sm:flex">
                    <a
                      href="#"
                      className="text-purple-500"
                      onClick={() => handleCopyClick(frame?.slug)}
                    >
                      {frameUrl + frame?.slug}{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-copy"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="line mb-5 mt-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
