"use client";
import { Auth } from "@/utils/cookie-auth";
import { SignInButton, StatusAPIResponse } from "@farcaster/auth-kit";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function Home() {
  return (
    <div className="flex flex-col my-48 w-full">
      <div className="flex items-center justify-center">
        <Content />
      </div>
      <div className="flex items-center justify-center mt-5">
        Not on Warpcast yet?
        <a
          href="https://warpcast.com/~/signup"
          className="text-purple-400 mx-2"
          target="_blank"
        >
          Sign up now
        </a>{" "}
        and return with your ID
      </div>
    </div>
  );
}

function Content() {
  const router = useRouter();
  const [error, setError] = useState(false);

  const signOut = () => {
    Auth.removeUser();
    window.location.reload();
  };

  const handleSuccess = useCallback((res: StatusAPIResponse) => {
    if (res && res.fid) {
      Auth.setUser(res.fid, "res.s");
      router.replace("/dashboard")
    }
  }, []);

  return (
    <>
      <div className="sign-btn rounded-full text-center px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0 flex">
        <SignInButton
          onSuccess={handleSuccess}
          onError={() => setError(true)}
          onSignOut={() => signOut()}
        />
      </div>
      {error && <div>Unable to sign in at this time.</div>}
    </>
  );
}
