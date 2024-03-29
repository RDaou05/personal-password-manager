import { React, useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  checkIfMasterPasswordExists,
  firebaseAuth,
  FSDB,
  signOutUser,
} from "../../firebase";
import PmSignup from "./PmSignup";
import PmLogin from "./PmLogin";
import classes from "./Pm.module.css";
import PmDashboard from "./PmDashboard";
import PmSettingsPage from "./PmSettingsPage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import LoadingScreen from "../../components/LoadingScreen";

const Pm = (props) => {
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  const [loginPassedState, setLoginPassedState] = useState(false);
  const [hashBeingUsedToEncrypt, setHashBeingUsedToEncrypt] = useState();
  const [settingsScreenstate, setSettingsScreenstate] = useState(false);
  const [masterPasswordExistsState, setMasterPasswordExistsState] = useState();
  const [loadingScreenState, setLoadingScreenState] = useState(false);
  let navigate = useNavigate();
  const win = nw.Window.get();

  const sendToAppSelectorPage = () => {
    navigate("/appselector", { replace: true });
  };
  const sendToLoginPage = () => {
    navigate("/", { replace: true });
  };

  useLayoutEffect(() => {
    const checkForMP = async () => {
      setLoadingScreenState(true);
      const mpExists = await checkIfMasterPasswordExists();
      setLoadingScreenState(false);
      if (mpExists) {
        setMasterPasswordExistsState(true);
      } else {
        setMasterPasswordExistsState(false);
      }
    };
    checkForMP();
  }, []);
  useEffect(() => {
    // Signout user out when they press "Control + L"
    const signOutWithKeyPress = async (evt) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == 76) {
        sendToAppSelectorPage();
      }
    };
    document.addEventListener("keydown", signOutWithKeyPress);
    return () => {
      // The listener will remove itself when the user navigates to another page
      document.removeEventListener("keydown", signOutWithKeyPress);
    };
  }, []);
  console.log(
    "hashBeingUsedToEncrypt: ",
    hashBeingUsedToEncrypt,
    "\nmfaIsEnabledState: ",
    props.mfaIsEnabledState,
    "\nmfaBoxState: ",
    props.mfaBoxState,
    "\nmfaPassedState: ",
    props.mfaPassedState,
    "\nmfaKeyState: ",
    props.mfaKeyState,
    "\nautolockEnabledState: ",
    props.autolockEnabledState,
    "\nautolockTimeState: ",
    props.autolockTimeState,
    "\nemailVerifiedState: ",
    props.emailVerifiedState
  );
  return (
    <div>
      {loadingScreenState ? (
        <LoadingScreen />
      ) : (
        <>
          {props.emailVerifiedState ? (
            <>
              {loginPassedState == false ? (
                <>
                  {masterPasswordExistsState ? (
                    <PmLogin
                      loginPassed={(newMasterPasswordHash) => {
                        setHashBeingUsedToEncrypt(newMasterPasswordHash);
                        setLoginPassedState(true);
                      }}
                    />
                  ) : masterPasswordExistsState == false ? (
                    <PmSignup
                      loginPassed={(newMasterPasswordHash) => {
                        setHashBeingUsedToEncrypt(newMasterPasswordHash);
                        setLoginPassedState(true);
                        setMasterPasswordExistsState(true);
                      }}
                    />
                  ) : null}
                  {/* If I just made this an if/else statement, then the else condition would always
      render for a quick second even if the "if" condition should be the only one to render.
      This is because the state is automatically "undefined" before you assign it anything. And the "else" statement will render
      if the state is undefined. The "else" will render if the condition is "false" or "undefined". And the state will always
      be undefined for a quick second before you assign it a value. So if you just do "if true" and "else if false", nothing will happen until
      the state gets assigned true or false
      */}
                </>
              ) : loginPassedState ? (
                <>
                  {masterPasswordExistsState && settingsScreenstate == false ? (
                    <PmDashboard
                      makeResizeable={() => {
                        // Making page resizeable
                        win.setResizable(true);
                        win.maximize();
                        win.resizeTo(1440, 800);

                        // Note: This function will be executed right when the component renders
                        win.setMinimumSize(1150, 805);
                      }}
                      hashBeingUsedToEncrypt={hashBeingUsedToEncrypt}
                      setHashBeingUsedToEncrypt={setHashBeingUsedToEncrypt}
                      setSettingsScreenstate={setSettingsScreenstate}
                      setMfaIsEnabledState={props.setMfaIsEnabledState}
                      mfaIsEnabledState={props.mfaIsEnabledState}
                      setMfaBoxState={props.setMfaBoxState}
                      mfaBoxState={props.mfaBoxState}
                      setMfaPassedState={props.setMfaPassedState}
                      mfaPassedState={props.mfaPassedState}
                      setMfaKeyState={props.setMfaKeyState}
                      mfaKeyState={props.mfaKeyState}
                      autolockEnabledState={props.autolockEnabledState}
                      autolockTimeState={props.autolockTimeState}
                    />
                  ) : masterPasswordExistsState && settingsScreenstate ? (
                    <PmSettingsPage
                      logOut={async () => {
                        sendToLoginPage();
                        await signOutUser();
                      }}
                      closeSettings={() => {
                        setSettingsScreenstate(false);
                      }}
                      setHashBeingUsedToEncrypt={setHashBeingUsedToEncrypt}
                      hashBeingUsedToEncrypt={hashBeingUsedToEncrypt}
                      mfaIsEnabledState={props.mfaIsEnabledState}
                      setRoleState={props.setRoleState}
                      roleState={props.roleState}
                      setAutolockEnabledState={props.setAutolockEnabledState}
                      setAutolockTimeState={props.setAutolockTimeState}
                      autolockEnabledState={props.autolockEnabledState}
                      autolockTimeState={props.autolockTimeState}
                    />
                  ) : null}
                </>
              ) : null}
            </>
          ) : (
            <>{sendToAppSelectorPage()}</>
          )}
        </>
      )}
    </div>
  );
};

export default Pm;
