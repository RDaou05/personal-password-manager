import React, { useState } from "react";
import { firebaseAuth, resendLink } from "../../firebase";
import classes from "./PleaseVerify.module.css";
import { Link } from "react-router-dom";
import { getIdToken, reload, updateCurrentUser } from "firebase/auth";
import LoadingScreen from "../../components/LoadingScreen";

const PleaseVerify = (props) => {
  const [loadingScreenState, setLoadingScreenState] = useState(false);
  return (
    <div className={classes.pleaseVerifyScreen}>
      {loadingScreenState ? <LoadingScreen /> : null}
      <div
        className={classes.pleaseVerifyPopup}
        style={{ opacity: loadingScreenState ? "0.5" : "1" }}
      >
        <p id={classes.message}>
          Please verify your email at{" "}
          <span id={classes.email}>{firebaseAuth.currentUser.email}</span>
        </p>
        <div className={classes.buttonsContainer}>
          <button
            id={classes.sendLinkButton}
            className={classes.controlButtons}
            style={{ cursor: "pointer" }}
            onClick={async () => {
              await resendLink(); // Resends verification email
            }}
          >
            Resend Verification Link
          </button>
          <button
            id={classes.refreshButton}
            className={classes.controlButtons}
            style={{ cursor: "pointer" }}
            onClick={async () => {
              setLoadingScreenState(true);
              // Getting the updated version of the auth token
              await reload(firebaseAuth.currentUser);
              await updateCurrentUser(firebaseAuth, firebaseAuth.currentUser);
              firebaseAuth.currentUser.getIdToken(true);
              if (firebaseAuth.currentUser.emailVerified) {
                setLoadingScreenState(false);
                props.setEmailVerifiedState(true);
              } else {
                setLoadingScreenState(false);
                props.setEmailVerifiedState(false);
              }
            }}
          >
            Retry
          </button>
        </div>
        <div className={classes.backToLoginContainer}>
          <Link to="/" id={classes.backToLogin}>
            Back To Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PleaseVerify;
