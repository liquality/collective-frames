"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axios, { AxiosError } from "axios";
import { verifyUser } from "@/utils/helpers";
import { toast } from "react-toastify";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v1";
import { Auth } from "@/utils/cookie-auth";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export enum ScreenState {
  Signin = "signin",
  Home = "home",
}

interface Props {
  children: ReactNode;
}

interface AppContextInterface {
  //screen: ScreenState;
  //setScreen: SetState<ScreenState>;
  displayName: string | null;
  setDisplayName: SetState<string | null>;
  pfp: string | null;
  setPfp: SetState<string | null>;
  signerUuid: string | null;
  setSignerUuid: SetState<string | null>;
  fid: string | null;
  setFid: SetState<string | null>;
}

const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider: FC<Props> = ({ children }) => {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [pfp, setPfp] = useState<string | null>(null);
  const [signerUuid, setSignerUuid] = useState<string | null>(null);
  const [fid, setFid] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const route = useRouter();
  let userSession = Auth.getUser.userFid && Auth.getUser.signerUuid;

  const lookupUser = useCallback(async () => {
    if (userSession) {
      try {
        const { data } = await axios.get<{ user: User }>(
          `/api/user/${Auth.getUser.userFid}`
        );
        setDisplayName(data.user.displayName);
        setPfp(data.user.pfp.url);
      } catch (err) {
        const axiosError = err as AxiosError<ErrorRes>;
        toast(axiosError.response?.data.message || "An error occurred", {
          type: "error",
          theme: "dark",
          autoClose: 3000,
          position: "bottom-right",
          pauseOnHover: true,
        });
      }
    }
  }, []);

  useEffect(() => {
    // Read from URL query params if we need to support old flow
    // if (searchParams.get("signer_uuid") && searchParams.get("fid")) {
    //     setSignerUuid(searchParams.get("signer_uuid"));
    //     setFid(searchParams.get("fid"));
    // }

    lookupUser();
  }, [lookupUser]);

  const isUserLoggedIn = useCallback(async () => {
    if (userSession) {
    } else {
      if (signerUuid && fid) {
        const verifiedUser = await verifyUser(signerUuid, fid);
        if (verifiedUser) {
          Auth.setUser(fid, signerUuid);
          route.push("/home");
        } else {
          Auth.removeUser();
        }
      } else {
        route.push("/");
      }
    }
  }, [signerUuid, fid]);

  useEffect(() => {
    isUserLoggedIn();
  }, [isUserLoggedIn]);

  const value: AppContextInterface | null = useMemo(
    () => ({
      displayName,
      setDisplayName,
      pfp,
      setPfp,
      signerUuid,
      setSignerUuid,
      fid,
      setFid,
    }),
    [displayName, pfp, signerUuid, fid]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextInterface => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within AppProvider");
  }
  return context;
};
