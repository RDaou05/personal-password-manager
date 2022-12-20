import React, { useRef, useState } from "react";
import { forgotPassword } from "../../firebase";
import { Link } from "react-router-dom";
import classes from "./ForgotPass.module.css";
import Confirmed from "./Confirmed";

const ForgotPass = () => {
  const emailRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const errorMessageRef = useRef();
  const [
    disableForgotPasswordButtonState,
    setDisableForgotPasswordButtonState,
  ] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [confirmPopupState, setConfirmPopupState] = useState(false);
  return (
    <div>
      {confirmPopupState ? (
        <Confirmed
          email={emailRef.current.value}
          close={() => {
            setConfirmPopupState(false);
          }}
        />
      ) : null}
      <div
        id={classes.conatiner}
        style={{
          opacity: confirmPopupState ? "0.3" : "1",
          pointerEvents: confirmPopupState ? "none" : "auto",
        }}
      >
        <h1 id={classes.resetHeader}>Reset Password</h1>
        <div id={classes.form}>
          <input
            type="text"
            ref={emailRef}
            placeholder="Email"
            id={classes.emailInput}
            autoComplete="off"
            onKeyDown={(evt) => {
              if (evt.key == "Enter") {
                confirmButtonRef.current.click();
              }
            }}
            style={{
              borderBottom: errorState ? "2px solid red" : "2px solid white",
            }}
          />
          <button
            id={classes.confirmButton}
            ref={confirmButtonRef}
            disabled={disableForgotPasswordButtonState}
            onClick={async () => {
              setDisableForgotPasswordButtonState(true);
              console.log(emailRef.current.value);
              const createReturn = await forgotPassword(emailRef.current.value);
              console.log(createReturn);
              if (createReturn == undefined) {
                console.log("Good un!");
                setErrorState(false);
                errorMessageRef.current.textContent = "";
                setConfirmPopupState(true);
                setDisableForgotPasswordButtonState(false);
              } else if (createReturn.substring(0, 5) == "error") {
                setConfirmPopupState(false);
                setErrorState(true);
                const errorCode = createReturn.substring(7);
                const errorCodeCleaned =
                  errorCode.substring(5, 6).split("-").join(" ").toUpperCase() +
                  errorCode.substring(6).split("-").join(" ");
                errorMessageRef.current.textContent = errorCodeCleaned;
                setDisableForgotPasswordButtonState(false);
              }
            }}
          >
            Confirm
          </button>
          <p
            id={classes.errorMessage}
            ref={errorMessageRef}
            style={{ marginBottom: errorState ? "0" : "10%" }}
          ></p>
        </div>

        <Link to="/" id={classes.backToLoginLink}>
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPass;
