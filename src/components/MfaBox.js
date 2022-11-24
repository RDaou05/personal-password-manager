import React, { useEffect, useRef } from "react";
import classes from "./MfaBox.module.css";
import { toDataURL } from "qrcode";
import { checkIfMFATokenIsCorrect } from "../firebase";

const MfaBox = (props) => {
  const firstBoxRef = useRef(null);
  const secondBoxRef = useRef(null);
  const thirdBoxRef = useRef(null);
  const fourthBoxRef = useRef(null);
  const fifthBoxRef = useRef(null);
  const sixthBoxRef = useRef(null);
  const allBoxes = [
    firstBoxRef,
    secondBoxRef,
    thirdBoxRef,
    fourthBoxRef,
    fifthBoxRef,
    sixthBoxRef,
  ];

  return (
    <div className={classes.mainMfaBox}>
      <h2 id={classes.mfaHeader}>Enter MFA Code</h2>

      <form
        className={classes.mfaForm}
        onInput={(e) => {
          // This listener makes it so when the user types in the first input box, it automatically focuses on the next one
          const keyPressed = e.nativeEvent.data;
          const inputBoxNumber = e.target.id.charAt(e.target.id.length - 1);
          // Can either be 1, 2, 3, 4, 5, or 6
          // It gets the last character of the input box ID that is being modified
          // The ID can be "mfaInput1", "mfaInput2", "mfaInput3"...
          if (keyPressed === null) {
            // Backspace was pressed
            document
              .getElementById(`mfaInput${parseInt(inputBoxNumber) - 1}`)
              .focus();
          } else {
            document
              .getElementById(`mfaInput${parseInt(inputBoxNumber) + 1}`)
              .focus();
          }
        }}
        onKeyDown={async (evt) => {
          if (evt.keyCode == 86 && (evt.ctrlKey || evt.metaKey)) {
            // ctrl v
            const textInClipboard = await navigator.clipboard.readText();
            if (textInClipboard.length == 6) {
              allBoxes.forEach((box) => {
                const currentBox = box.current;
                currentBox.value = textInClipboard.slice(
                  parseInt(currentBox.id.slice(8) - 1),
                  parseInt(currentBox.id.slice(8))
                );
              });
            }
          }
        }}
        onSubmit={async (e) => {
          e.preventDefault();
          let inputNumberList = [];

          for (let index = 0; index < 6; index++) {
            // Getting the value of each input box and combining it
            // Note: we have to do this because the input area for the mfa is multiple different input boxes combined, so we have to get the value of each of them
            inputNumberList.push(e.target[index].value);
          }
          const checkIfMFATokenIsCorrectCF = await checkIfMFATokenIsCorrect(
            props.hashBeingUsedToEncrypt,
            inputNumberList.join("")
          );
          if (checkIfMFATokenIsCorrectCF) {
            props.onMfaCorrect();
          } else {
            for (let index = 0; index < 6; index++) {
              e.target[index].style.borderLeft = "2px solid rgb(189, 35, 35)";
              e.target[index].style.borderTop = "2px solid rgb(189, 35, 35)";
              e.target[index].style.borderBottom = "2px solid rgb(189, 35, 35)";
              e.target[index].style.color = "rgb(189, 35, 35)";
              if (index === 5) {
                // 6th input box
                e.target[index].style.borderRight =
                  "2px solid rgb(189, 35, 35)";
              }
            }
          }
        }}
      >
        <div className={classes.inputContainer}>
          <input
            className={classes.mfaInputComponent}
            type="text"
            maxLength={1}
            id="mfaInput1"
            pattern="[0-9]"
            autoComplete="off"
            ref={firstBoxRef}
          />
          <input
            className={classes.mfaInputComponent}
            type="text"
            maxLength={1}
            id="mfaInput2"
            pattern="[0-9]"
            autoComplete="off"
            ref={secondBoxRef}
          />
          <input
            className={classes.mfaInputComponent}
            type="text"
            maxLength={1}
            id="mfaInput3"
            pattern="[0-9]"
            autoComplete="off"
            ref={thirdBoxRef}
          />
          <input
            className={classes.mfaInputComponent}
            type="text"
            maxLength={1}
            id="mfaInput4"
            pattern="[0-9]"
            autoComplete="off"
            ref={fourthBoxRef}
          />
          <input
            className={classes.mfaInputComponent}
            type="text"
            maxLength={1}
            id="mfaInput5"
            pattern="[0-9]"
            autoComplete="off"
            ref={fifthBoxRef}
          />
          <input
            className={classes.mfaInputComponent}
            type="text"
            maxLength={1}
            id="mfaInput6"
            pattern="[0-9]"
            autoComplete="off"
            ref={sixthBoxRef}
          />
        </div>

        <input type="submit" className={classes.confirmCode} />
      </form>

      <h2 onClick={props.logOut} id={classes.logout}>
        Log out • {props.email}
      </h2>
    </div>
  );
};

export default MfaBox;
