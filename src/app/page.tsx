import Image from "next/image";
import UploadForm from "./components/UploadForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      <div className=" w-full items-center justify-between font-mono ">
        <h2 style={{ fontSize: 30, lineHeight: 1 }}>
          Meme NFT generator is here - share to mint & earn
        </h2>
        <p className="mt-3">
          Upload your meme to generate a mint frame that you can share. Every
          mint of your meme will benefit your pool.
        </p>
        <UploadForm />
      </div>
    </main>
  );
}
