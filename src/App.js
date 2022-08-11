import { React, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import SignupPage from "./pages/Signup/Signup.js";
import LoginPage from "./pages/Login/Login.js";
import AppSelector from "./pages/AppSelector/AppSelector.js";
import Pm from "./pages/Pm/Pm.js";
import { signOutUser, FSDB, firebaseAuth } from "./firebase.js";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  let navigate = useNavigate();

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
          console.log("Disabled: ");
          if (disabledBoolean) {
            navigate("/", { replace: true });
            signOutUser();
          }
        });
      });
      return disableCheck;
    }
  }, [firebaseAuth]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/appselector" element={<AppSelector />}></Route>
        <Route path="/pm" element={<Pm />}></Route>
      </Routes>
    </div>
  );
}

export default App;
