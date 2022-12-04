import { React, useState, useEffect, useLayoutEffect } from "react";
import classes from "./Login.module.css";
import logo from "../../images/lockIcon.png";
import googleLogo from "../../images/google.png";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { signOutUser, firebaseAuth } from "../../firebase.js";
import { signInToPersonalPMAccount, googleSignIn } from "../../firebase.js";

const Login = () => {
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  const [accountDisabledBoxState, accountDisabledBoxSetstate] = useState(false);
  const [errorHasOccuredBoxState, errorHasOccuredBoxSetState] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "rgb(40, 45, 52)";
    // return () => {
    //   cleanup
    // };
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
    if (email.trim() === "") {
      let emailBox = document.getElementById("emailInpBox");
      emailBox.style.backgroundColor = "#3d333c";
      emailBox.style.border = "2px solid #844242";
      emailBox.style.boxShadow = "none";
      emailBox.style.transitionDuration = "0.2s";
      document.body.style.opacity = "1";
    } else if (password.trim() === "") {
      let passwordBox = document.getElementById("inpBox");
      passwordBox.style.backgroundColor = "#3d333c";
      passwordBox.style.border = "2px solid #844242";
      passwordBox.style.boxShadow = "none";
      passwordBox.style.transitionDuration = "0.2s";
      document.body.style.opacity = "1";
    } else {
      const signInReturn = await signInToPersonalPMAccount(email, password);
      if (typeof signInReturn === "string") {
        if (signInReturn.slice(0, 5) === "error") {
          // Error has occured
          document.body.style.opacity = "1";
          const errorCode = signInReturn.substring(7).trim();
          if (
            errorCode === "auth/invalid-email" ||
            errorCode === "auth/user-not-found"
          ) {
            let emailBox = document.getElementById("emailInpBox");
            let passwordBox = document.getElementById("inpBox");

            emailBox.style.backgroundColor = "#3d333c";
            passwordBox.style.backgroundColor = "#3d333c";
            passwordBox.style.border = "2px solid #844242";
            emailBox.style.border = "2px solid #844242";
            emailBox.style.boxShadow = "none";
            passwordBox.style.boxShadow = "none";
            passwordBox.style.transitionDuration = "0.2s";
            emailBox.style.transitionDuration = "0.2s";
            document.getElementById("googleIcon").style.bottom = "17.5%";
          } else if (
            errorCode === "auth/wrong-password" ||
            errorCode === "auth/invalid-password"
          ) {
            let passwordBox = document.getElementById("inpBox");
            passwordBox.style.backgroundColor = "#3d333c";
            passwordBox.style.border = "2px solid #844242";
            passwordBox.style.boxShadow = "none";
            passwordBox.style.transitionDuration = "0.2s";
            document.getElementById("googleIcon").style.bottom = "18.5%";
          } else if (errorCode === "auth/user-disabled") {
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
          sendToAppSelectorPage();
        }
      } else {
        // No errors
        sendToAppSelectorPage();
      }
    }
  };
  const signInUserWithGoogle = async () => {
    document.body.style.opacity = "0.3";
    const googleSignInReturn = await googleSignIn();
    if (typeof googleSignInReturn === "string") {
      if (googleSignInReturn.slice(0, 5) === "error") {
        document.body.style.opacity = "1";
        const errorCode = googleSignInReturn.substring(7).trim();
        alert(errorCode);
        if (errorCode == "auth/user-disabled") {
          document.getElementById("ableToDim").style.opacity = "0.3";
          accountDisabledBoxSetstate(true);
        } else if (errorCode == "auth/popup-closed-by-user") {
          document.getElementById("ableToDim").style.opacity = "1";
        } else {
          document.getElementById("ableToDim").style.opacity = "0.3";
          errorHasOccuredBoxSetState(true);
        }
      } else {
        // This probably won't run (since "signInReturn" only returns a string if it's an error)
        // But just incase something happens that I don't know about

        // No errors
        sendToAppSelectorPage();
      }
    } else {
      sendToAppSelectorPage();
    }
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
      if (e.key === "Enter") {
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
          />
        </div>
        <div className={classes.inputBoxContainer}>
          <input
            id="inpBox"
            className={classes.inputBox}
            type="password"
            placeholder="Password"
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
                document.getElementById("emailInpBox").value,
                document.getElementById("inpBox").value
              );
            }}
          >
            <h4 id={classes.unlockText}>Unlock Password Manager</h4>
          </button>
        </div>
        <div className={classes.googleSignInContainer}>
          {/* <a className={classes.googleSignInButtonHref} href="#"> */}
          <button
            id={classes.googleSignInButton}
            type="button"
            onClick={signInUserWithGoogle}
          >
            <img src={googleLogo} id={classes.googleIcon} />
            <h4 id={classes.lgwg}>Login with google</h4>
          </button>
          {/* </a> */}
        </div>
        <div className={classes.forgotContainer}>
          <a href="#" className={classes.forgotPass} id={classes.forgotPass}>
            Forgot Master Password
          </a>
        </div>
        <Link to="/signup" id={classes.sendToSignUp} replace={true}>
          Don't have an account? Sign Up
        </Link>
      </span>
      {accountDisabledBoxState ? accountDisabledBox : null}
      {errorHasOccuredBoxState ? errorHasOccuredBox : null}
    </div>
  );
};

export default Login;
