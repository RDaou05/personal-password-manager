import { React, useEffect, useState } from "react";
import classes from "./Pm.module.css";
import { Link, useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { uploadMasterPassword } from "../../firebase";

const PmSignup = (props) => {
  const navigate = useNavigate();
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");
  const [errorMakingPasswordState, setErrorMakingPasswordState] =
    useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(false);
  const [meterStrengthState, setMeterStrengthState] = useState(0);
  const [renterMeterStrengthState, setRenterMeterStrengthState] = useState(0);
  const [signupButtonDisbaledState, setSignupButtonDisbaledState] =
    useState(false);

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
        disabled={signupButtonDisbaledState}
        className={classes.confirmMasterPasswordButton}
        onClick={async () => {
          setSignupButtonDisbaledState(true);
          const passwordCheckResults = checkIfPasswordIsOk(
            passwordState,
            confirmPasswordState
          );
          // The result will either be "true", or an error message as a string
          if (passwordCheckResults == "true") {
            const uploadMPReturn = await uploadMasterPassword(passwordState);
            props.loginPassed(uploadMPReturn.masterPasswordHash);
          } else {
            setErrorMakingPasswordState(true);
            setPasswordErrorMessage(passwordCheckResults);
            setSignupButtonDisbaledState(false);
          }
        }}
      >
        Create Master Password
      </button>

      <h1
        to=""
        className={classes.backFromSignup}
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
