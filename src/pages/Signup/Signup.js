import React, { useEffect, useState } from "react";
import classes from "./Signup.module.css";
import logo from "../../images/lockIcon.png";
import { Link, useNavigate } from "react-router-dom";
import { createPersonalPMAccount } from "../../firebase.js";

const Signup = () => {
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [disableSignUpButtonState, setDisableSignUpButtonState] =
    useState(
      false
    ); /* We disable the sign up button only while we are trying to create the account.
    So the user can't spam the button and send multiple requests */
  const [errorMessageState, setErrorMessageState] = useState(".");
  let navigate = useNavigate();

  return (
    <div className={classes.mainDivContainer}>
      <img id={classes.realIcon} src={logo} />
      <h1 id={classes.signUpHeader}>Sign Up</h1>
      <div className={classes.emailContainer}>
        <input
          type="text"
          id={classes.emailInput}
          onChange={(evt) => {
            setEmailState(evt.target.value);
          }}
          placeholder="Email"
          autoComplete="off"
        />
      </div>
      <div className={classes.passwordContainer}>
        <input
          type="password"
          id={classes.passwordInput}
          placeholder="Password"
          autoComplete="off"
          onChange={(evt) => {
            setPasswordState(evt.target.value);
          }}
        />
        <div className="eyeHolder">
          <i id={classes.eye} className="far fa-eye"></i>
        </div>
      </div>
      <p
        className={classes.errorMessage}
        style={{ color: errorMessageState != "." ? "red" : "transparent" }}
      >
        {errorMessageState}
      </p>
      <div className={classes.signUpContainer}>
        <button
          className={classes.signUpButton}
          id={classes.signUpButton}
          disabled={disableSignUpButtonState}
          onClick={async () => {
            try {
              setDisableSignUpButtonState(
                true
              ); /* Here we are disabling the sign up button only while we are
              trying to create the account. So the user can't spam the button and send multiple requests */
              if (emailState.includes("@") || emailState.length >= 3) {
                const createReturn = await createPersonalPMAccount(
                  emailState,
                  passwordState
                );
                if (createReturn == undefined) {
                  navigate("/appselector", { replace: true });
                } else if (createReturn.substring(0, 5) == "error") {
                  const errorCode = createReturn.substring(7);
                  const errorCodeCleaned =
                    errorCode
                      .substring(5, 6)
                      .split("-")
                      .join(" ")
                      .toUpperCase() +
                    errorCode.substring(6).split("-").join(" ");
                  setErrorMessageState(errorCodeCleaned);
                  setDisableSignUpButtonState(false);
                }
              } else {
                setDisableSignUpButtonState(false);
                setErrorMessageState("Invalid Email");
              }
            } catch (err) {
              const errorCode = err.code;
              console.log(errorCode);
              const errorCodeCleaned =
                errorCode.substring(5, 6).split("-").join(" ").toUpperCase() +
                errorCode.substring(6).split("-").join(" ");
              setErrorMessageState(errorCodeCleaned);
              setDisableSignUpButtonState(false);
            }
          }}
        >
          <h4 id={classes.signUpText}>Sign Up</h4>
        </button>
      </div>
      <Link to="/" id={classes.sendToLogin} replace={true}>
        Already have an account? Login
      </Link>
      <h4 id={classes.errorText}></h4>
    </div>
  );
};

export default Signup;
