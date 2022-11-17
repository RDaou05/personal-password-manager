import React, { useState } from "react";
import classes from "./Pm.module.css";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";
import {
  removeAvailableBackupCode,
  updateMasterPassword,
  uploadMasterPassword,
} from "../../firebase";

const ResetMP = (props) => {
  const navigate = useNavigate();
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");
  const [errorMakingPasswordState, setErrorMakingPasswordState] =
    useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [meterStrengthState, setMeterStrengthState] = useState(0);
  const [renterMeterStrengthState, setRenterMeterStrengthState] = useState(0);
  const checkIfPasswordIsOk = (enteredPass, confirmEnteredPass) => {
    if (enteredPass == confirmEnteredPass) {
      // Checking if passwords match
      if (enteredPass.length > 7) {
        // Checking if password is long enough
        if (meterStrengthState == 3 || meterStrengthState == 4) {
          // Checking if the strength of the password is at least above a 3 out of 4
          return "true";
        } else {
          return "Password is not strong enough";
        }
      } else {
        return "Password is not long enough";
      }
    } else {
      return "Both passwords do not match";
    }
  };
  return (
    <div>
      <div className={classes.setupMPScreenContainer}>
        <h1 className={classes.createMasterPasswordHeader}>
          Reset Master Password
        </h1>
        <input
          type="password"
          autocomplete="new-password"
          style={{
            borderBottom: errorMakingPasswordState
              ? "2px solid #844242"
              : "2px solid teal",
          }}
          className={classes.newMasterPasswordField}
          id={classes.newMasterPasswordField}
          placeholder="New Master Password"
          autoFocus="autofocus"
          onChange={(event) => {
            setPasswordState(event.target.value);
            let result = zxcvbn(event.target.value);
            setMeterStrengthState(result.score);
          }}
        />

        <meter
          min="0"
          low="1"
          optimum="2"
          high="3"
          max="4"
          className={classes.passwordStrengthBar}
          value={meterStrengthState}
        ></meter>

        <input
          type="password"
          autocomplete="new-password"
          style={{
            borderBottom: errorMakingPasswordState
              ? "2px solid #844242"
              : "2px solid teal",
          }}
          className={classes.renterMP}
          id={classes.renterMP}
          placeholder="Confirm New Master Password"
          onChange={(event) => {
            setConfirmPasswordState(event.target.value);
            let result = zxcvbn(event.target.value);
            setRenterMeterStrengthState(result.score);
          }}
        />

        <meter
          min="0"
          low="1"
          optimum="2"
          high="3"
          max="4"
          className={classes.reenterPasswordStrengthBar}
          value={renterMeterStrengthState}
        ></meter>

        <h2 id={classes.passwordErrorMessage}>{passwordErrorMessage}</h2>

        <button
          className={classes.confirmMasterPasswordButton}
          style={{ marginTop: errorMakingPasswordState ? "12%" : "6%" }}
          onClick={async () => {
            const passwordCheckResults = checkIfPasswordIsOk(
              passwordState,
              confirmPasswordState
            );
            // The result will either be "true", or an error message as a string
            if (passwordCheckResults == "true") {
              await uploadMasterPassword(passwordState, true);
              if (props.usingBackupCode) {
                props.updateAvailableCodes();
              }
            } else {
              setErrorMakingPasswordState(true);
              setPasswordErrorMessage(passwordCheckResults);
            }
          }}
        >
          Update Master Password
        </button>

        {props.usingBackupCode == false ? (
          <h1
            to=""
            className={classes.back}
            onClick={() => {
              navigate("/appselector", { replace: true });
            }}
          >
            Back to main page
          </h1>
        ) : props.usingBackupCode ? null : null}
      </div>

      {props.usingBackupCode ? (
        <h1 id={classes.codeUsedMessage}>
          Code{" "}
          <span style={{ color: "#00ffd0", textDecoration: "underline" }}>
            {props.usedCode}
          </span>{" "}
          has been used and may not be used again after resetting your password
        </h1>
      ) : null}
    </div>
  );
};

export default ResetMP;
