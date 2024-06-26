/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  SaleStrategy,
  SaleStrategyInterface,
} from "../../../contracts/minters/SaleStrategy";

const _abi = [
  {
    inputs: [],
    name: "contractName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractVersion",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ethValueSent",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "minterArguments",
        type: "bytes",
      },
    ],
    name: "requestMint",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "enum ICreatorCommands.CreatorActions",
                name: "method",
                type: "uint8",
              },
              {
                internalType: "bytes",
                name: "args",
                type: "bytes",
              },
            ],
            internalType: "struct ICreatorCommands.Command[]",
            name: "commands",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "at",
            type: "uint256",
          },
        ],
        internalType: "struct ICreatorCommands.CommandSet",
        name: "commands",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "resetSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

export class SaleStrategy__factory {
  static readonly abi = _abi;
  static createInterface(): SaleStrategyInterface {
    return new Interface(_abi) as SaleStrategyInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SaleStrategy {
    return new Contract(address, _abi, runner) as unknown as SaleStrategy;
  }
}
