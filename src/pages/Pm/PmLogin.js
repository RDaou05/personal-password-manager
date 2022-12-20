import { React, useEffect, useState } from "react";
import classes from "./Pm.module.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { checkifMasterPasswordIsCorrect, hashString } from "../../firebase";

const PmLogin = (props) => {
  let win = nw.Window.get();
  win.setResizable(true);
  win.unmaximize();
  win.leaveFullscreen();
  win.resizeTo(1020, 543);
  win.setResizable(false);

  const navigate = useNavigate();
  const [loginInputState, setLoginInputState] = useState("");
  const [wrongPasswordState, setWrongPasswordState] = useState(false);
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [inputBoxIsFocusedState, setInputBoxIsFocusedState] = useState(false);
  const [backupPassedState, setBackupPassedState] = useState(false);
  return (
    <div className={classes.setupMPScreenContainer}>
      <h1 className={classes.createMasterPasswordHeader}>
        Enter Master Password
      </h1>
      <div className={classes.inputArea}>
        <input
          type={showPasswordState ? "text" : "password"}
          className={classes.newMasterPasswordField}
          autoComplete="off"
          onChange={(event) => {
            setLoginInputState(event.target.value);
          }}
          placeholder={"Master Password"}
          style={{
            borderBottom: wrongPasswordState
              ? "2px solid #844242"
              : "2px solid teal",
            marginTop: "11%",
            fontSize: "1.3rem",
            width: "81%",
          }}
          onFocus={(evt) => {
            setInputBoxIsFocusedState(true);
          }}
          onBlur={(evt) => {
            setInputBoxIsFocusedState(false);
          }}
          onKeyUp={async (event) => {
            if (event.key == "Enter") {
              const mpToCheck = event.target.value;
              const masterPasswordIsCorrect =
                await checkifMasterPasswordIsCorrect(mpToCheck);
              if (masterPasswordIsCorrect) {
                const newMPHash = await hashString(mpToCheck);
                props.loginPassed(newMPHash);
                setWrongPasswordState(false);
              } else {
                setWrongPasswordState(true);
              }
            }
          }}
        />
        {showPasswordState ? (
          <FaEyeSlash
            style={{
              color: " white",
              fontSize: " 19px",
              top: "40%",
              display: " flex",
              transition: "all 0.1s ease-in-out 0s",
              alignSelf: "center",
              marginTop: "10%",
              marginLeft: "-11%",
              right: "37%",
            }}
            onClick={() => {
              setShowPasswordState(false);
            }}
          />
        ) : (
          <FaEye
            style={{
              color: " white",
              fontSize: " 19px",
              top: "40%",
              display: " flex",
              transition: "all 0.1s ease-in-out 0s",
              alignSelf: "center",
              marginTop: "10%",
              marginLeft: "-11%",
              right: "37%",
            }}
            onClick={() => {
              setShowPasswordState(true);
            }}
          />
        )}
      </div>

      <button
        className={classes.confirmMasterPasswordButton}
        style={{
          padding: "2%",
          marginTop: "7%",
          transition: "all ease-in-out 0.1s",
        }}
        onClick={async () => {
          const mpToCheck = loginInputState;
          const masterPasswordIsCorrect = await checkifMasterPasswordIsCorrect(
            mpToCheck
          );
          if (masterPasswordIsCorrect) {
            const newMPHash = await hashString(mpToCheck);
            props.loginPassed(newMPHash);
            setWrongPasswordState(false);
          } else {
            setWrongPasswordState(true);
          }
        }}
      >
        Confirm
      </button>
      <h1
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

export default PmLogin;
