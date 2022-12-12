import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import MfaBox from "../../components/MfaBox";
import classes from "./Locker.module.css";
import { signOutUser, firebaseAuth } from "../../firebase";
import Gear from "../../components/Gear";
import aminClasses from "./styles/AminPurple.module.css";

const PlDashboard = (props) => {
  const navigate = useNavigate();
  const sendToLoginPage = () => {
    navigate("/", { replace: true });
  };
  const [firebaseEmail, setFirebaseEmail] = useState(
    firebaseAuth.currentUser.email
  );
  const [addPasswordScreenState, setAddPasswordScreenState] = useState(false);
  const [keepOpacityNormalOnPopupState, setKeepOpacityNormalOnPopupState] =
    useState(false);
  const [popupActiveState, popupActiveSetState] = useState(false);
  const [decryptedQueriesState, setDecryptedQueriesState] = useState(undefined);
  const [premiumClassesState, setPremiumClassesState] = useState();
  useLayoutEffect(() => {
    if (localStorage.getItem("plBool") == null) {
      localStorage.setItem("plBool", "true");
      setPremiumClassesState(true);
    } else if (localStorage.getItem("plBool") == "false") {
      setPremiumClassesState(false);
    } else if (localStorage.getItem("plBool") == "true") {
      setPremiumClassesState(true);
    }
  }, []);
  useLayoutEffect(() => {
    props.makeResizeable();
  }, []);

  useLayoutEffect(() => {
    document.body.style.opacity = "1";
    document.body.style.background = "rgb(40, 45, 52)";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.maxWidth = "none";
    document.body.style.overflow = "scroll";
    return () => {
      document.body.style.margin = "auto";
      document.body.style.maxWidth = "38rem";
      document.body.style.overflow = "hidden";
      document.body.style.marginTop = "4%";
      document.body.style.padding = "1rem";
    };
  }, []);

  const mainDash = (
    <div>
      <div
        style={{
          opacity:
            popupActiveState && !keepOpacityNormalOnPopupState ? "0.5" : "1",
        }}
      >
        <div className={classes.headerContainer}>
          <Gear setSettingsScreenstate={props.setSettingsScreenstate} />
          <h1
            id={premiumClassesState ? aminClasses.pmTitle : classes.pmTitle}
            onClick={() => {
              const currentLocal = localStorage.getItem("plBool");
              console.log(premiumClassesState);
              console.log("Cur loc: ", currentLocal);
              if (currentLocal == "false") {
                localStorage.setItem("plBool", "true");
                setPremiumClassesState(true);
              } else if (currentLocal == "true") {
                localStorage.setItem("plBool", "false");
                setPremiumClassesState(false);
              }
            }}
          >
            Personal Locker
          </h1>
          <button
            id={classes.addPasswordButton}
            onClick={() => {
              setAddPasswordScreenState(true);
              popupActiveSetState(true);
            }}
          >
            Add Password
          </button>
        </div>
      </div>
      {/* Add pass was here */}
    </div>
  );

  return (
    <div>
      {props.mfaIsEnabledState && !props.mfaPassedState ? (
        <MfaBox
          email={firebaseEmail}
          onMfaCorrect={() => {
            props.setMfaPassedState(true);
            props.setMfaBoxState(false);
          }}
          hashBeingUsedToEncrypt={props.hashBeingUsedToEncrypt}
          logOut={async () => {
            await signOutUser();
            sendToLoginPage();
          }}
          authenticatorKey={props.mfaKeyState}
        />
      ) : props.mfaPassedState ? (
        mainDash
      ) : null}
    </div>
  );
};

export default PlDashboard;
