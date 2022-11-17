import React, { useRef, useState } from "react";
import { checkifMasterPasswordIsCorrect, updateMP } from "../../../firebase";
import classes from "./PmComponents.module.css";
import zxcvbn from "zxcvbn";

const UpdateMasterPassword = (props) => {
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [updateButtonIsDisabledState, setUpdateButtonIsDisabledState] =
    useState(false);
  const [currentMPEnteredCorrectState, setCurrentMPEnteredCorrectState] =
    useState(true); // This will only be used for styling the input box red (we will be using cloud functions to actually verify if the MP was entered correctly)
  const [newMpScoreState, setNewMpScoreState] = useState(-1);
  const [confirmNewMpScoreState, setConfirmNewMpScoreState] = useState(-1);
  const [passwordToWeakState, setPasswordToWeakState] = useState(false);
  const [passwordsDontMatchState, setPasswordsDontMatchState] = useState(false);
  const [wrongCurrentMPState, setWrongCurrentMPState] = useState(false);
  const currentMpInputBoxRef = useRef(null);
  const newMpInputBoxRef = useRef(null);
  const confirmNewMpInputBoxRef = useRef(null);
  return (
    <div className={classes.changeMasterPasswordScreen}>
      <button
        id={classes.buttonToCloseConfirmMP}
        onClick={() => {
          props.close();
        }}
      >
        &#x2715;
      </button>
      <h3 className={classes.changeMasterPasswordHeader}>
        Change Master Password
      </h3>
      <div className={classes.changeMPInputsContainer}>
        <input
          type={showPasswordState ? "text" : "password"}
          autocomplete="new-password"
          placeholder="Current Master Password"
          className={classes.changeMPCurrentMP}
          ref={currentMpInputBoxRef}
          style={{
            color: currentMPEnteredCorrectState ? "white" : "red",
            backgroundColor: currentMPEnteredCorrectState
              ? "#30343c"
              : "#633838",
          }}
        />
        <input
          type={showPasswordState ? "text" : "password"}
          autocomplete="new-password"
          placeholder="New Master Password"
          className={classes.changeMPNewMP}
          ref={newMpInputBoxRef}
          style={{
            backgroundColor:
              newMpScoreState == 1
                ? "#8b0000"
                : newMpScoreState == 2
                ? "#e45219"
                : newMpScoreState == 3
                ? "#bda000"
                : newMpScoreState == 4
                ? "#048000"
                : newMpScoreState == -1
                ? "#30343c"
                : null,
          }}
          onChange={() => {
            const result = zxcvbn(newMpInputBoxRef.current.value);
            const score = result.score;
            setNewMpScoreState(score);
          }}
        />
        <input
          type={showPasswordState ? "text" : "password"}
          autocomplete="new-password"
          placeholder="Confirm New Master Password"
          className={classes.changeMPRenterNewMP}
          ref={confirmNewMpInputBoxRef}
          style={{
            backgroundColor:
              confirmNewMpScoreState == 1
                ? "#8b0000"
                : confirmNewMpScoreState == 2
                ? "#e45219"
                : confirmNewMpScoreState == 3
                ? "#bda000"
                : confirmNewMpScoreState == 4
                ? "#048000"
                : confirmNewMpScoreState == -1
                ? "#30343c"
                : null,
          }}
          onChange={() => {
            const result = zxcvbn(confirmNewMpInputBoxRef.current.value);
            const score = result.score;
            setConfirmNewMpScoreState(score);
          }}
        />
        <h2
          id={classes.changeTooWeakError}
          style={{ display: passwordToWeakState ? "initial" : "none" }}
        >
          Password is too weak
        </h2>
        <h2
          id={classes.changeDontMatchError}
          style={{ display: passwordsDontMatchState ? "initial" : "none" }}
        >
          Passwords don't match
        </h2>
        <h2
          id={classes.changeIncorrectPasswordError}
          style={{ display: wrongCurrentMPState ? "initial" : "none" }}
        >
          Master password is incorrect
        </h2>
      </div>
      <div className={classes.changeMPFooter}>
        <button
          className={classes.showNewMPPasswordsButton}
          onClick={() => setShowPasswordState(!showPasswordState)}
        >
          <p className={classes.showPasswordsText}>
            {showPasswordState ? "Hide Passwords  " : "Show Passwords  "}

            <i id={classes.showPasswordsIcon}></i>
          </p>
        </button>
        <button
          className={classes.confirmMasterPasswordChange}
          disabled={updateButtonIsDisabledState}
          onClick={async () => {
            setUpdateButtonIsDisabledState(true);
            if (
              confirmNewMpInputBoxRef.current.value ==
              newMpInputBoxRef.current.value // Checks if the password has confirmed their new MP correctly
            ) {
              if (newMpScoreState < 3 || confirmNewMpScoreState < 3) {
                // Checks if new MP is strong enough
                setPasswordToWeakState(true);
                setPasswordsDontMatchState(false);
                setWrongCurrentMPState(false);
              } else {
                const masterPasswordIsCorrect =
                  await checkifMasterPasswordIsCorrect(
                    currentMpInputBoxRef.current.value
                  );
                if (masterPasswordIsCorrect) {
                  setCurrentMPEnteredCorrectState(true);
                  const x = await updateMP(
                    currentMpInputBoxRef.current.value,
                    newMpInputBoxRef.current.value
                  );
                  props.success(x.data.newMPH);
                  setUpdateButtonIsDisabledState(false);
                } else {
                  setCurrentMPEnteredCorrectState(false);
                  setWrongCurrentMPState(true);
                  setUpdateButtonIsDisabledState(false);
                  setPasswordsDontMatchState(false);
                }
                setPasswordToWeakState(false);
                setPasswordsDontMatchState(false);
              }
            } else {
              setPasswordsDontMatchState(true);
              setWrongCurrentMPState(false);
              setPasswordToWeakState(false);
              setUpdateButtonIsDisabledState(false);
            }

            setUpdateButtonIsDisabledState(false);
          }}
        >
          Change Password
        </button>
      </div>
      <button
        className={classes.closeChangeMasterPasswordWindow}
        onClick={() => {
          props.close();
        }}
      >
        Cancel Changes
      </button>
    </div>
  );
};

export default UpdateMasterPassword;
