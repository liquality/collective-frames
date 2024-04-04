import { FrameWithZoraUrl } from "@/types";
import ApiService from "@/utils/api-service";

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

          const _frame = await ApiService.getFrameById(frameId as string);

          setFrame(_frame);
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching the frame with id:" + frameId);
      }
    };
    fetchData();
  }, [frame, frameId]);

  return { frame, loading, setFrame };
}

export default useGetFrameById;
