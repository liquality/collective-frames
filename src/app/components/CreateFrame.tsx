/* eslint-disable @next/next/no-img-element */
"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./CreateFrame.css";
import { CollectiveItem, FrameWithZoraUrl, TokenInfo } from "@/types";
import DragNdropFile from "./DragNdropFile";
import { Auth } from "@/utils/cookie-auth";
import { useRouter } from "next/navigation";
import { erc20TokenData } from "@/constants/erc20-token-data";
import useGetExchangePrice from "@/hooks/useGetExchangePrice";
import * as imageConversion from "image-conversion";
import { uploadImageToImgBB } from "@/utils/3rd-party-apis";
import {
  ERC1155ABI,
  ETH_CURRENCY_ADDRESS,
  FIXED_PRICE_MINTER_ADDRESS,
} from "@/utils/constants";
import { ethers } from "ethers";
import { convertToEthPrice, getDisplayValue } from "../frontend-helpers";
import useConvertEthToUsd from "@/hooks/useConvertEthToUsd";

export default function CreateFrame() {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [loadingCollectives, setLoadingCollectives] = useState<boolean>(true);
  const [collectives, setCollectives] = useState<CollectiveItem[]>([]);
  const [imageFile, setImagefile] = useState<File>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [collective, setCollective] = useState<number>(0);
  const [erc20Token, setErc20Token] = useState<TokenInfo | null>(null);
  const [price, setPrice] = useState<string>("0.00000");
  const [valueInEth, setValueInEth] = useState<number>(0);
  const { usdtPrice } = useConvertEthToUsd(valueInEth);

  const { exchangeRateInEth } = useGetExchangePrice(erc20Token?.coinGeckoId);

  const selectRef = useRef<HTMLSelectElement>(null);

  let isErc20 = erc20Token?.contractAddress !== ETH_CURRENCY_ADDRESS;

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
      if (selectRef.current) {
        selectRef.current.value = "";
        setValueInEth(0);
      }
      if (option > 0) {
        setCollective(option);
      }
    } else {
      setCollective(0);
    }
  };

  const filteredPaymentList = useMemo(() => {
    if (collective && collectives && erc20TokenData) {
      const foundCollective = collectives.find((c) => collective === c.id);
      if (foundCollective) {
        const matchedToken = erc20TokenData.find(
          (token) => token.contractAddress === foundCollective.memeTokenContract
        );

        const filteredList = [matchedToken, erc20TokenData[4]].filter(Boolean);

        return filteredList;
      }
    }
    return [];
  }, [collective, collectives, erc20TokenData]);

  const handleNameChange = (e: FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value || "");
  };

  const handlePriceChange = (e: FormEvent<HTMLInputElement>) => {
    let amount = e.currentTarget.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,10})?$/)) {
      setPrice(amount);
    }
  };

  const handleDescriptionChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value || "");
  };

  const handleSetErc20 = (e: ChangeEvent<HTMLSelectElement>) => {
    setErc20Token(JSON.parse(e.target.value));
  };

  const compressAndUploadToBlob = async (file: any) => {
    //1) resize image to max 256kb
    const compressedFile = await imageConversion.compressAccurately(file, 255);
    const hostedCompressedImg = await uploadImageToImgBB(compressedFile);

    return hostedCompressedImg;
  };
  console.log(exchangeRateInEth, "ex proce");

  const handleSave = async () => {
    if (formIsValid && erc20Token && exchangeRateInEth) {
      setIsSaving(true);
      try {
        const formData = new FormData();

        const compressedImage = await compressAndUploadToBlob(imageFile);

        formData.set("name", name);
        formData.set("description", description);
        formData.set("createdBy", Auth.fid);
        formData.set("collectiveId", collective.toString());
        formData.set("price", price);
        formData.set("paymentCurrency", erc20Token.contractAddress);
        formData.set("decimal", erc20Token.decimal.toString());
        formData.set("exchangeRateInEth", exchangeRateInEth.toString());
        formData.set("compressedImage", compressedImage);

        formData.set("imageFile", imageFile!);

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

        if (isErc20) {
          setValueInEth(Number(price) * Number(exchangeRateInEth));
        } else {
          setValueInEth(Number(await convertToEthPrice(price)));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCollectives(false);
      }
    };
    loadData();
  }, [exchangeRateInEth, price]);

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
          Build your meme frame
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
              placeholder="Enter description... (optional)"
              className="description mb-3 p-2 text-xs h-50 border border-purple-500 focus:outline-none focus:ring-0"
            ></textarea>
            <div className="text-gray-400 flex justify-end">
              <b>{description.length}</b>/255
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col mt-6 md:flex-1">
            <label className="flex  my-2 text-black">
              Mint Price in{" "}
              {erc20Token ? erc20Token?.coinGeckoId.toUpperCase() : "ETH"}
            </label>
            <div className="text-xs mb-2 flex flex-col">
              {getDisplayValue(valueInEth.toString())} ETH{" "}
              {!isErc20 ? (
                <p className="text-xxs">(includes zora mint fee)</p>
              ) : null}
            </div>

            <div className="text-xs mb-2 flex flex-col">
              ~ ${getDisplayValue(usdtPrice.toString())}
            </div>

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
              Which community are you playing for (revenue is split 50/50 with
              community)?
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
            ref={selectRef}
            className="p-2 border border-purple-500 focus:outline-none focus:ring-0"
            id="tokens"
            onChange={handleSetErc20}
          >
            <option value="">Payment token</option>
            {filteredPaymentList.map((token, index) => (
              <option key={index} value={JSON.stringify(token)}>
                {token?.ticker}
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
          className="rounded-full px-1 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
        >
          {isSaving ? "Creating meme frame..." : "Create meme frame"}
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-6 mb-6 text-sm mt-2">
        This may take up to 10 seconds <br></br>
        {isSaving ? (
          <div className="mt-2 mb-3" role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        ) : null}
        {isSaving ? "Creating meme frame..." : null}
      </div>
    </div>
  );
}
