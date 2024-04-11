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

// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/frames");
  const previousFrame = getPreviousFrame<State>(searchParams);
  console.log(searchParams, "searchparams?");
  /*  const parts = ctx.url.pathname.split("/");
  console.log({ parts })
  if (parts.length <= 2 || !parts[2]) {
    throw new Error("Frame id not found");
  }
  const slug = parts[2] || ""; */

  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    hubHttpUrl: "",
  });

  console.log(frameMessage, "wats framemsg?");

  if (frameMessage?.transactionId) {
    return (
      <FrameContainer
        pathname="/frames"
        postUrl="/frames"
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
        pathname="/frames"
        postUrl="/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage aspectRatio="1:1">
          <div tw="bg-purple-800 text-white w-full h-full justify-center items-center">
            Rent farcaster storage!!
          </div>
        </FrameImage>
        <FrameButton
          action="tx"
          target="/frames/46ef6fb4-be57-421a-b5bd-f2835c3fe15f"
        >
          Buy a unit
        </FrameButton>
      </FrameContainer>
    </div>
  );
}
