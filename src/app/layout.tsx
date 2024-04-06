import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AppProvider } from "@/context/AppContext";
import OurVision from "./components/OurVision";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collective Frames",
  description: "Collective Frames app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <main className="flex flex-col px-5 py-2 ">
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
                Upload your meme to create a custom mint frame for sharing. Each
                time your meme is minted, your chosen pool benefits.
              </p>
            </div>
            <div className="flex mt-8">{children}</div>
            <OurVision />
          </main>
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
