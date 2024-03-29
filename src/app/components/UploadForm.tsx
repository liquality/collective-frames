"use client";
import React, { useState } from "react";
import Modal from "./CopyModal";

export default function UploadForm() {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="flex min-h-screen p-24 flex-col ">
      <div className="flex mb-5  font-mono text-sm">
        <label htmlFor="image-upload" className="cursor-pointer">
          <button className="border border-purple-500 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-0 hover:bg-white hover:border-purple-500">
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            Upload your meme
          </button>
        </label>
      </div>
      <div className="flex flex-row">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Uploaded meme"
            className="mt-8 max-w-md w-30 h-30 object-cover container-border"
          />
        ) : (
          <div className="flex items-center justify-center container-border ">
            Upload image
          </div>
        )}
        <div className="ml-3 flex flex-col">
          <input
            type="text"
            className="p-2 mb-3 text-xs w-300 h-50 border border-purple-500 focus:outline-none focus:ring-0"
            placeholder="Enter name..."
          />
          <textarea
            placeholder="Enter description..."
            className="description p-2 text-xs w-300 h-50 border border-purple-500 focus:outline-none focus:ring-0"
          ></textarea>
        </div>
      </div>
      <select
        style={{ width: 390 }}
        value={selectedOption}
        onChange={handleOptionChange}
        className="mt-12 mb-12 p-2 text-xs border border-purple-500 focus:outline-none focus:ring-0"
      >
        <option value="">Select community...</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <div className="flex items-center justify-center mt-12">
        <br></br>
        <button
          onClick={handleModalToggle}
          style={{ width: 300 }}
          className="rounded-full px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
        >
          Save my meme
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleModalToggle}></Modal>
    </div>
  );
}
