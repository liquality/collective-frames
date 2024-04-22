import { useCallback, useEffect, useState } from "react";
import {
  useSignIn,
  StatusAPIResponse,
  AuthClientError,
  UseSignInArgs,
} from "@farcaster/auth-kit";
import QRCode from "react-qr-code";
import Modal from "./Modal";
import {
  MdArrowForward,
  MdPhoneIphone,
} from "react-icons/md";
import { isMobile } from "react-device-detect";
type SignInButtonProps = UseSignInArgs & {};

export default function SignInButton({ ...signInArgs }: SignInButtonProps) {
  const { onSuccess, onStatusResponse, onError } = signInArgs;

  const onSuccessCallback = useCallback(
    (res: StatusAPIResponse) => {
      onSuccess?.(res);
    },
    [onSuccess]
  );

  const onStatusCallback = useCallback((res: StatusAPIResponse) => {
    console.log("onStatusCallback", res);
  }, []);

  const onErrorCallback = useCallback((error?: AuthClientError) => {
    onError?.(error);
    setShowDialog(false);
  }, [onError]);

  const onSignOutCallback = useCallback(() => {
    console.log("onSignOutCallback");
  }, []);

  const signInState = useSignIn({
    onSuccess: onSuccessCallback,
    onStatusResponse: onStatusCallback,
    onError: onErrorCallback,
  });
  const {
    signIn,
    signOut,
    connect,
    reconnect,
    isSuccess,
    isError,
    error,
    channelToken,
    url,
    data,
    validSignature,
  } = signInState;

  const handleSignOut = useCallback(() => {
    setShowDialog(false);
    signOut();
    onSignOutCallback();
  }, [signOut, onSignOutCallback]);

  const [showDialog, setShowDialog] = useState(false);

  const onClick = useCallback(() => {
    if (isError) {
      reconnect();
    }
    setShowDialog(true);
    signIn();
    if (url && isMobile) {
      window.location.href = url;
    }
  }, [isError, reconnect, signIn, url]);

  const authenticated = isSuccess && validSignature;

  useEffect(() => {
    if (!channelToken) {
      connect();
    }
  }, [channelToken, connect]);

  return (
    <div className="fc-authkit-signin-button">
      {authenticated ? (
        <p>authenticated: {data?.fid}</p>
      ) : (
        <>
          <button
            onClick={onClick}
            className="text-xl rounded-full px-4 py-2 bg-purple-500 hover:bg-purple-700 disabled:opacity-75 text-white focus:outline-none focus:ring-0"
          >
            Log in with Warpcast ID
          </button>
          <Modal
            isOpen={!!(url && showDialog)}
            onClose={() => setShowDialog(false)}
            showCloseButton={true}
          >
            <div className="flex flex-col">
              <div className="flex text-black text-xl font-semibold">
                Sign in with Warpcast ID
              </div>
              <div className="flex text-gray-400">
                Scan with your phone&apos;s camera to continue
              </div>
            </div>
            <div className="flex m-4 justify-center">
              {url && (
                <QRCode
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={url}
                />
              )}
            </div>
            <div className="flex justify-center mt-8">
              <div className="flex text-black text-xl font-semibold">
                <MdPhoneIphone className="text-2xl text-purple-500 mr-3" />
                <a href={url} className="text-purple-500">
                  I&apos;m using my phone
                </a>
                <MdArrowForward className="text-2xl text-purple-500 ml-3" />
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
