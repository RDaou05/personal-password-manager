import React, { useRef } from "react";
import { useState } from "react";
import { checkIfCodeToEnableMFAIsCorrect } from "../../../firebase";
import classes from "./PmComponents.module.css";

const MfaConfirmationBox = (props) => {
  const [enteredMfaConfirmationCode, setEnteredMfaConfirmationCode] =
    useState("");
  const [mfaIsWrong, setMfaIsWrong] = useState(false);
  const [disableConfirmButtonState, setDisableConfirmButtonState] =
    useState(false);
  const confirmButtonRef = useRef(null);
  return (
    <div className={classes.popupWithMFAInformation}>
      {" "}
      <button
        id={classes.closeSettings}
        onClick={() => {
          props.closeMfaConfirmationBox();
        }}
      >
        &#x2715;
      </button>
      <div
        className={classes.mfaContent}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className={classes.qrcodeWrapper}>
          <img src={props.qrcode} id={classes.qrcodeForMFA} />
        </div>
        <div className={classes.boxForMFACode}>
          <p id={classes.mfaCode}>{props.mfaCode}</p>
        </div>
        <p id={classes.mfaInstructions}>
          Please scan the QR code or manually enter in the secret above into
          your authenticator app
        </p>
        <input
          type="text"
          id={classes.enterConfirmMFACode}
          onChange={(evt) => {
            setEnteredMfaConfirmationCode(evt.target.value);
          }}
          onKeyDown={(evt) => {
            if (evt.key == "Enter") {
              confirmButtonRef.current.click();
            }
          }}
          placeholder="Enter MFA Code"
          style={{
            borderBottom: mfaIsWrong
              ? "2px solid #b12f2f"
              : "2px solid #00a2a2",
            color: mfaIsWrong ? "#d25656" : "white",
          }}
        />
        <button
          id={classes.confirmMFAConfirmationButton}
          ref={confirmButtonRef}
          disabled={disableConfirmButtonState}
          onClick={async () => {
            setDisableConfirmButtonState(true);
            const mfaIsCorrect = await checkIfCodeToEnableMFAIsCorrect(
              enteredMfaConfirmationCode,
              props.mfaSecretHex
            );
            if (mfaIsCorrect.data.enteredMFAIsCorrect) {
              props.mfaConfirmationBoxCompleted();
            } else {
              setMfaIsWrong(true);
              setDisableConfirmButtonState(false);
            }
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default MfaConfirmationBox;
