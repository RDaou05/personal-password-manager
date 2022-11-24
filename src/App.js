import { React, useEffect, useLayoutEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import SignupPage from "./pages/Signup/Signup.js";
import LoginPage from "./pages/Login/Login.js";
import AppSelector from "./pages/AppSelector/AppSelector.js";
import Pm from "./pages/Pm/Pm.js";
import { signOutUser, FSDB, firebaseAuth } from "./firebase.js";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

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
  const [inactiveTimeoutState, setInactiveTimeoutState] = useState();

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      const rDoc = doc(FSDB, "users", "filler", user.uid, "al");
      return onSnapshot(rDoc, (snap) => {
        const recivedAutotime = snap.data().autotime.trim();
        console.log("Time trimmed: ", recivedAutotime.length);
        if (recivedAutotime == "") {
          setAutolockEnabledState(false);
          console.log("autolock disabled");
        } else {
          console.log("autolock enabled");
          setAutolockEnabledState(true);
          setAutolockTimeState(recivedAutotime);
        }
      });
    });
  }, []);

  useLayoutEffect(() => {
    // This checks if the user has autolock enabled
    // If they do, it will automatically start a count down to sign the user out and bring them back to the main login page
    // But this timer gets reset everytime the user interacts with the app
    let inactiveTimeout;
    let timeout;
    const onInteract = () => {
      if (location.pathname == "/") {
        window.removeEventListener("mousemove", onInteract);
        window.removeEventListener("keydown", onInteract);
      }
      clearTimeout(inactiveTimeout);
      inactiveTimeout = setTimeout(async () => {
        window.removeEventListener("mousemove", onInteract);
        window.removeEventListener("keydown", onInteract);
        window.removeEventListener("click", onInteract);
        await signOutUser();
        navigate("/", { replace: true });
      }, timeout);

      console.log(timeout / 60000, " minute timer has been reset");
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
      } else if (autolockTimeState == "2 hrs") {
        timeout = 7200000;
      }

      inactiveTimeout = setTimeout(() => {
        if (location.pathname == "/appselector") {
          signOutUser();
          navigate("/", { replace: true });
        } else if (location.pathname == "/pm") {
          navigate("/appselector", { replace: true });
        }
      }, timeout);

      window.addEventListener("mousemove", onInteract);
      window.addEventListener("keydown", onInteract);
      window.addEventListener("click", onInteract);
    }

    return () => {
      clearTimeout(inactiveTimeout);
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("click", onInteract);
    };
  }, [autolockEnabledState, autolockTimeState]);

  useEffect(() => {
    // There is a boolean value in the database called "disabled" inside a document called "disableAccount"
    // If the boolean is true, the user will be logged out of the account and they will not be allowed to log in

    /* NOTE: You can do this from the auth console, but if you change it to disable from there, the user still 
    has access to the account if they are already logged in 
    */

    // Changing this in the database will also disable the auth account using a cloud function for extra security

    if (firebaseAuth) {
      let disableCheck = onAuthStateChanged(firebaseAuth, (user) => {
        const disableDoc = doc(
          FSDB,
          "users",
          "filler",
          user.uid,
          "disableAccount"
        );
        return onSnapshot(disableDoc, (snap) => {
          const disabledBoolean = snap.data().disabled == true;
          if (disabledBoolean) {
            signOutUser();
            navigate("/", { replace: true });
          }
        });
      });
      return disableCheck;
    }
  }, [firebaseAuth]);

  useLayoutEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      const rDoc = doc(FSDB, "users", "filler", user.uid, "r");
      return onSnapshot(rDoc, (snap) => {
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
      });
    });
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
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
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
