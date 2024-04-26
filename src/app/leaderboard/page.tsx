"use client";

import { getTokensOwners } from "@/utils/3rd-party-apis";
import ApiService from "@/utils/api-service";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<{
    collectives: any[];
    frames: any[];
  }>({ collectives: [], frames: [] });
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<any>({});
  const [loadingOwners, setLoadingOwners] = useState(true);

  const getOwners = async (frames: any[]) => {
    setLoadingOwners(true);
    const tokenAddresses = frames
      .filter((item) => item.nftTokenAddress)
      .map((item) => item.nftTokenAddress);

    const data = await getTokensOwners(tokenAddresses);
    const _owners = Object.keys(data).reduce((prev: any, curr) => {
      const amount = data[curr].length;
      const frame = frames.find(
        (item) => item.nftTokenAddress === curr
      );
      if(prev[frame?.collectiveName?.toLowerCase()]) {
        const prevAmount = prev[frame?.collectiveName?.toLowerCase()];
        prev[frame?.collectiveName?.toLowerCase()] = prevAmount + amount;
      } else {
        prev[frame?.collectiveName?.toLowerCase()] = amount;
      }
      return prev;
    }, {});
    setOwners(_owners);
    console.log(_owners, "owners");
    setLoadingOwners(false);
  };

  useEffect(() => {
    setLoading(true);
    ApiService.getFramesPerCollective().then((data: any) => {
      setLeaderboard(data);
      setLoading(false);
      getOwners(data.frames);
    });
  }, []);

  return (
    <div className="flex flex-col w-full md:w-3/5">
      {loading ? (
        <div className="flex flex-col text-center justify-center text-lg">
          <div className="mt-2 mb-3" role="status">
            <Spinner />
          </div>
          Loading ...
        </div>
      ) : (
        <div className="flex flex-col p-8 bg-white bg-opacity-70 rounded-[10px] text-black">
          <h2 className="flex justify-center mt-4 text-xl">Leaderboard</h2>
          <div className="flex flex-col mt-2 md:items-center w-full">
            <div className="flex items-center md:w-1/2">
              <div className="flex w-2/6 justify-start">Name</div>
              <div className="flex w-1/2 justify-center">Frames Created</div>
              <div className="flex w-1/6 justify-end">Mints</div>
            </div>
            <div className="flex mt-4 mb-12 flex-col items-center md:w-1/2">
              {leaderboard.collectives?.map((frame, index) => (
                <div className="flex w-full items-center" key={index}>
                  <div className="flex w-2/6 text-purple-500 justify-start">
                    {frame.collective_name}
                  </div>
                  <div className="flex w-1/2 text-purple-500 justify-center">
                    {frame.num_frames_created}
                  </div>
                  <div className="flex w-1/6 text-purple-500 justify-end">
                    {loadingOwners ? (
                      <Spinner size="w-3 h-3" />
                    ) : (
                      owners[frame.collective_name] || 0
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
