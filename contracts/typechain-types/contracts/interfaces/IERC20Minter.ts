/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace IERC20Minter {
  export type SalesConfigStruct = {
    saleStart: BigNumberish;
    saleEnd: BigNumberish;
    maxTokensPerAddress: BigNumberish;
    pricePerToken: BigNumberish;
    fundsRecipient: AddressLike;
    currency: AddressLike;
  };

  export type SalesConfigStructOutput = [
    saleStart: bigint,
    saleEnd: bigint,
    maxTokensPerAddress: bigint,
    pricePerToken: bigint,
    fundsRecipient: string,
    currency: string
  ] & {
    saleStart: bigint;
    saleEnd: bigint;
    maxTokensPerAddress: bigint;
    pricePerToken: bigint;
    fundsRecipient: string;
    currency: string;
  };
}

export interface IERC20MinterInterface extends Interface {
  getFunction(nameOrSignature: "mint" | "sale" | "setSale"): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ERC20MinterInitialized"
      | "ERC20RewardsDeposit"
      | "MintComment"
      | "SaleSet"
      | "ZoraRewardsRecipientSet"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "mint",
    values: [
      AddressLike,
      BigNumberish,
      AddressLike,
      BigNumberish,
      BigNumberish,
      AddressLike,
      AddressLike,
      string
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "sale",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setSale",
    values: [BigNumberish, IERC20Minter.SalesConfigStruct]
  ): string;

  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sale", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setSale", data: BytesLike): Result;
}

