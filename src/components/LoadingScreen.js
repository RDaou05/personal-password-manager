import React from "react";
import ReactLoading from "react-loading";
import classes from "./LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div>
      <div id={classes.iconContainer}>
        <ReactLoading
          id={classes.icon}
          type="bubbles"
          color="white"
          height={100}
          width={100}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
