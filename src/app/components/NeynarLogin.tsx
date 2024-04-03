"use client";
import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Auth } from "@/utils/cookie-auth";
import axios from "axios";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Login = () => {
  const route = useRouter();

  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
  const loginUrl = "https://app.neynar.com/login";

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
    (window.onSignInSuccess = async (neynarData) => {
      console.log("onSignInSuccess", { data: neynarData });

      //This route gets the user by fid, if it doesnt exist
      //it creates a new user with that fid
      try {
        const { data } = await axios.post(`/api/user/`, neynarData);
        console.log(data, "wat is data");
        if (data) {
          Auth.setUser(neynarData.fid, neynarData.signer_uuid);
          route.push("/home");
        } else {
          throw Error("Could not get or create user in server");
        }
      } catch (error) {
        toast("Something went wrong. Contact support");
      }

      return () => {
        delete window.onSignInSuccess; // Clean up the global callback
      };
    }),
      [];
  });
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
