"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Auth } from "@/utils/cookie-auth";
import { useRouter } from "next/navigation";
import FarcasterSigninButton from "./FarcasterSigninButton";
import { AuthClientError, StatusAPIResponse } from "@farcaster/auth-kit";
import ApiService from "@/utils/api-service";
import { toast } from "react-toastify";

const FarcasterLogin = () => {
  const route = useRouter();

  const onSignInSuccess = async (res: StatusAPIResponse) => {
    console.log("onSignInSuccess", { data: res });
    try {
      //This route gets the user by fid and returns user: if it doesnt exist
      //it creates a new user with that fid and returns it
      const data = await ApiService.authenticateUser(res);
      if (data) {
        Auth.setUser(res.fid);
        route.push("/dashboard");
      } else {
        throw Error("Could not get or create user in server");
      }
    } catch (error) {
      console.log(error, "what is error?");
      toast(
        "Login failed. Refresh the page and try again. Or contact support@liquality.io for manual set-up."
      );
    }
  };

  const onError = (error?: AuthClientError) => {
    console.log(error, "what is error?");
    if (error) {
      toast(
        "Login failed. Refresh the page and try again. Or contact support@liquality.io for manual set-up."
      );
    }
  };

  return (
    <div className="flex justify-center">
      <FarcasterSigninButton onSuccess={onSignInSuccess} onError={onError} />
    </div>
  );
};

export default FarcasterLogin;
