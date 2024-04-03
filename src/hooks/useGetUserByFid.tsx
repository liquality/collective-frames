import { Auth } from "@/utils/cookie-auth";
import { findUserByFid } from "@/utils/user";
import { useState, useEffect } from "react";

export function useGetUserById() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (Auth.getUser.userFid && !user) {
          setLoading(true);
          const _user = await findUserByFid(Auth.getUser.userFid);

          console.log(_user, "heee, wats user?, heej");
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

export default useGetUserById;
