import React from "react";
import classes from "./Support.module.css";
import { Link } from "react-router-dom";

const Support = (props) => {
  return (
    <div>
      <div className={classes.errorHasOccuredBox}>
        <h3 style={{ color: "red" }}>An error has occurred</h3>
        <h4 style={{ marginBottom: "0", color: "white" }}>Please contact</h4>
        <h4 className={classes.supportEmail}>
          personal.pm.help.email@gmail.com
        </h4>
        <h4 style={{ marginTop: "0", color: "white" }}>for any assistance</h4>
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

export default Support;
