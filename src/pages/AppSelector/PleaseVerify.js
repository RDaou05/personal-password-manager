import React from "react";
import { firebaseAuth } from "../../firebase";
import classes from "./PleaseVerify.module.css";
import { Link } from "react-router-dom";

const PleaseVerify = () => {
  return (
    <div>
      <p id={classes.message}>
        Please verify your email at{" "}
        <span id={classes.email}>{firebaseAuth.currentUser.email}</span>
      </p>
      <button id={classes.sendLinkButton}>Resend Verification Link</button>
      <Link to="/" id={classes.backToLogin}>
        Back To Login
      </Link>
    </div>
  );
};

export default PleaseVerify;
