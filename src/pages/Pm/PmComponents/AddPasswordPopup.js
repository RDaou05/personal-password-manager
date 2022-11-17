import React, { useState } from "react";
import classes from "./PmComponents.module.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { addUserQuery, decryptUserQueries } from "../../../firebase";

const AddPasswordPopup = (props) => {
  const [showPasswordState, setShowPasswordState] = useState(false);
  const [nameInputState, setNameInputState] = useState("");
  const [emailInputState, setEmailInputStateState] = useState("");
  const [passwordInputState, setPasswordInputState] = useState("");
  const [urlInputState, setUrlInputState] = useState("");
  const [addingInProgressState, setAddingInProgressState] = useState(false);

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
    const newQueryInfo = await addUserQuery(
      objectToAdd,
      hashOfMasterPass,
      urlExists
    );
    await props.updateDecryptedList(newQueryInfo);
    props.closePopup();
  };
  return (
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
        autocomplete="off"
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
          await uploadUserQuery();
        }}
      >
        Confirm
      </button>
    </div>
  );
};

export default AddPasswordPopup;
