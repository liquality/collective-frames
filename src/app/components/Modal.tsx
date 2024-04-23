import React, { ReactNode, useState } from "react";
import { MdClose } from "react-icons/md";

interface ModalProps {
  isOpen: boolean;
  showCloseButton: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, showCloseButton = true }) => {
  if (isOpen) {
    return (
      <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 z-50">
        <div className="relative bg-white border border-black rounded-lg p-8">

          {showCloseButton && (
              <button
              className="absolute top-2 right-2 text-black hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <MdClose className="text-2xl" />
            </button>
          )}
          {children}
        </div>
      </div>
    );
  }
  return null;
};

export default Modal;
