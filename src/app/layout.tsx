"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthKitProvider } from "@farcaster/auth-kit";
import OurVision from "./components/OurVision";
import Footer from "./components/Footer";
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
          <main className="flex flex-col relative">
            <div className="px-5 py-2 ">
              <Navbar />

              <div className="mt-12">
                {" "}
                <h2
                  className="text-center font-bold text-7xl leading-normal tracking-tight uppercase mb-3"
                  style={{ fontSize: 30, lineHeight: 1 }}
                >
                  Meme NFT generator is here
                </h2>
                <h4 className="text-center font-bold text-xl leading-normal tracking-tight">
                  share to mint & earn
                </h4>
                <p className="mt-3 text-center mb-5">
                  Upload your meme to create a custom mint frame for sharing.
                  Each time your meme is minted, your chosen pool benefits.
                </p>
              </div>
              <div className="flex mt-8 justify-center items-center">
                {children}
              </div>
              <OurVision />
            </div>
          </main>

          <ToastContainer />
        </AuthKitProvider>
        <Footer />
      </body>
    </html>
  );
}
