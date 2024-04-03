import { FrameWithZoraUrl } from "@/types";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  frameData: FrameWithZoraUrl;
  onClose: () => void;
}

const CopyFrameModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose, frameData } = props;
  if (!isOpen) return null;
  const frameUrl = "http://localhost:3000/frames/";

  const handleCopyClick = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        //"Text copied to clipboard: ", text);
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 z-50">
      <div className="relative bg-white border border-black rounded-lg p-8">
        <button
          className="absolute top-2 right-2 text-black hover:text-gray-500 focus:outline-none"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Use this link for others to promote your meme & mint on Farcaster{" "}
        </h2>
        {/* QUESTION: Should the link refrence the frame.id or frame.slug?  */}
        <div className="text-center">{frameUrl + frameData?.frame?.slug}</div>
        <div className="flex items-center justify-center mt-12">
          <br></br>
          <button
            onClick={() => handleCopyClick(frameUrl + frameData?.frame?.slug)}
            style={{ width: 300 }}
            className="rounded-full px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0 mb-3"
          >
            Copy Link
          </button>
          <a
            target="_blank"
            href={frameData.zoraUrl}
            style={{ width: 300 }}
            className="rounded-full px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
          >
            Check out your meme on Zora.co
          </a>
        </div>
      </div>
    </div>
  );
};

export default CopyFrameModal;
