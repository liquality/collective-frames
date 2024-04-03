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

  console.log(
    screen,
    "what is scren?",
    screen === ScreenState.Signin,
    screen === "signin"
  );
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center space-x-4 font-mono text-lg lg:flex">
        Liquality Nft Meme Generator
      </div>
      {screen === ScreenState.Signin ? (
        <div className="flex items-center">
          <button onClick={handleSignout}>Sign Out aa</button>
        </div>
      ) : (
        <button>sing in with neynar</button>
      )}
    </nav>
  );
};

export default Navbar;
