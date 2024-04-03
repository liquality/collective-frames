/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./CreateFrame.css";
import { CollectiveItem, FrameWithZoraUrl } from "@/types";
import DragNdropFile from "./DragNdropFile";

export default function CreateFrame() {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loadingCollectives, setLoadingCollectives] = useState<boolean>(true);
  const [collectives, setCollectives] = useState<CollectiveItem[]>([]);
  const [imageFile, setImagefile] = useState<File>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [collective, setCollective] = useState<number>(0);
  const [frameData, setFrameData] = useState<FrameWithZoraUrl | null>(null);

  const frameUrl = "http://localhost:3001/frames/";

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

  const handleFileChange = (file?: File) => {
    setImagefile(file);
  };

  const handleRemove = () => {
    setImagefile(undefined);
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

  const handleSave = async () => {
    if (formIsValid) {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("imageFile", imageFile!);
        console.log(formData, "what is form data???", typeof formData);
        const response = await fetch("/api/frames", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Frame data from POST req:", data);
        setFrameData(data);
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

  const formIsValid = useMemo(() => {
    if (imageFile && collective && collective > 0 && name) {
      return true;
    }
    return false;
  }, [imageFile, collective, name]);

  return (
    <div className="flex flex-col mt-8">
      <div className="flex w-full">
        <div
          className={
            frameData
              ? "flex flex-1 text-gray-400 items-center"
              : "flex flex-1 items-center"
          }
        >
          <b className="text-lg mr-3">1</b>
          Choose meme & community
        </div>
        <div
          className={
            frameData
              ? "flex flex-1 items-center"
              : "flex flex-1 text-gray-400 items-center"
          }
        >
          <b className="text-lg mr-3">2</b>
          Get link to share
        </div>
      </div>

      {frameData ? (
        <div className="flex w-full mt-5 flex-col">
          <div className="flex justify-center mx-24">
            Share this frame link and encourage others to mint your meme. More
            mints = more hype and profits for you and your community
          </div>
          <div className="flex mt-4 justify-center">
            <img
              src={frameData?.frame.imageUrl || ""}
              alt="Uploaded meme"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex mt-12 justify-center">
            <a
              target="_blank"
              href="https://warpcast.com"
              style={{ width: 300 }}
              className="rounded-full text-center px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
            >
              Share on Warpcast
            </a>
          </div>
          <div className="flex mt-4 justify-center">
            <a
              target="_blank"
              href={frameData?.zoraUrl}
              style={{ width: 300 }}
              className="rounded-full text-center px-4 py-2 bg-purple-500 text-white focus:outline-none focus:ring-0"
            >
              Check out on Zora.co
            </a>
          </div>
          <div className="flex mt-4 justify-center">
            <button
              onClick={() => handleCopyClick(frameUrl + frameData?.frame?.slug)}
              style={{ width: 300 }}
              className="rounded-full px-4 py-2 border border-purple-500 text-purple-500 focus:outline-none focus:ring-0 mb-3"
            >
              Copy Link to share
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex w-full mt-5">
            <div className="flex flex-col flex-1">
              <div className="flex flex-col">
                <div className="flex mb-2">Your meme</div>
                <DragNdropFile
                  onFileSelected={handleFileChange}
                  file={imageFile}
                />
                <div className="flex justify-between">
                  <div className="text-gray-400">Max 5MB (JPG, JPEG, PNG)</div>
                  {imageFile && (
                    <div
                      className="text-purple-500 cursor-pointer"
                      onClick={handleRemove}
                    >
                      Remove
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <input
                  type="text"
                  onInput={handleNameChange}
                  value={name}
                  className="p-2 h-50 border border-purple-500 focus:outline-none focus:ring-0"
                  placeholder="Name your Meme*"
                />
              </div>
              <div className="flex mt-6">
                <div className="flex flex-col w-full">
                  <div className="flex mb-2">Who shares your mint profits?</div>
                  <select
                    value={collective}
                    onChange={handleCollectiveChange}
                    className="w-full p-2 border border-purple-500 focus:outline-none focus:ring-0"
                  >
                    <option value="">
                      {loadingCollectives
                        ? "Loading..."
                        : "Select community..."}
                    </option>
                    {collectives.map((collective: CollectiveItem) => (
                      <option key={collective.id} value={collective.id}>
                        {collective.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-1">
              <div className="flex flex-col mt-8 ml-12 w-full">
                <textarea
                  onInput={handleDescriptionChange}
                  value={description}
                  disabled={description.length > 255}
                  placeholder="Enter description..."
                  className="description mb-3 p-2 text-xs h-50 border border-purple-500 focus:outline-none focus:ring-0"
                ></textarea>
                <div className="text-gray-400 flex justify-end">
                  <b>{description.length}</b>/255
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-12">
            <button
              onClick={handleSave}
              style={{ width: 300 }}
              disabled={!formIsValid}
              className="rounded-full px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
            >
              {isSaving ? "Saving..." : "Save my Meme"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
