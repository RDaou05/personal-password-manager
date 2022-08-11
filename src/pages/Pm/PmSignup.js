import { React, useEffect, useState } from "react";
import classes from "./Pm.module.css";
import { Link, useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";

const PmSignup = () => {
  const navigate = useNavigate();
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");
  const [errorMakingPasswordState, setErrorMakingPasswordState] =
    useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [meterStrengthState, setMeterStrengthState] = useState(0);
  const [renterMeterStrengthState, setRenterMeterStrengthState] = useState(0);

  // Making login page unresizeable
  let win = nw.Window.get();
  win.setResizable(true);
  win.unmaximize();
  win.leaveFullscreen();
  win.resizeTo(1020, 570);
  win.setResizable(false);

  const createMasterPassword = () => {};

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
    <div className={classes.setupMPScreenContainer}>
      <h1 className={classes.createMasterPasswordHeader}>
        Create Master Password
      </h1>
      <input
        type="password"
        style={{
          borderBottom: errorMakingPasswordState
            ? "2px solid #844242"
            : "2px solid teal",
        }}
        className={classes.newMasterPasswordField}
        id={classes.newMasterPasswordField}
        placeholder="Master Password"
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
        style={{
          borderBottom: errorMakingPasswordState
            ? "2px solid #844242"
            : "2px solid teal",
        }}
        className={classes.renterMP}
        id={classes.renterMP}
        placeholder="Confirm Master Password"
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
        onClick={() => {
          console.log(passwordState, confirmPasswordState);
          const passwordCheckResults = checkIfPasswordIsOk(
            passwordState,
            confirmPasswordState
          );
          // The result will either be "true", or an error message
          console.log(passwordCheckResults);
          if (passwordCheckResults == "true") {
            console.log("Works");
          } else {
            setErrorMakingPasswordState(true);
            setPasswordErrorMessage(passwordCheckResults);
          }
        }}
      >
        Create Master Password
      </button>

      <h1
        to=""
        className={classes.back}
        onClick={() => {
          navigate("/appselector", { replace: true });
        }}
      >
        Back to main page
      </h1>
    </div>
  );
};

export default PmSignup;
