import React from "react";
import classes from "./DeleteAccountWarning.module.css";
const DeleteAccountWarning = (props) => {
  return (
    <div className={classes.confirmDowngradeBox}>
      <h4 style={{ marginBottom: "0", color: "red" }}>
        WARNING: This will delete your whole account, not just your Personal PM
        account
      </h4>
      <div className={classes.buttonContainer}>
        <button
          className={classes.flexButton}
          id={classes.yesButton}
          onClick={() => {
            props.delete();
            props.close();
          }}
        >
          Delete
        </button>
        <button
          className={classes.flexButton}
          id={classes.noButton}
          onClick={() => {
            props.close();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountWarning;
