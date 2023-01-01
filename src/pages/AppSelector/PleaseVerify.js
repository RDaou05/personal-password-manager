import React from "react";
import { firebaseAuth, resendLink } from "../../firebase";
import classes from "./PleaseVerify.module.css";
import { Link } from "react-router-dom";
import { getIdToken, reload } from "firebase/auth";

const PleaseVerify = (props) => {
  return (
    <div className={classes.pleaseVerifyScreen}>
      <div className={classes.pleaseVerifyPopup}>
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
              // Getting the updated version of the auth token
              await reload(firebaseAuth.currentUser);
              if (firebaseAuth.currentUser.emailVerified) {
                props.setEmailVerifiedState(true);
              } else {
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
