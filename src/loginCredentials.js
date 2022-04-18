// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";

// const gui = require("nw.gui");
// let win = gui.Window.get();
// win.on("resize", function (w, h) {
//   console.log("resized to", w, h);
// });
// win.resizeTo(392, 518);
// import { getAnalytics } from "firebase/analytics";
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-functions.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-auth.js";

import {
  doc,
  setDoc,
  getFirestore,
  collection,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  query,
  startAfter,
  orderBy,
  where,
  limit,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore(); // Changed from getDatabase() to getFirestore()
const functions = getFunctions();

console.log(auth.currentUser);
const provider = new GoogleAuthProvider();
// console.log(window.location.host);
document
  .getElementById("googleSignInButton")
  .addEventListener("click", async () => {
    document.body.style.opacity = ".4";
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        // const newUserDetermine = result._tokenResponse.isNewUser;
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        document.getElementById("takeToMain").click();
        console.log(credential);
        // ...
      })
      .catch((error) => {
        document.body.style.opacity = "1";
        console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);
        if (errorCode == "auth/user-disabled") {
          document.getElementById("ableToDim").style.opacity = "0.1";
          document.getElementById("accountDisabledMessage").style.display =
            "initial";
          document.getElementById("ableToDim").style.pointerEvents = "none";
        } else if (errorCode == "auth/popup-closed-by-user") {
          document.getElementById("ableToDim").style.opacity = "1";
        }
        // ...
      });
  });

// document.getElementById("realIcon").addEventListener("click", () => {
//   signOut(auth)
//     .then(() => {
//       console.log("Sign out successful");
//     })
//     .catch((error) => {
//       // An error happened.
//     });
//   const clearGoogleAuth = () => {
//     gapi.auth2.getAuthInstance().disconnect();
//   };
// });

document.body.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("emailInputBox") &&
    !e.target.classList.contains("inputBox")
  ) {
    if (
      e.target.classList.contains("unlockButton") ||
      e.target.id == "unlockText"
    ) {
      document.getElementById("googleIcon").style.bottom = "17.5%";
      console.log("unlockButton clicked");
    } else {
      if (
        document.getElementById("emailInpBox").style.border ==
          "2px solid rgb(132, 66, 66)" &&
        document.getElementById("inpBox").style.border ==
          "2px solid rgb(132, 66, 66)"
      ) {
        document.getElementById("googleIcon").style.bottom = "17.5%";
        console.log("unlockButton not clicked. Classlist is ", e.target.id);
      } else if (
        document.getElementById("inpBox").style.border ==
        "2px solid rgb(132, 66, 66)"
      ) {
        document.getElementById("googleIcon").style.bottom = "18.5%";
        console.log("unlockButton not clicked. Classlist is ", e.target.id);
      } else {
        document.getElementById("googleIcon").style.bottom = "19%";
        console.log("unlockButton not clicked. Classlist is ", e.target.id);
      }
    }
  }
  // if (
  //   e.target.classList.contains("unlockContainer") ||
  //   e.target.classList.contains("googleSignInButtonHref")
  // ) {
  //   document.getElementById("googleIcon").style.bottom = "19.5%";
  //   console.log("Returner clicked");
  // }
});

document.getElementById("emailInpBox").addEventListener("click", () => {
  if (
    document.getElementById("inpBox").style.border !=
      "2px solid rgb(132, 66, 66)" ||
    document.getElementById("emailInpBox").style.border !=
      "2px solid rgb(132, 66, 66)"
  ) {
    document.getElementById("googleIcon").style.bottom = "18.5%";
  }
});
document.getElementById("inpBox").addEventListener("click", () => {
  if (
    document.getElementById("inpBox").style.border !=
      "2px solid rgb(132, 66, 66)" ||
    document.getElementById("emailInpBox").style.border !=
      "2px solid rgb(132, 66, 66)"
  ) {
    document.getElementById("googleIcon").style.bottom = "18.5%";
  }
});

document.getElementById("unlockButton").addEventListener("click", () => {
  let email = document.getElementById("emailInpBox").value;
  let password = document.getElementById("inpBox").value;

  if (email.trim() != " ".trim() && password.trim() != " ".trim()) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        console.log("Added login");
        document.getElementById("takeToMain").click();
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        if (
          errorCode == "auth/invalid-email" ||
          errorCode == "auth/user-not-found"
        ) {
          let emailBox = document.getElementById("emailInpBox");
          let passwordBox = document.getElementById("inpBox");

          emailBox.style.backgroundColor = "#3d333c";
          passwordBox.style.backgroundColor = "#3d333c";
          emailBox.style.border = "2px solid #844242";
          passwordBox.style.border = "2px solid #844242";
          emailBox.style.boxShadow = "none";
          passwordBox.style.boxShadow = "none";
          passwordBox.style.transitionDuration = "0.2s";
          emailBox.style.transitionDuration = "0.2s";
          document.getElementById("googleIcon").style.bottom = "17.5%";
        } else if (
          errorCode == "auth/wrong-password" ||
          errorCode == "auth/invalid-password"
        ) {
          let passwordBox = document.getElementById("inpBox");

          passwordBox.style.backgroundColor = "#3d333c";
          passwordBox.style.border = "2px solid #844242";
          passwordBox.style.boxShadow = "none";
          passwordBox.style.transitionDuration = "0.2s";
          document.getElementById("googleIcon").style.bottom = "18.5%";
        } else if (errorCode == "auth/user-disabled") {
          document.getElementById("ableToDim").style.opacity = "0.1";
          document.getElementById("accountDisabledMessage").style.display =
            "initial";
          document.getElementById("ableToDim").style.pointerEvents = "none";
        }
      });
  } else {
    let emailBox = document.getElementById("emailInpBox");
    let passwordBox = document.getElementById("inpBox");

    emailBox.style.backgroundColor = "#3d333c";
    passwordBox.style.backgroundColor = "#3d333c";
    emailBox.style.border = "2px solid #844242";
    passwordBox.style.border = "2px solid #844242";
    emailBox.style.boxShadow = "none";
    passwordBox.style.boxShadow = "none";
    passwordBox.style.transitionDuration = "0.2s";
    emailBox.style.transitionDuration = "0.2s";
    document.getElementById("googleIcon").style.bottom = "17.5%";
  }
});

document
  .getElementById("continueAccountDisabled")
  .addEventListener("click", () => {
    document.getElementById("accountDisabledMessage").style.display = "none";
    document.getElementById("ableToDim").style.opacity = "1";
    document.getElementById("ableToDim").style.pointerEvents = "auto";
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    console.log(user);
    // ...
  } else {
    // User is signed out
    // ...
  }
});
