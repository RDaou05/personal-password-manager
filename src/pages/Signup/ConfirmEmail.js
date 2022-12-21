import React from "react";
import classes from "./ConfirmEmail.module.css";
const ConfirmEmail = (props) => {
  return (
    <div>
      <div id={classes.popup}>
        <p style={{ color: "white" }}>
          Account verification link has been sent to{" "}
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

export default ConfirmEmail;
