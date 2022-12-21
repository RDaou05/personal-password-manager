import React from "react";
import settingIcon from "../images/gear.svg";
import classes from "./Gear.module.css";
const Gear = (props) => {
  return (
    <img
      id={classes.gear}
      src={settingIcon}
      onClick={() => {
        if (!props.popupActiveSetState) {
          props.setSettingsScreenstate(true);
        }
      }}
    />
  );
};

export default Gear;
