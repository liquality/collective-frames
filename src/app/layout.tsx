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
            <div className="flex mt-8">{children}</div>
            <OurVision />
          </main>
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
