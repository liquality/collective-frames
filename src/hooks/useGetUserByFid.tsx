import ApiService from "@/utils/api-service";
import { Auth } from "@/utils/cookie-auth";
import { useState, useEffect } from "react";

export function useGetUserByFid() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Auth.fid && !user) {
          setLoading(true);
          const _user = await ApiService.getUserByFid(Auth.fid);

          setUser(_user);
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching my groups");
      }
    };
    fetchData();
  }, [user]);

  return { user, loading, setUser };
}

export default useGetUserByFid;
