import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const frameUrl = "http://localhost:3001/meme/meme_id";

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
        <div className="text-center">{frameUrl}</div>
        <div className="flex items-center justify-center mt-12">
          <br></br>
          <button
            onClick={() => handleCopyClick(frameUrl)}
            style={{ width: 300 }}
            className="rounded-full px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
