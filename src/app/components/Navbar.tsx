"use client";
import { ScreenState, useApp } from "@/context/AppContext";
import React from "react";
import useLocalStorage from "@/hooks/use-local-storage-state";
import { UserInfo } from "@/types";

const Navbar = () => {
  const { screen } = useApp();
  const [_, _1, removeItem] = useLocalStorage<UserInfo>("user");

  const handleSignout = () => {
    removeItem();
    window.location.reload();
  };
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center space-x-4 font-mono text-lg lg:flex">
        Liquality Nft Meme Generator
      </div>
      {screen !== ScreenState.Signin && (
        <div className="flex items-center">
          <button onClick={handleSignout}>Sign Out</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
