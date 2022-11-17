import { React, useEffect, useLayoutEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
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
  const [mfaIsEnabledState, setMfaIsEnabledState] = useState();
  const [mfaBoxState, setMfaBoxState] = useState();
  const [mfaPassedState, setMfaPassedState] = useState(false);
  const [mfaKeyState, setMfaKeyState] = useState();
  const [roleState, setRoleState] = useState("");

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
            navigate("/", { replace: true });
            signOutUser();
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
            />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