export namespace ERC20MinterInitializedEvent {
  export type InputTuple = [rewardPercentage: BigNumberish];
  export type OutputTuple = [rewardPercentage: bigint];
  export interface OutputObject {
    rewardPercentage: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ERC20RewardsDepositEvent {
  export type InputTuple = [
    createReferral: AddressLike,
    mintReferral: AddressLike,
    firstMinter: AddressLike,
    zora: AddressLike,
    collection: AddressLike,
    currency: AddressLike,
    tokenId: BigNumberish,
    createReferralReward: BigNumberish,
    mintReferralReward: BigNumberish,
    firstMinterReward: BigNumberish,
    zoraReward: BigNumberish
  ];
  export type OutputTuple = [
    createReferral: string,
    mintReferral: string,
    firstMinter: string,
    zora: string,
    collection: string,
    currency: string,
    tokenId: bigint,
    createReferralReward: bigint,
    mintReferralReward: bigint,
    firstMinterReward: bigint,
    zoraReward: bigint
  ];
  export interface OutputObject {
    createReferral: string;
    mintReferral: string;
    firstMinter: string;
    zora: string;
    collection: string;
    currency: string;
    tokenId: bigint;
    createReferralReward: bigint;
    mintReferralReward: bigint;
    firstMinterReward: bigint;
    zoraReward: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace MintCommentEvent {
  export type InputTuple = [
    sender: AddressLike,
    tokenContract: AddressLike,
    tokenId: BigNumberish,
    quantity: BigNumberish,
    comment: string
  ];
  export type OutputTuple = [
    sender: string,
    tokenContract: string,
    tokenId: bigint,
    quantity: bigint,
    comment: string
  ];
  export interface OutputObject {
    sender: string;
    tokenContract: string;
    tokenId: bigint;
    quantity: bigint;
    comment: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SaleSetEvent {
  export type InputTuple = [
    mediaContract: AddressLike,
    tokenId: BigNumberish,
    salesConfig: IERC20Minter.SalesConfigStruct
  ];
  export type OutputTuple = [
    mediaContract: string,
    tokenId: bigint,
    salesConfig: IERC20Minter.SalesConfigStructOutput
  ];
  export interface OutputObject {
    mediaContract: string;
    tokenId: bigint;
    salesConfig: IERC20Minter.SalesConfigStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ZoraRewardsRecipientSetEvent {
  export type InputTuple = [
    prevRecipient: AddressLike,
    newRecipient: AddressLike
  ];
  export type OutputTuple = [prevRecipient: string, newRecipient: string];
  export interface OutputObject {
    prevRecipient: string;
    newRecipient: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IERC20Minter extends BaseContract {
  connect(runner?: ContractRunner | null): IERC20Minter;
  waitForDeployment(): Promise<this>;

  interface: IERC20MinterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  mint: TypedContractMethod<
    [
      mintTo: AddressLike,
      quantity: BigNumberish,
      tokenAddress: AddressLike,
      tokenId: BigNumberish,
      totalValue: BigNumberish,
      currency: AddressLike,
      mintReferral: AddressLike,
      comment: string
    ],
    [void],
    "nonpayable"
  >;

  sale: TypedContractMethod<
    [tokenContract: AddressLike, tokenId: BigNumberish],
    [IERC20Minter.SalesConfigStructOutput],
    "view"
  >;

  setSale: TypedContractMethod<
    [tokenId: BigNumberish, salesConfig: IERC20Minter.SalesConfigStruct],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [
      mintTo: AddressLike,
      quantity: BigNumberish,
      tokenAddress: AddressLike,
      tokenId: BigNumberish,
      totalValue: BigNumberish,
      currency: AddressLike,
      mintReferral: AddressLike,
      comment: string
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "sale"
  ): TypedContractMethod<
    [tokenContract: AddressLike, tokenId: BigNumberish],
    [IERC20Minter.SalesConfigStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "setSale"
  ): TypedContractMethod<
    [tokenId: BigNumberish, salesConfig: IERC20Minter.SalesConfigStruct],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "ERC20MinterInitialized"
  ): TypedContractEvent<
    ERC20MinterInitializedEvent.InputTuple,
    ERC20MinterInitializedEvent.OutputTuple,
    ERC20MinterInitializedEvent.OutputObject
  >;
  getEvent(
    key: "ERC20RewardsDeposit"
  ): TypedContractEvent<
    ERC20RewardsDepositEvent.InputTuple,
    ERC20RewardsDepositEvent.OutputTuple,
    ERC20RewardsDepositEvent.OutputObject
  >;
  getEvent(
    key: "MintComment"
  ): TypedContractEvent<
    MintCommentEvent.InputTuple,
    MintCommentEvent.OutputTuple,
    MintCommentEvent.OutputObject
  >;
  getEvent(
    key: "SaleSet"
  ): TypedContractEvent<
    SaleSetEvent.InputTuple,
    SaleSetEvent.OutputTuple,
    SaleSetEvent.OutputObject
  >;
  getEvent(
    key: "ZoraRewardsRecipientSet"
  ): TypedContractEvent<
    ZoraRewardsRecipientSetEvent.InputTuple,
    ZoraRewardsRecipientSetEvent.OutputTuple,
    ZoraRewardsRecipientSetEvent.OutputObject
  >;

  filters: {
    "ERC20MinterInitialized(uint256)": TypedContractEvent<
      ERC20MinterInitializedEvent.InputTuple,
      ERC20MinterInitializedEvent.OutputTuple,
      ERC20MinterInitializedEvent.OutputObject
    >;
    ERC20MinterInitialized: TypedContractEvent<
      ERC20MinterInitializedEvent.InputTuple,
      ERC20MinterInitializedEvent.OutputTuple,
      ERC20MinterInitializedEvent.OutputObject
    >;

    "ERC20RewardsDeposit(address,address,address,address,address,address,uint256,uint256,uint256,uint256,uint256)": TypedContractEvent<
      ERC20RewardsDepositEvent.InputTuple,
      ERC20RewardsDepositEvent.OutputTuple,
      ERC20RewardsDepositEvent.OutputObject
    >;
    ERC20RewardsDeposit: TypedContractEvent<
      ERC20RewardsDepositEvent.InputTuple,
      ERC20RewardsDepositEvent.OutputTuple,
      ERC20RewardsDepositEvent.OutputObject
    >;

    "MintComment(address,address,uint256,uint256,string)": TypedContractEvent<
      MintCommentEvent.InputTuple,
      MintCommentEvent.OutputTuple,
      MintCommentEvent.OutputObject
    >;
    MintComment: TypedContractEvent<
      MintCommentEvent.InputTuple,
      MintCommentEvent.OutputTuple,
      MintCommentEvent.OutputObject
    >;

    "SaleSet(address,uint256,tuple)": TypedContractEvent<
      SaleSetEvent.InputTuple,
      SaleSetEvent.OutputTuple,
      SaleSetEvent.OutputObject
    >;
    SaleSet: TypedContractEvent<
      SaleSetEvent.InputTuple,
      SaleSetEvent.OutputTuple,
      SaleSetEvent.OutputObject
    >;

    "ZoraRewardsRecipientSet(address,address)": TypedContractEvent<
      ZoraRewardsRecipientSetEvent.InputTuple,
      ZoraRewardsRecipientSetEvent.OutputTuple,
      ZoraRewardsRecipientSetEvent.OutputObject
    >;
    ZoraRewardsRecipientSet: TypedContractEvent<
      ZoraRewardsRecipientSetEvent.InputTuple,
      ZoraRewardsRecipientSetEvent.OutputTuple,
      ZoraRewardsRecipientSetEvent.OutputObject
    >;
  };
}
