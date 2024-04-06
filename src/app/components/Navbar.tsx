"use client";
import React, { useEffect, useState } from "react";
import { Auth } from "@/utils/cookie-auth";

const Navbar = () => {
  const [userSession, setUserSession] = useState(false);

  const handleSignout = () => {
    Auth.removeUser();
    window.location.reload();
  };

  useEffect(() => {
    if (Auth.getUser.userFid && !userSession) {
      setUserSession(true);
    }
  }, [userSession]);

  return (
    <nav className="flex">
      <div className="flex justify-between font-monteserrat text-lg  w-100 space-x-4">
        <img src="https://docs.liquality.io/img/logo_dark.svg" width="100%" />
        <button className="">Log in</button>
      </div>

      {userSession ? (
        <div className="flex items-center">
          <button onClick={handleSignout}>
            Sign Out FID: #{Auth.getUser.userFid}
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
