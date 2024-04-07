import { useCallback, useEffect, useState } from "react";
import {
    useSignIn,
    StatusAPIResponse,
    AuthClientError,
    UseSignInArgs
  } from "@farcaster/auth-kit";
import QRCode from "react-qr-code";

type SignInButtonProps = UseSignInArgs & {

};

export default function SignInButton({
  ...signInArgs
}: SignInButtonProps) {
    const { onSuccess, onStatusResponse, onError } = signInArgs;

    const onSuccessCallback = useCallback(
        (res: StatusAPIResponse) => {
          onSuccess?.(res);
        },
        [onSuccess]
      );

  const onStatusCallback = useCallback(
    (res: StatusAPIResponse) => {
        console.log('onStatusCallback', res);
    },
    []
  );

  const onErrorCallback = useCallback(
    (error?: AuthClientError) => {
        console.log('onErrorCallback', error);
    },
    []
  );

  const onSignOutCallback = useCallback(() => {
    console.log('onSignOutCallback');
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
    // if (url && isMobile()) {
    //   window.location.href = url;
    // }
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
          <button onClick={onClick}>Sign In</button>
          {url && showDialog && (
            <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 120,
              width: "100%",
            }}
          >
            <QRCode
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={url}
            />
          </div>
          )}
        </>
      )}
    </div>
  );
}