import React, { ReactNode, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if(isOpen) {
    return (
      <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black bg-opacity-50 z-50">
        <div className="relative bg-white border border-black rounded-lg p-8">
          <button
            className="absolute top-2 right-2 text-black hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            X
          </button>
          {children}
        </div>
      </div>
    );
  
  }
  return null;
};

export default Modal;
