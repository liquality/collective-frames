/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Auth } from "@/utils/cookie-auth";
import { useSignIn } from "@farcaster/auth-kit";

const Navbar = () => {
  const { signOut } = useSignIn({});
  const [userSession, setUserSession] = useState(false);

  const handleSignout = () => {
    signOut();
    Auth.removeUser();
    window.location.href = "/";
  };

  useEffect(() => {
    if (Auth.fid && !userSession) {
      setUserSession(true);
    }
  }, [userSession]);

  return (
    <nav className="flex justify-between">
      <div className="flex justify-between text-lg  w-100 space-x-4">
        <img
          src="https://docs.liquality.io/img/logo_dark.svg"
          width="100%"
          alt="Logo"
        />
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
