/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Auth } from "@/utils/cookie-auth";
import { useSignIn, useProfile } from "@farcaster/auth-kit";

const Navbar = () => {
  const { signOut } = useSignIn({});
  const [userSession, setUserSession] = useState(false);
  const { isAuthenticated, profile } = useProfile();
  const handleSignout = () => {
    signOut();
    Auth.removeUser();
    window.location.href = "/";
  };
  console.log(profile, "profile");
  useEffect(() => {
    if (Auth.fid || isAuthenticated) {
      setUserSession(true);
    }
  }, [isAuthenticated]);

  return (
    <nav className="flex justify-between pt-4">
      <div className="flex justify-between text-lg w-100 space-x-4">
        <a href="/">
          <img
            src="https://docs.liquality.io/img/logo_dark.svg"
            width="100%"
            alt="Logo"
          />
        </a>
      </div>
      {userSession ? (
        <div className="flex items-center">
          <button onClick={handleSignout}>Sign Out FID: #{Auth.fid}</button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
