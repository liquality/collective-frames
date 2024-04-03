"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useContext,
  createContext,
  useMemo,
  useState,
  FC,
  ReactNode,
} from "react";
import { toast } from "react-toastify";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Auth } from "@/utils/cookie-auth";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  children: ReactNode;
}

interface AppContextInterface {
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
