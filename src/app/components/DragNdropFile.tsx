/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, DragEvent, useEffect, useState } from "react";
import "./DragNdropFile.css";
import { MdAdd } from "react-icons/md";
import Resizer from "react-image-file-resizer";

export interface DragNdropFileProps {
  onFileSelected: (file?: File) => void;
  file?: File;
}
const DragNdropFile = ({ onFileSelected, file }: DragNdropFileProps) => {
  const [imageContent, setImageContent] = useState<string>();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const _file = e.target.files?.[0];
    console.log(_file, "_file what is??");

    if (_file) {
      //Resize the image before sending to server
      const resizedFile = await resizeFile(_file);
      console.log(resizedFile, "resized file what is??");

      if (resizedFile) {
        onFileSelected(resizedFile);
      } else {
        if (file) {
          onFileSelected();
        }
        console.error("not allowed file size", file?.size);
      }
    }
  };

  const resizeFile = (file: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "PNG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    onFileSelected(event.dataTransfer.files?.[0]);
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageContent(reader.result as string);
      };
      reader.onerror = (e) => {
        setImageContent("");
        console.log(e, "Error reading image file");
      };
      reader.readAsDataURL(file);
    } else {
      setImageContent("");
    }
  }, [file]);

  return (
    <label
      htmlFor="browse"
      onDrop={handleDrop}
      onDragOver={(event) => event.preventDefault()}
      className="document-uploader border-dashed flex flex-col items-center justify-center border border-purple-500 px-4 py-2 bg-white focus:outline-none focus:ring-0 hover:bg-white hover:border-double cursor-pointer"
    >
      <input
        type="file"
        hidden
        id="browse"
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png"
        multiple={false}
        max-size="2000"
        required
      />
      {imageContent ? (
        <img
          src={imageContent}
          alt="Uploaded meme"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center p-10">
          <MdAdd className="text-3xl text-purple-500" />
          <div className="text-lg text-gray-500">Upload Picture</div>
        </div>
      )}
    </label>
  );
};

export default DragNdropFile;
