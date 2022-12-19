import React from "react";
import classes from "./PErrorBox.module.css";
import { Link } from "react-router-dom";

const PErrorBox = (props) => {
  return (
    <div>
      <div className={classes.errorHasOccuredBox}>
        <h4 style={{ marginBottom: "0", color: "white" }}>
          Please cancel your premium subscription before deleting your account
        </h4>
        <button
          id={classes.doneButton}
          onClick={() => {
            props.close();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PErrorBox;
