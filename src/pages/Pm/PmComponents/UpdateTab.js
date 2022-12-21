import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { deleteUserQuery, updateUserQuery } from "../../../firebase";
import classes from "./PmComponents.module.css";

const UpdateTab = (props) => {
  const [updateTabIsOutState, setUpdateTabIsOutState] = useState(
    props.showTabState
  );
  const [editModeState, setEditModeState] = useState(false); // Show save updates and cancel updates buttons. Also hides edit and delete button
  const [nameInputState, setNameInputState] = useState(props.name);
  const [emailInputState, setEmailInputState] = useState(props.email);
  const [passwordInputState, setPasswordInputState] = useState(props.password);
  const [confirmDeletePopupState, setConfirmDeletePopupState] = useState(false);
  const [finalDeleteButtonDisabledState, setFinalDeleteButtonDisabledState] =
    useState(true);
  const [directLinkInputState, setDirectLinkInputState] = useState(
    props.isLink ? props.directLink : null
  );
  const [isLinkState, setIsLinkState] = useState(props.isLink);
  const [saveButtonDisabledState, setSaveButtonDisabledState] =
    useState(false); /* When the user types a character, the onChange
  listener for the input box is triggered. This onChange listener, will update a state with the new value of the input box. However,
  this doesn't happen synchronously, so if the user clicks the save updates button while this is happening, the update might have
  a character missing at the end. So what we are doing here, is disabling the button in between this time */
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  useEffect(() => {
    // The state of the update tab is controlled by the parent component (QuerySlot.js)
    // The reason for this is because the visibility of the update tab is supposed to change when the PARENT component is clicked (the query, not the update tab)
    setUpdateTabIsOutState(props.showTabState);
  }, [props.showTabState]);

  useEffect(() => {
    setSaveButtonDisabledState(false);
  }, [
    nameInputState,
    emailInputState,
    passwordInputState,
    directLinkInputState,
  ]);

  const animation = useSpring({
    to: {
      width: updateTabIsOutState ? "40%" : "0%",
      display: updateTabIsOutState ? "flex" : "none",
    },
    from: {
      width: updateTabIsOutState ? "0%" : "40%",
      display: updateTabIsOutState ? "flex" : "none",
    },
  });
  return (
    <div>
      <animated.div className={`${classes.updateTab} test`} style={animation}>
        <button
          id={classes.closeAddPasswordPopup}
          onClick={() => {
            props.setKeepOpacityNormalOnPopupState(
              false
            ); /* Since we made this true when we loaded in the update tab, we have to change it when we close it so that
            when we open a different popup, the opacity will dim down. The reason we set it to true in the first place is so that the opacity DOESN'T
            dim down only when the update tab popup is opened */
            props.setPopupActiveState(false);
            props.setTabState(false);
          }}
        >
          ✕
        </button>
        <table className={classes.queryInfoTable}>
          <thead>
            <tr>
              <td>
                {props.isLink && props.linkReturnsValidIcon ? (
                  <img
                    className={classes.updateScreenIcon}
                    src={`${props.iconLinkNoSize}&size=96`}
                  />
                ) : null}
              </td>
            </tr>
            <tr>
              <td>
                <h2 className={classes.updateScreenQueryNameHeader}>
                  {capitalizeFirstLetter(props.name)}
                </h2>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div
                  className={`${classes.strongUpdateDisplayTextContainer} ${classes.strongUpdateDisplayTextNameContainer}`}
                >
                  <input
                    className={`${classes.strongUpdateDisplayText} ${classes.strongUpdateDisplayTextName}`}
                    readOnly={editModeState ? false : true}
                    value={nameInputState}
                    style={
                      editModeState
                        ? { pointerEvents: "auto" }
                        : { pointerEvents: "none" }
                    }
                    onChange={(evt) => {
                      setSaveButtonDisabledState(true);
                      setNameInputState(evt.target.value);
                    }}
                  ></input>
                  <small className={classes.smallUpdateDisplayText}>Name</small>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div
                  className={`${classes.strongUpdateDisplayTextContainer} ${classes.strongUpdateDisplayTextEmailContainer}`}
                >
                  <input
                    className={`${classes.strongUpdateDisplayText} ${classes.strongUpdateDisplayTextEmail}`}
                    readOnly={editModeState ? false : true}
                    value={emailInputState}
                    style={
                      editModeState
                        ? { pointerEvents: "auto" }
                        : { pointerEvents: "none" }
                    }
                    onChange={(evt) => {
                      setSaveButtonDisabledState(true);
                      setEmailInputState(evt.target.value);
                    }}
                  ></input>
                  <small className={classes.smallUpdateDisplayText}>
                    Email
                  </small>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div
                  className={`${classes.strongUpdateDisplayTextContainer} ${classes.strongUpdateDisplayTextPasswordContainer}`}
                >
                  <input
                    className={`${classes.strongUpdateDisplayText} ${classes.strongUpdateDisplayTextPassword}`}
                    readOnly={editModeState ? false : true}
                    value={passwordInputState}
                    style={
                      editModeState
                        ? { pointerEvents: "auto" }
                        : { pointerEvents: "none" }
                    }
                    onChange={(evt) => {
                      setSaveButtonDisabledState(true);
                      setPasswordInputState(evt.target.value);
                    }}
                  ></input>
                  <small className={classes.smallUpdateDisplayText}>
                    Password
                  </small>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div
                  className={`${classes.strongUpdateDisplayTextContainer} ${classes.strongUpdateDisplayTextURLContainer}`}
                >
                  <input
                    className={`${classes.strongUpdateDisplayText} ${classes.strongUpdateDisplayTextURL}`}
                    readOnly={editModeState ? false : true}
                    style={
                      editModeState
                        ? { pointerEvents: "auto" }
                        : { pointerEvents: "none" }
                    }
                    value={directLinkInputState}
                    onChange={(evt) => {
                      setSaveButtonDisabledState(true);
                      setDirectLinkInputState(evt.target.value);
                    }}
                  ></input>
                  <small className={classes.smallUpdateDisplayText}>
                    URL/Link
                  </small>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className={classes.editRow}>
              <td>
                {!editModeState ? (
                  <button
                    className={classes.editButtonUpdate}
                    onClick={() => {
                      setEditModeState(true);
                    }}
                  >
                    Edit
                  </button>
                ) : null}
              </td>
            </tr>
            <tr className={classes.saveRow}>
              <td>
                {editModeState ? (
                  <button
                    disabled={saveButtonDisabledState}
                    className={classes.saveButtonUpdate}
                    onClick={async () => {
                      setSaveButtonDisabledState(true); // If the user spams the button, it can cause unessesary writes and updates to the database
                      const updatedObject = {
                        pass: passwordInputState,
                        email: emailInputState,
                        website: nameInputState,
                        directLink: directLinkInputState,
                        isLink: isLinkState.toString(),
                        random: props.random,
                      };
                      if (
                        passwordInputState.trim() != props.password.trim() ||
                        emailInputState.trim() != props.email.trim() ||
                        nameInputState.trim() != props.name.trim() ||
                        directLinkInputState.trim() != props.directLink.trim()
                      ) {
                        /* Checks if new query fields are equal to their original counterparts. If they are all the same as their
                        originals, then their is no point of updating anything */
                        await updateUserQuery(
                          updatedObject,
                          props.hashBeingUsedToEncrypt,
                          props.queryDocumentID
                        );
                        props.setDirectLinkState(directLinkInputState);
                        props.setEmailState(emailInputState);
                        props.setPassState(passwordInputState);
                        props.setNameState(nameInputState);
                        if (directLinkInputState.trim().length >= 4) {
                          // URL checker checks if the url is 4 or more characters and it has a period in it
                          // Its very easy to get past this, but if the user does, the worst that could happen is the icon will show up as the no url found icon
                          if (directLinkInputState.includes(".")) {
                            props.setIsLinkState(true);
                            setIsLinkState(true);
                            const response = await fetch(
                              `https://www.google.com/s2/favicons?domain=${directLinkInputState}`
                            );
                            if (!response.ok) {
                              props.setImageIsValidState(false);
                            } else {
                              props.setImageIsValidState(true);
                            }
                          } else {
                            props.setIsLinkState(false);
                            setIsLinkState(false);
                          }
                        } else {
                          props.setIsLinkState(false);
                          setIsLinkState(false);
                        }
                      } else {
                        console.log("NO UPDATE");
                      }

                      setEditModeState(false);
                      setSaveButtonDisabledState(false); // Allow save button to be clicked again after update processs is finished
                    }}
                  >
                    Save
                  </button>
                ) : null}
              </td>
            </tr>
            <tr className={classes.cancelRow}>
              <td>
                {editModeState ? (
                  <button
                    className={classes.cancelButtonUpdate}
                    onClick={() => {
                      setEditModeState(false);
                      setNameInputState(props.name);
                      setEmailInputState(props.email);
                      setPasswordInputState(props.password);
                      setDirectLinkInputState(props.directLink);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </td>
            </tr>
            <tr className={classes.deleteRow}>
              <td>
                {!editModeState ? (
                  <button
                    className={classes.deleteQueryButton}
                    onClick={async () => {
                      setConfirmDeletePopupState(true); // Shows confirm delete popup
                      setFinalDeleteButtonDisabledState(false); // Enables the final delete button
                      props.setTabState(false); // Hides the update tab (however, we are still keeping popupActiveState equal to true because the confirm delete popup is going to be on the screen)
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </td>
            </tr>
          </tfoot>
        </table>
      </animated.div>
      {confirmDeletePopupState ? (
        <div className={classes.deleteQueryPopup}>
          <div className={classes.confirmDeleteWrapper}>
            <h2 id={classes.confirmDeleteText}>
              Are you sure you want to delete {nameInputState}
            </h2>
            <button
              id={classes.finalCancelButton}
              onClick={() => {
                props.setKeepOpacityNormalOnPopupState(
                  false
                ); /* If a different popup (such as the add password popup) is
              opened after this is canceled, the opacity of the background will dim */
                props.setPopupActiveState(false); // This will allow other popups to be opened since this one will be closed. Because while this is true, no other popup can open
                setFinalDeleteButtonDisabledState(true);
                setConfirmDeletePopupState(false);
              }}
            >
              Cancel
            </button>
            <button
              disabled={finalDeleteButtonDisabledState}
              id={classes.finalDeleteButton}
              onClick={async () => {
                setFinalDeleteButtonDisabledState(
                  true
                ); /* Disables the delete button after its click once and will
            enable it when the process is canceled or returns an error (we don't have to enable it when the process
            is finished because the whole thing will be deleted if the process finishes). This is so the user can't spam delete requests */

                try {
                  await deleteUserQuery(props.queryDocumentID);
                  props.setPopupActiveState(false);
                  props.sethaveQueryExistingState(false);
                  setFinalDeleteButtonDisabledState(false);
                } catch (err) {
                  setFinalDeleteButtonDisabledState(false);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UpdateTab;
