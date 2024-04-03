"use client";
import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import useLocalStorage from "@/hooks/use-local-storage-state";

const Login = () => {
  const { setSignerUuid, setFid } = useApp();
  const [_, setUser] = useLocalStorage("user");
  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  const loginUrl =
    process.env.NEXT_PUBLIC_NEYNAR_LOGIN_URL || "https://app.neynar.com/login";

  if (!clientId) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  }

  useEffect(() => {
    // Identify or create the script element
    let script = document.getElementById(
      "siwn-script"
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = "siwn-script";
      document.body.appendChild(script);
    }

    // Set attributes and source of the script
    script.src = "https://neynarxyz.github.io/siwn/raw/1.2.0/index.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      // Remove the script from the body
      if (script) {
        document.body.removeChild(script);
      }

      // Remove the button if it exists
      let button = document.getElementById("siwn-button");
      if (button && button.parentElement) {
        button.parentElement.removeChild(button);
      }
    };
  }, []);

  useEffect(() => {
    window.onSignInSuccess = (data) => {
      console.log('onSignInSuccess', {data})
      setUser({
        signerUuid: data.signer_uuid,
        fid: data.fid,
      });
      setSignerUuid(data.signer_uuid);
      setFid(data.fid);
    };

    return () => {
      delete window.onSignInSuccess; // Clean up the global callback
    };
  }, []);
  return (
    <div
        className="neynar_signin"
        data-client_id={clientId}
        data-neynar_login_url={loginUrl}
        data-success-callback="onSignInSuccess"
        data-theme="dark"
      ></div>
  );
};

export default Login;
