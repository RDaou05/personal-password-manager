import React, { useRef } from "react";
import { useState } from "react";
import { checkifMasterPasswordIsCorrect } from "../../../firebase";
import classes from "./PmComponents.module.css";

const ConfirmMPBox = (props) => {
  const [mpToCheck, setMpToCheck] = useState("");
  const [enableRedStyles, setEnableRedStyles] = useState(false);
  const [enableConfirmButton, setEnableConfirmButton] = useState(true);
  const [showPasswordState, setShowPasswordState] = useState(false);
  const confirmButtonRef = useRef(null);
  return (
    <div>
      <div className={classes.popupAskForMP}>
        <button
          id={classes.buttonToCloseConfirmMP}
          onClick={() => {
            props.close();
          }}
        >
          &#x2715;
        </button>
        <h2 id={classes.textToConfirmMP}>Confirm your master password</h2>
        <input
          type={showPasswordState ? "text" : "password"}
          autocomplete="new-password"
          id={classes.confirmMP}
          onChange={(evt) => {
            setMpToCheck(evt.target.value);
          }}
          onKeyDown={(evt) => {
            if (evt.key == "Enter") {
              confirmButtonRef.current.click();
            }
          }}
          style={{
            backgroundColor: enableRedStyles
              ? "rgb(130, 48, 48)"
              : "rgb(92, 97, 92)",
            border: enableRedStyles ? "3px solid rgb(58, 28, 28)" : "grey",
          }}
        />
        <button
          id={classes.showPassBeingConfirmed}
          onClick={() => {
            setShowPasswordState(!showPasswordState);
          }}
        >
          {showPasswordState ? "Hide Password" : "Show Password"}
        </button>
        <button
          disabled={!enableConfirmButton}
          id={classes.confirmMPForMFAButton}
          ref={confirmButtonRef}
          onClick={async () => {
            setEnableConfirmButton(false);

            const mpIsCorrect = await checkifMasterPasswordIsCorrect(mpToCheck);
            if (mpIsCorrect) {
              props.confirmed();
            } else {
              setEnableRedStyles(true);
              setEnableConfirmButton(true);
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmMPBox;
