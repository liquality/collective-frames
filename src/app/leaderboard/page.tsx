"use client";

import ApiService from "@/utils/api-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const router = useRouter();
  const [framesPerCollective, setFramesPerCollective] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ApiService.getFramesPerCollective().then((data: any[]) => {
      if (data.length > 0) {
        setFramesPerCollective(data);
        setLoading(false);
      }
    });
  }, []);

  return (
    <div className="flex flex-col w-full md:w-4/5">
      <div className="flex flex-col p-8 bg-white bg-opacity-70 rounded-[10px] text-black">
        <h2 className="flex justify-center mt-4 text-xl">Leaderboard</h2>
        <div className="flex flex-col">
          <div className="flex mt-4 mb-12 flex-col items-center">
            name, frames_created, mints
            {framesPerCollective.map((frame, index) => (
              <div className="flex flex-col" key={index}>
                <div className="flex text-purple-500 ">
                  {frame.collective_name} | {frame.num_frames_created} | ?
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
