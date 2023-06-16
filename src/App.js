import { React, useEffect, useLayoutEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SignupPage from "./pages/Signup/Signup.js";
import LoginPage from "./pages/Login/Login.js";
import AppSelector from "./pages/AppSelector/AppSelector.js";
import Pm from "./pages/Pm/Pm.js";
import { signOutUser, FSDB, firebaseAuth, staySignedIn } from "./firebase.js";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { initializeApp } from "@firebase/app";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from "firebase/app-check";
import Pl from "./pages/Pl/Pl.js";
import ForgotPass from "./pages/ForgotPassword/ForgotPass.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3pL18gW3Ts88QX93bFhwmruuXLYmVKAo",
  authDomain: "personal-pm-98268.firebaseapp.com",
  databaseURL: "https://personal-pm-98268-default-rtdb.firebaseio.com",
  projectId: "personal-pm-98268",
  storageBucket: "personal-pm-98268.appspot.com",
  messagingSenderId: "507153717923",
  appId: "1:507153717923:web:192d2eff57f54195f4fd16",
  measurementId: "G-59QL5BNCX4",
};

// Initialize Firebase
const application = initializeApp(firebaseConfig);
// const appCheck = initializeAppCheck(application, {
//   provider: new ReCaptchaV3Provider("6LciglofAAAAAD8hjB0f5kYV809r-t30PI8rYAQz"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });

