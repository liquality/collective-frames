import { findFrameBySlug } from "@/utils/frame";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getFrameMessage,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import { headers } from "next/headers";
import { useParams } from "next/navigation";

export function currentURL(pathname: string): URL {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  try {
    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    return new URL("http://localhost:3000");
  }
}

type State = {
  pageIndex: number;
};

const initialState: State = { pageIndex: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  return {
    pageIndex: 0,
  };
};

type Props = {
  searchParams: any; // Adjust the type as per your requirement
  params: { slug: string };
};

// This is a react server component only
export default async function Home({ searchParams, params }: Props) {
  const url = currentURL("/frames-transaction");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);
  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: "https://nemes.farcaster.xyz:2281",
  });

  console.log(params, "paramos?");
  if (!params.slug) {
    throw new Error("Frame id not found");
  }

  //get frame from db
  const existingFrame = await findFrameBySlug(params.slug);
  if (!existingFrame) {
    throw new Error("Frame with slug not found" + params.slug);
  }

  console.log(frameMessage, "wats framemsg? 222");

  if (frameMessage?.transactionId) {
    return (
      <FrameContainer
        pathname="/frames-transaction"
        postUrl="/frames-transaction/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage aspectRatio="1:1">
          <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
            Transaction submitted! {frameMessage.transactionId}
          </div>
        </FrameImage>
        <FrameButton
          action="link"
          target={`https://optimistic.etherscan.io/tx/${frameMessage.transactionId}`}
        >
          View on block explorer
        </FrameButton>
      </FrameContainer>
    );
  }

  // then, when done, return next frame
  return (
    <div>
      Rent farcaster storage example{" "}
      <FrameContainer
        pathname="/frames-transaction"
        postUrl="/frames-transaction/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage src={existingFrame.imageUrl} aspectRatio="1:1"></FrameImage>
        <FrameButton
          action="tx"
          target={`/frames-transaction/txdata/${params.slug}`}
        >
          Mint ✨ for collective XXX
        </FrameButton>
      </FrameContainer>
    </div>
  );
}
