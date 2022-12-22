import React from "react";
import settingIcon from "../images/gear.svg";
import classes from "./Gear.module.css";
const Gear = (props) => {
  return (
    <img
      id={classes.gear}
      src={settingIcon}
      onClick={() => {
        console.log("popact: ", props.popupActiveSetState);
        if (!props.popupActiveState) {
          props.setSettingsScreenstate(true);
          props.popupActiveSetState(true);
        }
      }}
    />
  );
};

export default Gear;
