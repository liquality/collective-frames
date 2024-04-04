"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthKitProvider } from "@farcaster/auth-kit";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthKitProvider>
          <main className="flex flex-col justify-between px-12 py-2">
            <Navbar />
            <div className="flex mt-8">
              <div className="w-full items-center font-mono">
                <h2 style={{ fontSize: 30, lineHeight: 1 }}>
                  Meme NFT generator is here - share to mint & earn
                </h2>
                <p className="mt-3 font-mono">
                  Upload your meme to create a custom a mint frame for sharing.
                  Each time your meme is minted, your chosen pool benefits.
                </p>

                {children}

                <div className="flex items-center justify-center mt-24">
                  <a
                    href="https://warpcast.com/liquality"
                    target="_blank"
                    style={{ minWidth: 320 }}
                    className="rounded-full text-center border border-purple-500 px-4 py-2 bg-white disabled:opacity-75 text-purple-500 focus:outline-none focus:ring-0"
                  >
                    Follow Liquality on Farcaster
                  </a>
                </div>
                <div className="flex flex-col items-center justify-center mt-12">
                  <h2 className="uppercase text-2xl">Our Vision</h2>
                  <p className="mt-6">
                    We champion collective action as a cornerstone of Web3 by
                    introducing our tech to the Warpcast community, home to
                    innovators. Your participation earns rewards, and we value
                    your feedback at{" "}
                    <a
                      className="text-purple-500"
                      href="mailto:info@liquality.io"
                    >
                      info@liquality.io
                    </a>
                    .
                  </p>
                </div>
                <div className="flex items-center mt-12">
                  <div className="flex flex-col mx-12">
                    <svg
                      width="188"
                      height="205"
                      viewBox="0 0 188 205"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="1.5"
                        width="186"
                        height="202.16"
                        fill="white"
                        stroke="black"
                      />
                      <line
                        y1="-0.5"
                        x2="276.122"
                        y2="-0.5"
                        transform="matrix(0.677238 0.735764 -0.677238 0.735764 0 1)"
                        stroke="black"
                      />
                      <line
                        y1="-0.5"
                        x2="276.122"
                        y2="-0.5"
                        transform="matrix(-0.677238 0.735764 -0.677238 -0.735764 187 1)"
                        stroke="black"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex text-xl">
                      Built with the Liquality Collective SDK
                    </div>
                    <div className="flex flex-col">
                      <div>
                        Liquality provides open-source infrastructure legos that
                        make web3 easy for users and developers while
                        maintaining the values of Web3.
                      </div>
                      <div className="flex mt-12">
                        [Liquality socials & SDK documentation]
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-24 bottom-0">
                  <div className="flex text-sm">
                    Collective SDK by Liquality 2024.{" "}
                  </div>
                  <div className="flex mt-2">
                    <a href="#" className="text-sm text-purple-500">
                      Terms of Use
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <ToastContainer />
        </AuthKitProvider>
      </body>
    </html>
  );
}
