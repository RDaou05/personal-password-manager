import React, { useRef, useState } from "react";
import classes from "./ForgotPass.module.css";

const Confirmed = (props) => {
  return (
    <div>
      <div id={classes.popup}>
        <p style={{ color: "white" }}>
          Password reset link has been sent to{" "}
          <span style={{ color: "#00cbcb" }}>{props.email}</span>{" "}
        </p>
        <p style={{ color: "yellow" }}>
          There is a high chance that the email might be marked as spam
        </p>
        <button
          id={classes.done}
          onClick={() => {
            props.close();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Confirmed;
