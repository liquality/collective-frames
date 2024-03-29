"use client";
import React, { useState } from "react";

export default function UploadForm() {
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen p-24 flex-col">
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
            src={selectedImage as string}
            alt="Uploaded meme"
            className="mt-8 max-w-md w-30 h-30 object-cover"
          />
        ) : (
          <div className="w-20 h-20 flex items-center justify-center container-border ">
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
            className="p-2 text-xs w-300 h-50 border border-purple-500 focus:outline-none focus:ring-0"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
