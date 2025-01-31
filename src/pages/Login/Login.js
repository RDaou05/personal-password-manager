import { React, useState, useEffect, useLayoutEffect, useRef } from "react";
import classes from "./Login.module.css";
import logo from "../../images/lockIcon.png";
import googleLogo from "../../images/google.png";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { signOutUser, firebaseAuth } from "../../firebase.js";
import { signInToPersonalPMAccount, googleSignIn } from "../../firebase.js";

const Login = (props) => {
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  const [accountDisabledBoxState, accountDisabledBoxSetstate] = useState(false);
  const [errorHasOccuredBoxState, errorHasOccuredBoxSetState] = useState(false);
  const [autoLogState, setAutoLogState] = useState(null);
  const checkBoxRef = useRef();
  let navigate = useNavigate();

  useEffect(() => {
    const i = async () => {
      const a = localStorage.getItem("a");
      if (a == null) {
        console.log("NULLLLLLLLLLLLL");
        setAutoLogState(false);
      } else if (a == "true") {
        console.log("TTTTTTTTTT");
        try {
          const email = localStorage.getItem("e");
          const password = localStorage.getItem("p");
          await signInToPersonalPMAccount(email, password);
          props.loginDone(email, password, true);
          sendToAppSelectorPage();
        } catch (err) {
          console.log("CLEADRRRRDDD");
          props.clearLocal();
        }
      }
    };
    i();
  }, []);

  useLayoutEffect(() => {
    document.body.style.background = "rgb(40, 45, 52)";
  }, []);

  useLayoutEffect(() => {
    props.resetEmailVerifiedState(); /* There was an issue where if the user that logged in had done their verification, another
    user that has NOT done the verification could login right after and could be flagged as having done the 
    verification (But either way, they wouldn't be able to run any of the cloud functions, this is just for UI purposes)*/
    // resetEmailVerifiedState() fixes this issue because it resets the status of the state that says the user finished the verification every time the login page is loaded
  }, []);

  // This might be changed in the app selector page, so if they go back to the login, the color could be different
  // This makes sure that it says grey

  const sendToAppSelectorPage = () => {
    document.body.style.opacity = "1";
    navigate("/appselector", { replace: true });
  };

  const signInUser = async (email, password) => {
    document.body.style.opacity = "0.3";
    // First check if the user left any fields empty
    // If so, don't send sign in request
    if (email.trim() == "") {
      let emailBox = document.getElementById("emailInpBox");
      emailBox.style.borderBottom = "2px solid #844242";
      emailBox.style.transitionDuration = "0.2s";
      document.body.style.opacity = "1";
    } else if (password.trim() == "") {
      let passwordBox = document.getElementById("inpBox");
      passwordBox.style.borderBottom = "2px solid #844242";
      passwordBox.style.boxShadow = "none";
      passwordBox.style.transitionDuration = "0.2s";
      document.body.style.opacity = "1";
    } else {
      const signInReturn = await signInToPersonalPMAccount(email, password);
      if (typeof signInReturn == "string") {
        if (signInReturn.slice(0, 5) == "error") {
          // Error has occured
          document.body.style.opacity = "1";
          const errorCode = signInReturn.substring(7).trim();
          if (
            errorCode == "auth/invalid-email" ||
            errorCode == "auth/user-not-found"
          ) {
            let emailBox = document.getElementById("emailInpBox");
            let passwordBox = document.getElementById("inpBox");

            passwordBox.style.borderBottom = "2px solid #844242";
            emailBox.style.borderBottom = "2px solid #844242";
            passwordBox.style.transitionDuration = "0.2s";
            emailBox.style.transitionDuration = "0.2s";
            // document.getElementById("googleIcon").style.bottom = "17.5%";
          } else if (
            errorCode == "auth/wrong-password" ||
            errorCode == "auth/invalid-password"
          ) {
            let passwordBox = document.getElementById("inpBox");
            passwordBox.style.borderBottom = "2px solid #844242";
            passwordBox.style.transitionDuration = "0.2s";
            // document.getElementById("googleIcon").style.bottom = "18.5%";
          } else if (errorCode == "auth/user-disabled") {
            accountDisabledBoxSetstate(true);
          } else {
            document.getElementById("ableToDim").style.opacity = "0.1";
            errorHasOccuredBoxSetState(true);
            document.getElementById("ableToDim").style.pointerEvents = "none";
          }
        } else {
          // This probably won't run (since "signInReturn" only returns a string if it's an error)
          // But just incase something happens that I don't know about

          // No errors
          // console.log("Cheked? : ", staySignedIn);
          props.loginDone(email, password);
          sendToAppSelectorPage();
        }
      } else {
        // No errors
        // console.log("Cheked? : ", staySignedIn);
        props.loginDone(email, password);
        sendToAppSelectorPage();
      }
    }
  };

  const keepMeSignedInFunction = async () => {
    console.log(1);
  };

  // Making login page unresizeable
  let win = nw.Window.get();
  win.setResizable(true);
  win.unmaximize();
  win.leaveFullscreen();
  win.setMinimumSize(392, 518);
  win.resizeTo(392, 518);
  win.setResizable(false);

  const accountDisabledBox = (
    <div id={classes.accountDisabledMessage}>
      <h4>Account has been disabled.</h4>
      <h4>Please contact</h4>
      <h4 className={classes.supportEmail}>personal.pm.help.email@gmail.com</h4>
      <h4>if you weren't aware of this</h4>
      <button
        id={classes.continueAccountDisabled}
        onClick={() => {
          accountDisabledBoxSetstate(false);
          document.getElementById("ableToDim").style.opacity = "1";
        }}
      >
        Continue
      </button>
    </div>
  );

  const errorHasOccuredBox = (
    <div className={classes.errorHasOccuredBox}>
      <h3 id={classes.errorHasOccuredHeader}>
        An error has occurred signing in
      </h3>
      <h4 id={classes.pcText}>Please contact</h4>
      <h4 className={classes.supportEmail}>personal.pm.help.email@gmail.com</h4>
      <h4 id={classes.ifYouWerentAwareText}>if you need any assistance</h4>
      <button
        id={classes.continueErrorHasOccurred}
        onClick={() => {
          errorHasOccuredBoxSetState(false);
          document.getElementById("ableToDim").style.opacity = "1";
        }}
      >
        Continue
      </button>
    </div>
  );

  useEffect(() => {
    async function signInWithEnter(e) {
      if (e.key == "Enter") {
        await signInUser(
          document.getElementById("emailInpBox").value,
          document.getElementById("inpBox").value
        );
      }
    }
    document.addEventListener("keydown", signInWithEnter);
    return () => {
      document.removeEventListener("keydown", signInWithEnter);
    };
  });

  return (
    <>
      {autoLogState == false ? (
        <div className={classes.mainBodyContainer}>
          <span id="ableToDim">
            <div className={classes.keyImage}>
              <img id={classes.realIcon} src={logo} alt="not found" />
            </div>
            <h1 className={classes.enterMasterPassword}>
              Enter Email and Password
            </h1>
            <div className={classes.emailInputBoxContainer}>
              <input
                id="emailInpBox"
                className={classes.emailInputBox}
                type="text"
                placeholder="Email"
                autoComplete="off"
              />
            </div>
            <div className={classes.inputBoxContainer}>
              <input
                id="inpBox"
                className={classes.inputBox}
                type="password"
                placeholder="Password"
                autoComplete="off"
              />
              <div className={classes.eyeHolder}>
                <i id={classes.eye} className="far fa-eye"></i>
              </div>
            </div>
            <div className={classes.unlockContainer}>
              <button
                className={classes.unlockButton}
                id={classes.unlockButton}
                onClick={async () => {
                  await signInUser(
                    // The third argument is if the user wants to stay signed in or not
                    document.getElementById("emailInpBox").value,
                    document.getElementById("inpBox").value
                  );
                }}
              >
                <h4 id={classes.unlockText}>Unlock Password Manager</h4>
              </button>
            </div>
            {/* <div className={classes.keepMeSignedInContainer}>
              <input type="checkbox" id={classes.checkBox} ref={checkBoxRef} />
              <p
                id={classes.staySignedInText}
                onClick={() => {
                  // Check Box when the text is clicked, then add all stay signed in functionallity
                  if (checkBoxRef.current.checked == true) {
                    checkBoxRef.current.checked = false;
                  } else if (checkBoxRef.current.checked == false) {
                    checkBoxRef.current.checked = true;
                  }
                }}
              >
                Keep Me Signed In
              </p>
            </div> */}
            <div className={classes.forgotContainer}>
              <Link
                to="/forgotpass"
                className={classes.forgotPass}
                id={classes.forgotPass}
                replace={true}
              >
                Forgot Password
              </Link>
            </div>
            <Link to="/signup" id={classes.sendToSignUp} replace={true}>
              Don't have an account? Sign Up
            </Link>
          </span>
          {accountDisabledBoxState ? accountDisabledBox : null}
          {errorHasOccuredBoxState ? errorHasOccuredBox : null}
        </div>
      ) : null}
    </>
  );
};

export default Login;
