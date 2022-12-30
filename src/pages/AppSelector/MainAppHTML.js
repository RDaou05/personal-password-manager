import React from "react";
import logo from "../../images/lockIcon.png";
import ThemeSelectorPopup from "./ThemeSelectorPopup.js";
import { useNavigate } from "react-router-dom";
import { givePRole } from "../../firebase";
const MainAppHTML = (props) => {
  return (
    <div>
      {props.themeSelectState ? (
        <ThemeSelectorPopup
          themeSelectState={props.themeSelectState}
          mfaPassedState={props.mfaPassedState}
          roleState={props.roleState}
          classes={props.classes}
          setClassesState={props.setClassesState}
          setThemeSelectState={props.setThemeSelectState}
          setInPreviewState={props.setInPreviewState}
        />
      ) : null}
      <div id={props.classes.container}>
        <div className={props.classes.showPUIButtonContainer}>
          <button
            className={props.classes.showPUIButton}
            onClick={() => {
              props.setThemeSelectState(true);
            }}
          >
            <span id={props.classes.crownIcon}>👑</span>
            <p id={props.classes.showLayoutsText}>Show Premium Layouts</p>
          </button>
        </div>
        {props.roleState == "ft" && !props.inPreviewState ? (
          <div className={props.classes.upgradeToPContainer}>
            <button
              className={props.classes.upgradeToP}
              onClick={async () => {
                await givePRole();
              }}
            >
              <span id={props.classes.lockIconUpgrade}>🗝️</span>
              <p id={props.classes.upgradeButtonText}>Upgrade to premium</p>
            </button>
          </div>
        ) : null}
        <div className={props.classes.keyImage}>
          <img id={props.classes.realIcon} src={logo} />
        </div>
        <h1 id={props.classes.nameHeader}>Personal PM</h1>
        <button
          id={props.classes.takeToPMButton}
          className={props.classes.redirectAppButtons}
          disabled={props.inPreviewState}
          onClick={() => {
            props.navigate("/pm", { replace: true });
          }}
        >
          <i className="fas fa-key" id={props.classes.keyPMIcon}></i>
          <p id={props.classes.pmButtonText}>Password Manager</p>
        </button>
        <button
          id={props.classes.takeToLockerButton}
          disabled={props.inPreviewState}
          className={props.classes.redirectAppButtons}
          onClick={() => {
            alert("This feature is a work in progress");
            // props.navigate("/pl", { replace: true });
          }}
        >
          <i className="fas fa-folder" id={props.classes.docLockerIcon}></i>
          <p id={props.classes.lockerButtonText}>Personal Locker</p>
        </button>
      </div>
    </div>
  );
};

export default MainAppHTML;
