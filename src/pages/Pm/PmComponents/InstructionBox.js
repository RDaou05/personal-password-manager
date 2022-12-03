import React from "react";
import classes from "./InstructionBox.module.css";

const InstructionBox = (props) => {
  return (
    <div
      className={classes.mainInstructionBox}
      onClick={() => {
        props.setAddPasswordScreenState(true);
        props.popupActiveSetState(true);
      }}
    >
      <h2>You don't have any added passwords!</h2>
      <p id={classes.clickToAdd}>
        Click the "Add Password" button to add your first password
      </p>
    </div>
  );
};

export default InstructionBox;
