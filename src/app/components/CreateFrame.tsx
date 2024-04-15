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
import { CollectiveItem, FrameWithZoraUrl, TokenInfo } from "@/types";
import DragNdropFile from "./DragNdropFile";
import { Auth } from "@/utils/cookie-auth";
import { useRouter } from "next/navigation";
import { erc20TokenData } from "@/constants/erc20-token-data";
import useGetExchangePrice from "@/hooks/useGetExchangePrice";

export default function CreateFrame() {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [loadingCollectives, setLoadingCollectives] = useState<boolean>(true);
  const [collectives, setCollectives] = useState<CollectiveItem[]>([]);
  const [imageFile, setImagefile] = useState<File>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [collective, setCollective] = useState<number>(0);
  const [erc20Token, setErc20Token] = useState<TokenInfo | null>(null);
  const [price, setPrice] = useState<string>("0.000");
  const { priceInCurrency, loading: loadingPriceCurrency } =
    useGetExchangePrice(erc20Token?.coinGeckoId);

  console.log(priceInCurrency, "wats price?");
  const [frameData, setFrameData] = useState<FrameWithZoraUrl | null>(null);
  const router = useRouter();

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

  const handlePriceChange = (e: FormEvent<HTMLInputElement>) => {
    let amount = e.currentTarget.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,4})?$/)) {
      setPrice(amount);
    }
  };

  const handleDescriptionChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value || "");
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setErc20Token(JSON.parse(e.target.value));
  };

  const handleSave = async () => {
    if (formIsValid) {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.set("name", name);
        formData.set("description", description);
        formData.set("imageFile", imageFile!);
        formData.set("createdBy", Auth.fid);
        formData.set("collectiveId", collective.toString());
        formData.set("price", price);
        formData.set("paymentCurrency", erc20Token.contractAddress);
        formData.set("decimal", erc20Token.decimal);

        const response = await fetch("/api/create", {
          method: "POST",
          body: formData,
        });

        const _frameData = await response.json();
        console.log("Frame data from POST req:", _frameData);
        setFrameData(_frameData);
        router.push(`share/${_frameData.frame.id}`);
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
    if (
      imageFile &&
      collective &&
      collective > 0 &&
      name &&
      erc20Token &&
      price
    ) {
      return true;
    }
    return false;
  }, [imageFile, collective, name, erc20Token, price]);

  return (
    <div className="flex flex-col mt-8 px-8 bg-white bg-opacity-70 p-3 rounded-[10px] text-black">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-1 items-center">
          <div className="text-slate-900 text-3xl font-bold leading-loose mr-4">
            1
          </div>
          Choose your meme
        </div>
        <div className="flex flex-1 text-gray-400 items-center hidden md:flex">
          <div className="text-3xl font-bold leading-loose mr-4">2</div>
          Get link to share
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col md:flex-1">
            <div className="flex flex-col">
              <div className="flex mb-2 text-black">Your meme</div>
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
          </div>
          <div className="flex flex-col mt-8 md:flex-1 md:ml-12">
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

        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col mt-6 md:flex-1">
            <label className="flex flex-1 my-2 text-black">
              Mint Price in{" "}
              {erc20Token ? erc20Token?.coinGeckoId.toUpperCase() : "ETH"}
            </label>

            <input
              type="text"
              onChange={handlePriceChange}
              value={price}
              className="p-2 h-50 border border-purple-500 focus:outline-none focus:ring-0"
              placeholder="Mint Price*"
            />
          </div>

          <div className="flex flex-col mt-6 md:flex-1 md:ml-12">
            <div className="flex mb-2 text-black">
              Who shares your mint profits?
            </div>
            <select
              value={collective}
              onChange={handleCollectiveChange}
              className="p-2 border border-purple-500 focus:outline-none focus:ring-0"
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
        </div>
        <div className="flex flex-col mt-6 md:w-1/2 md:pr-6">
          <select
            className="p-2 border border-purple-500 focus:outline-none focus:ring-0"
            id="tokens"
            onChange={handleChange}
          >
            <option value="">Select ERC20 or ETH payment</option>
            {erc20TokenData.map((token, index) => (
              <option key={index} value={JSON.stringify(token)}>
                {token.ticker}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-12 mb-6">
        <button
          onClick={handleSave}
          style={{ width: 300 }}
          disabled={!formIsValid}
          className="rounded-full px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
        >
          {isSaving ? "Saving..." : "Save my Meme"}
        </button>
      </div>
    </div>
  );
}