function App() {
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  let navigate = useNavigate();
  let location = useLocation();
  const [mfaIsEnabledState, setMfaIsEnabledState] = useState();
  const [mfaBoxState, setMfaBoxState] = useState();
  const [mfaPassedState, setMfaPassedState] = useState(false);
  const [mfaKeyState, setMfaKeyState] = useState();
  const [roleState, setRoleState] = useState("");
  const [autolockEnabledState, setAutolockEnabledState] = useState();
  const [autolockTimeState, setAutolockTimeState] = useState("");
  const [emailVerifiedState, setEmailVerifiedState] = useState(false);
  const [loginDoneState, setLoginDoneState] = useState(false);
  const [refresh, setRefresh] = useState();
  let intervalId = null;

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const rDoc = doc(FSDB, "users", "filler", user.uid, "al");
        return onSnapshot(rDoc, (snap) => {
          if (snap.data() != undefined) {
            const recivedAutotime = snap.data().autotime.trim();
            if (recivedAutotime == "") {
              setAutolockEnabledState(false);
            } else {
              setAutolockEnabledState(true);
              setAutolockTimeState(recivedAutotime);
            }
          }
        });
      }
    });
  }, [firebaseAuth]);

  useLayoutEffect(() => {
    try {
      return onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          const mfaDoc = doc(FSDB, "users", "filler", user.uid, "mfa");
          return onSnapshot(mfaDoc, (snap) => {
            if (snap.data() != undefined) {
              const mfaKey = snap.data().hex.trim();
              if (mfaKey == "") {
                setMfaIsEnabledState(false);
                setMfaBoxState(false);
                setMfaPassedState(true);
                setMfaKeyState(mfaKey);
              } else {
                setMfaPassedState(false);
                setMfaIsEnabledState(true);
                setMfaBoxState(true);
                setMfaKeyState(mfaKey);
              }
            }
          });
        }
      });
    } catch (err) {
      setMfaIsEnabledState("error");
    }
  }, [firebaseAuth]);

  useEffect(() => {
    // Checks if email is verified
    console.log(loginDoneState);
    if (loginDoneState) {
      if (firebaseAuth.currentUser.emailVerified) {
        setEmailVerifiedState(true);
        intervalId && clearInterval(intervalId);
      } else {
        setEmailVerifiedState(false);
      }
    }
  }, [loginDoneState]);

  useLayoutEffect(() => {
    // This checks if the user has autolock enabled
    // If they do, it will automatically start a count down to sign the user out and bring them back to the main login page
    // But this timer gets reset everytime the user interacts with the app
    let inactiveTimeout;
    let timeout;
    const onInteract = () => {
      console.log("Intercat");
      clearTimeout(inactiveTimeout);
      inactiveTimeout = setTimeout(async () => {
        if (location.pathname == "/pm") {
          console.log("B");
          console.log("Current: ", location.pathname);
          navigate("/appselector", { replace: true });
        }
        console.log(location.pathname);
        console.log(location);
        // navigate("/appselector", { replace: true });
        // clearTimeout(inactiveTimeout);
        // window.removeEventListener("mousemove", onInteract);
        // window.removeEventListener("keydown", onInteract);
        // window.removeEventListener("click", onInteract);
      }, timeout);
    };
    if (autolockEnabledState) {
      if (autolockTimeState == "1 min") {
        timeout = 60000;
      } else if (autolockTimeState == "5 mins") {
        timeout = 300000;
      } else if (autolockTimeState == "15 mins") {
        timeout = 900000;
      } else if (autolockTimeState == "30 mins") {
        timeout = 1800000;
      } else if (autolockTimeState == "1 hr") {
        timeout = 3600000;
      }

      inactiveTimeout = setTimeout(() => {
        if (location.pathname == "/pm") {
          console.log("2B");
          console.log("Current: ", location.pathname);
          navigate("/appselector", { replace: true });
        }
        console.log("2C" + location.pathname);
        console.log(location);
      }, timeout);

      window.addEventListener("mousemove", onInteract);
      window.addEventListener("keydown", onInteract);
      window.addEventListener("click", onInteract);
    } else {
      clearTimeout(inactiveTimeout);
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("click", onInteract);
    }

    return () => {
      clearTimeout(inactiveTimeout);
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("click", onInteract);
    };
  }, [autolockEnabledState, autolockTimeState, location]);

  useEffect(() => {
    // There is a boolean value in the database called "disabled" inside a document called "disableAccount"
    // If the boolean is true, the user will be logged out of the account and they will not be allowed to log in

    /* NOTE: You can do this from the auth console, but if you change it to disable from there, the user still 
    has access to the account if they are already logged in 
    */

    // Changing this in the database will also disable the auth account using a cloud function for extra security

    if (firebaseAuth) {
      let disableCheck = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          const disableDoc = doc(
            FSDB,
            "users",
            "filler",
            user.uid,
            "disableAccount"
          );
          return onSnapshot(disableDoc, (snap) => {
            if (snap.data() != undefined) {
              const disabledBoolean = snap.data().disabled;
              if (disabledBoolean) {
                signOutUser();
                navigate("/", { replace: true });
              }
            }
          });
        }
      });
      return disableCheck;
    }
  }, [firebaseAuth]);

  useLayoutEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        const rDoc = doc(FSDB, "users", "filler", user.uid, "r");
        return onSnapshot(rDoc, (snap) => {
          if (snap.data() != undefined) {
            if (
              snap.data().memb == "ft" ||
              snap.data().memb == "p" ||
              snap.data().memb == "a"
            ) {
              setRoleState(snap.data().memb);
            } else {
              // Wont render anything except an error message
              setRoleState(false);
            }
          }
        });
      }
    });
  }, [firebaseAuth]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              loginDone={async (staySignedInVar) => {
                console.log(await staySignedIn(staySignedInVar));
                setLoginDoneState(true);
              }}
              resetEmailVerifiedState={() => {
                setLoginDoneState(false);
              }}
            />
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <SignupPage
              loginDone={() => {
                setLoginDoneState(true);
              }}
            />
          }
        ></Route>
        <Route
          path="/appselector"
          element={
            <AppSelector
              setMfaIsEnabledState={setMfaIsEnabledState}
              mfaIsEnabledState={mfaIsEnabledState}
              setMfaBoxState={setMfaBoxState}
              mfaBoxState={mfaBoxState}
              setMfaPassedState={setMfaPassedState}
              mfaPassedState={mfaPassedState}
              setMfaKeyState={setMfaKeyState}
              mfaKeyState={mfaKeyState}
              setRoleState={setRoleState}
              roleState={roleState}
              emailVerifiedState={emailVerifiedState}
              setEmailVerifiedState={setEmailVerifiedState}
            />
          }
        ></Route>
        <Route
          path="/pm"
          element={
            <Pm
              setMfaIsEnabledState={setMfaIsEnabledState}
              mfaIsEnabledState={mfaIsEnabledState}
              setMfaBoxState={setMfaBoxState}
              mfaBoxState={mfaBoxState}
              setMfaPassedState={setMfaPassedState}
              mfaPassedState={mfaPassedState}
              setMfaKeyState={setMfaKeyState}
              mfaKeyState={mfaKeyState}
              setRoleState={setRoleState}
              roleState={roleState}
              autolockEnabledState={autolockEnabledState}
              autolockTimeState={autolockTimeState}
              emailVerifiedState={emailVerifiedState}
            />
          }
        ></Route>
        <Route
          path="/pl"
          element={
            <Pl
              setMfaIsEnabledState={setMfaIsEnabledState}
              mfaIsEnabledState={mfaIsEnabledState}
              setMfaBoxState={setMfaBoxState}
              mfaBoxState={mfaBoxState}
              setMfaPassedState={setMfaPassedState}
              mfaPassedState={mfaPassedState}
              setMfaKeyState={setMfaKeyState}
              mfaKeyState={mfaKeyState}
              setRoleState={setRoleState}
              roleState={roleState}
              autolockEnabledState={autolockEnabledState}
              autolockTimeState={autolockTimeState}
              emailVerifiedState={emailVerifiedState}
            />
          }
        ></Route>
        <Route path="/forgotpass" element={<ForgotPass />}></Route>
      </Routes>
    </div>
  );
}

export const app = application;
export default App;
