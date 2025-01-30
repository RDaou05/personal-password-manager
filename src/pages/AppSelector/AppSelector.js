import { React, useEffect, useLayoutEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { signOutUser, FSDB, firebaseAuth } from "../../firebase.js";
import { Link, useNavigate } from "react-router-dom";
import normalClasses from "./AppSelector.module.css";
import aminClasses from "./AminPurple.module.css";
import blackClasses from "./Black.module.css";
import premiumPurpleClasses from "./PremiumPurple.module.css";
import frostClasses from "./Frost.module.css";
import greyClasses from "./Grey.module.css";
import errorClasses from "./ErrorClasses.module.css";
import MfaBox from "../../components/MfaBox.js";
import { onAuthStateChanged } from "firebase/auth";
import ErrorHasOccuredBox from "./ErrorHasOccuredBox.js";
import MainAppHTML from "./MainAppHTML.js";
import { givePRole } from "../../firebase";
import PleaseVerify from "./PleaseVerify";
import LoadingScreen from "../../components/LoadingScreen.js";

const AppSelector = (props) => {
  let navigate = useNavigate();
  const [inPreviewState, setInPreviewState] = useState(false);
  const [themeSelectState, setThemeSelectState] = useState(false);
  const [classes, setClassesState] = useState(normalClasses);
  const [firebaseEmail, setFirebaseEmail] = useState(
    firebaseAuth.currentUser.email
  );
  console.log("Hey: ", firebaseAuth);
  useLayoutEffect(() => {
    // If the user is role "p" or "a", we are checking local storage to see if they already have a set theme
    if (props.roleState == "a" || props.roleState == "p") {
      if (localStorage.getItem("pmTheme") !== null) {
        const localTheme = localStorage.getItem("pmTheme").trim();
        if (localTheme == "normalClasses") {
          setClassesState(normalClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to bottom right, #053f45, #0b817b)";
        } else if (localTheme == "aminClasses") {
          setClassesState(aminClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to left, #8e2de2, #4a00e0)";
        } else if (localTheme == "blackClasses") {
          setClassesState(blackClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to right, black 12%, #434343 95%)";
        } else if (localTheme == "premiumPurpleClasses") {
          setClassesState(premiumPurpleClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to right, #0f0c29, #302b63, #24243e)";
        } else if (localTheme == "frostClasses") {
          setClassesState(frostClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to right, #000428, #004e92)";
        } else if (localTheme == "greyClasses") {
          setClassesState(greyClasses);
          document.body.style.backgroundImage = "none";
          document.body.style.backgroundColor = "#282d34";
        }
      }
    }
  }, [props.roleState]);
  // useEffect(() => {
  //   // Signout user out when they press "Control + L"
  //   const signOutWithKeyPress = async (evt) => {
  //     if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 76) {
  //       if (!inPreviewState) {
  //         props.clearLocal();
  //         await signOutUser();
  //         sendToLoginPage();
  //       }
  //     }
  //   };
  //   // document.addEventListener("keydown", signOutWithKeyPress);
  //   return () => {
  //     // The listener will remove itself when the user navigates to another page
  //     document.removeEventListener("keydown", signOutWithKeyPress);
  //   };
  // }, [inPreviewState]);

  useEffect(() => {
    if (props.roleState == "ft") {
      // Reset to default settings if the user goes back to the "ft" role
      setClassesState(normalClasses);
      document.body.style.backgroundImage =
        "linear-gradient(to bottom right, #053f45, #0b817b)";
    } else if (props.roleState == "a" || props.roleState == "p") {
      // If the user upgrades to "p" or "a" and they are currently in preview mode, they will be taken out of it
      setInPreviewState(false);
    }
  }, [props.roleState]);

  useEffect(() => {
    return () => {
      // This return just makes sure the background is grey after leaving this page
      // (Role doesn't matter)
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#282d34";
      document.body.style.background = "#282d34";
    };
  }, []);

  const exitPreviewButton = (
    <div className={classes.exitPreviewContainer}>
      <button
        className={classes.exitPreview}
        onClick={() => {
          setInPreviewState(false);
          document.body.style.backgroundImage =
            "linear-gradient(to bottom right, #053f45, #0b817b)";
          setClassesState(normalClasses);
        }}
      >
        Exit preview
      </button>
    </div>
  );

  const sendToLoginPage = () => {
    navigate("/", { replace: true });
  };

  // Making app selector page resizeable
  let win = nw.Window.get();
  win.setResizable(true);
  win.unmaximize();
  win.leaveFullscreen();
  win.setMinimumSize(1020, 596);
  win.resizeTo(1020, 596);
  win.setResizable(false);

  return (
    <div>
      {props.emailVerifiedState ? (
        <>
          {props.roleState != false && props.roleState != "" ? (
            <>
              <div id="appSelectorMain">
                <MainAppHTML
                  navigate={navigate}
                  themeSelectState={themeSelectState}
                  mfaPassedState={props.mfaPassedState}
                  roleState={props.roleState}
                  classes={classes}
                  setClassesState={setClassesState}
                  setThemeSelectState={setThemeSelectState}
                  setInPreviewState={setInPreviewState}
                  inPreviewState={inPreviewState}
                />
                {inPreviewState ? exitPreviewButton : null}
                <div id={classes.backToLoginLinkContainer}>
                  <Link
                    className={classes.backToLoginLink}
                    to=""
                    onClick={async (event) => {
                      if (!inPreviewState) {
                        event.preventDefault();
                        await props.clearLocal();
                        await signOutUser();
                        sendToLoginPage();
                      }
                    }}
                    replace={true}
                    disabled={props.inPreviewState}
                  >
                    Log out • {firebaseEmail}
                  </Link>
                </div>
              </div>
            </>
          ) : props.roleState == false ? (
            <ErrorHasOccuredBox
              classes={classes}
              sendToLoginPage={sendToLoginPage}
              signOutUser={signOutUser}
              firebaseEmail={firebaseEmail}
            />
          ) : null}
        </>
      ) : props.emailVerifiedState == false ? (
        <PleaseVerify setEmailVerifiedState={props.setEmailVerifiedState} />
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};

export default AppSelector;
