import React, { useState } from "react";
import classes from "./PmComponents.module.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { addUserQuery, decryptUserQueries } from "../../../firebase";
import LoadingScreen from "../../../components/LoadingScreen";

const AddPasswordPopup = (props) => {
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [nameInputState, setNameInputState] = useState("");
  const [emailInputState, setEmailInputStateState] = useState("");
  const [passwordInputState, setPasswordInputState] = useState("");
  const [urlInputState, setUrlInputState] = useState("");
  const [addingInProgressState, setAddingInProgressState] = useState(false);
  const [loadingScreenState, setLoadingScreenState] = useState(false);

  const uploadUserQuery = async () => {
    // Adding the user entered query to the database
    setAddingInProgressState(true);
    let urlExists;
    if (urlInputState.trim().length >= 4) {
      // URL checker checks if the url is 4 or more characters and it has a period in it
      // Its very easy to get past this, but if the user does, the worst that could happen is the icon will show up as the no url found icon
      if (urlInputState.includes(".")) {
        urlExists = true;
      } else {
        urlExists = false;
      }
    } else {
      urlExists = false;
    }
    const hashOfMasterPass = props.hashBeingUsedToEncrypt; // This is the current hash that is used to encrypt the user info (along with user secret, which is stored in the cloud)
    const objectToAdd = {
      pass: passwordInputState,
      email: emailInputState,
      website: nameInputState,
      directLink: urlInputState,
    };
    setLoadingScreenState(true);
    const newQueryInfo = await addUserQuery(
      objectToAdd,
      hashOfMasterPass,
      urlExists
    );
    await props.updateDecryptedList(newQueryInfo);
    setLoadingScreenState(false);
    props.closePopup();
  };
  return (
    <>
      {loadingScreenState ? (
        <LoadingScreen />
      ) : (
        <div className={classes.addPasswordPopup}>
          <h1 id={classes.addPasswordHeader}>Add Password</h1>
          <button
            id={classes.closeAddPasswordPopup}
            onClick={() => {
              props.closePopup();
            }}
          >
            ✕
          </button>
          <input
            type="text"
            className={classes.addPasswordInputBoxes}
            id={classes.addNameInputBox}
            placeholder="* Name"
            onChange={(event) => {
              setNameInputState(event.target.value);
            }}
          />
          <input
            type="text"
            className={classes.addPasswordInputBoxes}
            id={classes.addEmailInputBox}
            placeholder="* Username/Email"
            onChange={(event) => {
              setEmailInputStateState(event.target.value);
            }}
          />
          <input
            type={showPasswordState ? "text" : "password"}
            className={classes.addPasswordInputBoxes}
            id={classes.addPasswordInputBox}
            placeholder="* Password"
            onChange={(event) => {
              setPasswordInputState(event.target.value);
            }}
          />
          {showPasswordState ? (
            <FaEyeSlash
              className={classes.eye}
              onClick={() => {
                setShowPasswordState(false);
              }}
            />
          ) : (
            <FaEye
              className={classes.eye}
              onClick={() => {
                setShowPasswordState(true);
              }}
            />
          )}
          <input
            type="text"
            className={classes.addPasswordInputBoxes}
            id={classes.addUrlInputBox}
            placeholder="URL (Optional)"
            onChange={(event) => {
              setUrlInputState(event.target.value);
            }}
          />
          <button
            disabled={addingInProgressState}
            className={classes.confirmAddPasswordButton}
            onClick={async () => {
              setLoadingScreenState(true);
              await uploadUserQuery();
              setLoadingScreenState(false);
            }}
          >
            Confirm
          </button>
        </div>
      )}
    </>
  );
};

export default AddPasswordPopup;
