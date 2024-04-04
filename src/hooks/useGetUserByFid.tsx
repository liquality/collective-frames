import { findUserByFid } from "@/utils/user";
import { useState, useEffect } from "react";
import { useProfile } from '@farcaster/auth-kit';

export function useGetUserById() {
  const {
    isAuthenticated,
    profile: { fid },
  } = useProfile();

  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated && fid && !user) {
          setLoading(true);
          const _user = await findUserByFid(fid!);
          setUser(_user);
          setLoading(false);
        }
      } catch (error) {
        console.log(error, "Error fetching my groups");
      }
    };
    fetchData();
  }, [user, isAuthenticated, fid]);

  return { user, loading, setUser };
}

export default useGetUserById;
