import React from "react";
import classes from "./ConfirmDowngrade.module.css";

const ConfirmDowngrade = (props) => {
  return (
    <div>
      <div className={classes.confirmDowngradeBox}>
        <h4 style={{ marginBottom: "0", color: "red" }}>
          Are you sure you want to cancel your premium subscription?
        </h4>
        <div className={classes.buttonContainer}>
          <button
            className={classes.flexButton}
            id={classes.yesButton}
            onClick={() => {
              props.cancel();
            }}
          >
            Yes
          </button>
          <button
            className={classes.flexButton}
            id={classes.noButton}
            onClick={() => {
              props.close();
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDowngrade;
