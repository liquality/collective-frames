import UploadForm from "./components/UploadForm";

export default function Home() {
  return (
    <div className="w-full items-center font-mono ">
      <h2 style={{ fontSize: 30, lineHeight: 1 }}>
        Meme NFT generator is here - share to mint & earn
      </h2>
      <p className="mt-3">
        Upload your meme to create a custom a mint frame for sharing. Each time
        your meme is minted, your chosen pool benefits.
      </p>
      <UploadForm />
      <div className="flex items-center justify-center mt-12">
        <a
          style={{ minWidth: 320 }}
          className="rounded-full px-4 py-2 bg-white disabled:opacity-75 text-purple-500 focus:outline-none focus:ring-0"
        >
          Follow Liquality on Farcaster
        </a>
      </div>
    </div>
  );
}
