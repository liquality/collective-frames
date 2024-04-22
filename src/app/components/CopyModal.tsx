import { FrameWithZoraUrl } from "@/types";
import React, { FormEvent, useState } from "react";
import Modal from "./Modal";

interface ModalProps {
  isOpen: boolean;
  frameData: FrameWithZoraUrl;
  onClose: () => void;
}

const CopyFrameModal: React.FC<ModalProps> = (props) => {
  const { isOpen, onClose, frameData } = props;
  const [castText, setCastText] = useState<string>("");

  if (!isOpen) return null;

  const handleWriteCastClick = () => {
    const text = encodeURIComponent(castText);
    const baseUrl =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      `${window.location.protocol}//${window.location.host}`;
    const frameUrl = `${baseUrl}frames-transaction/${frameData?.frame?.slug}`;
    window.open(
      `https://warpcast.com/~/compose?text=${text}&embeds[]=${frameData.frame.frameImgUrl}&embeds[]=${frameUrl}`
    );
    setCastText("");
    onClose();
  };
  console.log({ frameData });

  const handleCastTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setCastText(e.currentTarget.value || "");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
      <>
        <h2 className="text-xl font-bold mb-4 text-center">
          Share with your friends on Warpcast
        </h2>
        {/* QUESTION: Should the link refrence the frame.id or frame.slug?  */}
        <div className="flex flex-col flex-1">
          <div className="flex flex-col mt-8 ">
            To share your meme you have to be logged into Warpcast.
          </div>
          <div className="flex flex-col mt-8 w-full">
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
            className="rounded-full px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0 mb-3"
          >
            Cast
          </button>
        </div>
      </>
    </Modal>
  );
};

export default CopyFrameModal;
