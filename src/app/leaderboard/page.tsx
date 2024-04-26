"use client";

import { getTokensOwners } from "@/utils/3rd-party-apis";
import ApiService from "@/utils/api-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

export default function Leaderboard() {
  const router = useRouter();
  const [framesPerCollective, setFramesPerCollective] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<any[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(true);

  const getOwners = async () => {
    setLoadingOwners(true);
    const tokenAddresses = framesPerCollective.map(
      (item) => item.nft_token_address as string
    );
    const data = await getTokensOwners(tokenAddresses);

    setOwners(data);
    console.log(data, "owners");
    setLoadingOwners(false);
  };

  useEffect(() => {
    setLoading(true);
    ApiService.getFramesPerCollective().then((data: any[]) => {
      if (data.length > 0) {
        console.log(data, "data");
        setFramesPerCollective(data);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (owners.length < 1 && framesPerCollective.length > 0) {
      getOwners();
    }
  }, [framesPerCollective]);

  return (
    <div className="flex flex-col w-full md:w-4/5">
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
          <div className="flex flex-col mt-2">
            <div className="flex items-center">
              <div className="flex w-2/6">Name</div>
              <div className="flex w-1/2">Frames Created</div>
              <div className="flex w-1/6 justify-end">Mints</div>
            </div>
            <div className="flex mt-4 mb-12 flex-col items-center">
              {framesPerCollective.map((frame, index) => (
                <div className="flex w-full items-center" key={index}>
                  <div className="flex w-2/6 text-purple-500 justify-start">
                    {frame.collective_name}
                  </div>
                  <div className="flex w-1/2 text-purple-500 justify-center text-center">
                    {frame.num_frames_created}
                  </div>
                  <div className="flex w-1/6 text-purple-500 justify-center text-center">
                    {loadingOwners ? (
                      <Spinner size="w-3 h-3" />
                    ) : (
                      owners[frame.nft_token_address]?.length || 0
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
