/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Modal from "./CopyModal";
import "./UploadForm.css";
import { CollectiveItem } from "@/types";

export default function UploadForm() {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loadingCollectives, setLoadingCollectives] = useState<boolean>(true);
  const [collectives, setCollectives] = useState<CollectiveItem[]>([]);
  const [imageContent, setImageContent] = useState<string>();
  const [imageFile, setImagefile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [collective, setCollective] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImagefile(e.target.files?.[0] || null);
  };

  const handleCollectiveChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const option = Number(e.target.value);
      if (option > 0) {
        setCollective(option);
      }
    } else {
      setCollective(0);
    }
  };

  const handleNameChange = (e: FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value || "");
  };

  const handleDescriptionChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value || "");
  };

  const handleTokenAddressChange = (e: FormEvent<HTMLInputElement>) => {
    setTokenAddress(e.currentTarget.value || "");
  };

  const handleSave = async () => {
    if (formIsValid) {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("tokenAddress", tokenAddress);
        formData.set("imageFile", imageFile!);
        const response = await fetch("/api/frames/create", {
          method: "POST",
          body: formData,
        });

        // Handle response if necessary
        const data = await response.json();
        console.log({ data });
      } catch (error) {
        console.error({ error });
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log("form invalid");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingCollectives(true);
      try {
        const response = await fetch("/api/collectives");
        const data = await response.json();
        setCollectives(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCollectives(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageContent(reader.result as string);
      };
      reader.onerror = (e) => {
        setImageContent("");
        console.log(e, "Error reading image file");
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const formIsValid = useMemo(() => {
    if (
      imageFile &&
      collective &&
      collective > 0 &&
      name &&
      name.length > 4 &&
      tokenAddress &&
      tokenAddress.length > 4
    ) {
      return true;
    }
    return false;
  }, [imageFile, collective, name, tokenAddress]);

  return (
    <div className="flex flex-col min-h-screen p-24">
      <div className="flex w-full">
        <div className="flex flex-col w-full">
          <div className="flex mb-5 font-mono text-sm">
            <label className="ml-3 border border-purple-500 rounded-full px-4 py-2 bg-white focus:outline-none focus:ring-0 hover:bg-white hover:border-purple-500 cursor-pointer">
              Upload your meme
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-row">
            <div className="ml-3 flex flex-col w-full">
              <input
                type="text"
                onInput={handleNameChange}
                value={name}
                className="p-2 mb-3 text-xs h-50 border border-purple-500 focus:outline-none focus:ring-0"
                placeholder="Enter name..."
              />
              <textarea
                onInput={handleDescriptionChange}
                value={description}
                placeholder="Enter description..."
                className="description p-2 text-xs h-50 border border-purple-500 focus:outline-none focus:ring-0"
              ></textarea>
              <input
                type="text"
                onInput={handleTokenAddressChange}
                value={tokenAddress}
                className="p-2 mb-3 text-xs h-50 border border-purple-500 focus:outline-none focus:ring-0"
                placeholder="Enter the token address"
              />
            </div>
          </div>
          <select
            value={collective}
            onChange={handleCollectiveChange}
            className="ml-3 w-full mt-12 mb-12 p-2 text-xs border border-purple-500 focus:outline-none focus:ring-0"
          >
            <option value="">
              {loadingCollectives ? "Loading..." : "Select community..."}
            </option>
            {collectives.map((collective: CollectiveItem) => (
              <option key={collective.id} value={collective.id}>
                {collective.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center container-border">
            {imageContent ? (
              <img
                src={imageContent}
                alt="Uploaded meme"
                className="max-w-md w-full h-full object-cover container-border"
              />
            ) : (
              "Upload image"
            )}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center mt-12">
        <button
          onClick={handleSave}
          style={{ width: 300 }}
          disabled={!formIsValid}
          className="rounded-full px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
        >
          {isSaving ? "Saving..." : "Save my meme"}
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleModalToggle}></Modal>
    </div>
  );
}
