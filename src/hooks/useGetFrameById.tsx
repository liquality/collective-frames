import { FrameWithZoraUrl } from "@/types";
import { findFrameById } from "@/utils/frame";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export function useGetFrameById() {
  const [frame, setFrame] = useState<FrameWithZoraUrl | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  let { id: frameId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (frameId && !frame) {
          setLoading(true);
          const _user = await findFrameById(Number(frameId));

          setFrame(_user);
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching the frame with id:" + frameId);
      }
    };
    fetchData();
  }, [frame]);

  return { frame, loading, setFrame };
}

export default useGetFrameById;
