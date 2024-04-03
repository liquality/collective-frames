"use client";
import React from "react";
import { UserInfo } from "@/types";
import { Auth } from "@/utils/cookie-auth";
import useGetUserById from "@/hooks/useGetUserByFid";

const Navbar = () => {
  //const { user, loading } = useGetUserById();
  const handleSignout = () => {
    Auth.removeUser();
    window.location.reload();
  };

  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center space-x-4 font-mono text-lg lg:flex">
        Liquality Nft Meme Generator
      </div>
      {Auth.getUser.userFid ? (
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
