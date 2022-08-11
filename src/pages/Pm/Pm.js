import { React, useState, useEffect, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkIfMasterPasswordExists } from "../../firebase";
import PmSignup from "./PmSignup";
import PmLogin from "./PmLogin";
import classes from "./Pm.module.css";

const Pm = () => {
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  const [loginPassedState, setLoginPassedState] = useState(false);
  const [loginScreenState, setLoginScreenState] = useState(false);
  const [signupScreenState, setSignupScreenState] = useState(false);
  const [masterPasswordExistsState, setMasterPasswordExistsState] = useState();
  let navigate = useNavigate();

  const sendToAppSelectorPage = () => {
    navigate("/appselector", { replace: true });
  };

  useLayoutEffect(() => {
    const checkForMP = async () => {
      const mpExists = await checkIfMasterPasswordExists();
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
      if (evt.ctrlKey && evt.keyCode == 76) {
        sendToAppSelectorPage();
      }
    };
    document.addEventListener("keydown", signOutWithKeyPress);
    return () => {
      // The listener will remove itself when the user navigates to another page
      document.removeEventListener("keydown", signOutWithKeyPress);
    };
  }, []);

  return <div>{masterPasswordExistsState ? <PmLogin /> : <PmSignup />}</div>;
};

export default Pm;
