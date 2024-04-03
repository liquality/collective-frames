import { FrameWithZoraUrl } from "@/types";
import { writeCast } from "@/utils/neynar";
import React, { FormEvent, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  frameData: FrameWithZoraUrl;
  onClose: () => void;
}

const CopyFrameModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose, frameData } = props;
  const [castText, setCastText] = useState<string>("");

  if (!isOpen) return null;
  const frameUrl = "http://localhost:3000/frames/";

  const handleWriteCastClick = () => {
    writeCast(castText);
    onClose();
  };

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

  const handleCastTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setCastText(e.currentTarget.value || "");
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
          Share with your friends on Warpcast
        </h2>
        {/* QUESTION: Should the link refrence the frame.id or frame.slug?  */}
        <div className="flex flex-1">
          <div className="flex flex-col mt-8  w-full">
            <textarea
              onInput={handleCastTextChange}
              value={castText}
              disabled={castText.length > 255}
              placeholder="Enter cast text..."
              className="description mb-3 p-2 text-xs h-50 border border-purple-500 focus:outline-none focus:ring-0"
            ></textarea>
            <div className="text-gray-400 flex justify-end">
              <b>{castText.length}</b>/255
            </div>
          </div>
        </div>{" "}
        <div className="flex items-center justify-center mt-12">
          <br></br>
          <button
            disabled={!castText.length}
            onClick={handleWriteCastClick}
            style={{ width: 300 }}
            className="rounded-full px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0 mb-3"
          >
            Cast
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyFrameModal;
