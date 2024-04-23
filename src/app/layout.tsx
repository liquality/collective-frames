"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthKitProvider } from "@farcaster/auth-kit";
import OurVision from "./components/OurVision";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import HowItWorks from "./components/HowItWorks";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <title>Liquality Meme NFT Generator</title>
        <meta
          name="description"
          content="Create and share a meme mint frame for your memecoin community. Every meme minted benefits your chosen community."
        />
        <meta property="og:title" content="Liquality Meme NFT Generator" />
        <meta
          property="og:description"
          content="Create and share a meme mint frame for your memecoin community. Every meme minted benefits your chosen community."
        />
        <meta property="og:image" content="/main-bg.png" />
        <link
          href="/favicon-32x32.png"
          rel="shortcut icon"
          type="image/x-icon"
        ></link>
      </head>
      <body className={inter.className}>
        <AuthKitProvider>
          <main className="flex flex-col px-12 py-2">
            <Navbar />
            <div className="mt-12">
              <h2
                className="text-center font-bold text-7xl leading-normal tracking-tight uppercase mb-3"
                style={{ fontSize: 30, lineHeight: 1 }}
              >
                MEME AMPLIFIER MACHINE
              </h2>
              <h4 className="text-center font-bold text-xl leading-normal tracking-tight uppercase">
                Meme. Share. Grow the meme, earn together.
              </h4>
              <p className="mt-3 text-center mb-5">
                Create and share a &quot;meme mint frame&quot; for your memecoin
                community. Every meme minted benefits your chosen community.
              </p>
              <HowItWorks />
            </div>
            <div className="flex mt-8 justify-center items-center">
              {children}
            </div>
            <OurVision />
            
          </main>
          <Footer></Footer>
          <ToastContainer />
        </AuthKitProvider>
      </body>
    </html>
  );
}
