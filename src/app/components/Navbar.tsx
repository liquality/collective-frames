"use client";
import React from "react";
import { Auth } from "@/utils/cookie-auth";
import { useSignIn } from "@farcaster/auth-kit";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  
  const {
    signOut
  } = useSignIn({
  });
  
  const handleSignout = () => {
    signOut();
    Auth.removeUser();
    window.location.href = "";
  };

  return (
    <div className="flex items-center justify-between">
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
    </div>
  );
};

export default Navbar;
