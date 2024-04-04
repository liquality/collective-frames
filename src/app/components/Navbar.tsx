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
    <nav className="flex items-center justify-between">
      <div className="flex items-center space-x-4 font-mono text-lg lg:flex">
        Liquality Nft Meme Generator
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
