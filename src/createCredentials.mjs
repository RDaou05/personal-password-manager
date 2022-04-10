// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-functions.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  getIdToken,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
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
try {
  const app = initializeApp(firebaseConfig);
} catch (err) {
  console.log(err);
}
// const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore(); // Changed from getDatabase() to getFirestore()
const functions = getFunctions();
console.log(functions);

document.getElementById("signUpButton").addEventListener("click", () => {
  let email = document.getElementById("emailInput").value;
  let password = document.getElementById("passwordInput").value;

  if (email.trim() != " ".trim() && password.trim() != " ".trim()) {
    let myVar;
    function executeIfNoErrors() {
      document.body.style.opacity = ".4";
      myVar = setTimeout(() => {
        window.localStorage.setItem("emailForSignIn", email.trim());
        takeToAppSelector.click();
      }, 5000);
    }
    function myStopFunction() {
      clearTimeout(myVar);
      document.body.style.opacity = "1";
    }
    executeIfNoErrors();
    // console.log(isEmailValid(email));
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Added login");
        const mainUser = auth.currentUser;
        mainUser.getIdTokenResult(true).then((idTokenResult) => {
          console.log("the result ", idTokenResult);
          console.log("the result claims ", idTokenResult.claims);
        });
        // async function mainInit() {
        //   async function init() {
        //     const signUpProperties = httpsCallable(
        //       functions,
        //       "signUpProperties"
        //     );
        //     signUpProperties({ uid: auth.currentUser.uid }).then((result) => {
        //       console.log(result);
        //       // auth.currentUser.getIdTokenResult(true).then((idTokenResult) => {
        //       //   console.log("the result ", idTokenResult);
        //       //   console.log("the result claims ", idTokenResult.claims);
        //       // });
        //     });
        //   }
        //   await init();
        //   setTimeout(() => {
        //     // takeToMain.click();
        //     console.log("WAIT");
        //   }, 10000);
        // }
        // mainInit();
      })
      .catch((error) => {
        // catching errors
        const errorCode = error.code;
        let errorTextElement = document.getElementById("errorText");
        if (errorCode == "auth/email-already-exists") {
          myStopFunction();
          errorTextElement.style.display = "initial";
          errorTextElement.textContent = "Email exists";
          errorTextElement.style.left = "37%";
        }
        if (errorCode == "auth/weak-password") {
          myStopFunction();
          errorTextElement.style.display = "initial";
          errorTextElement.textContent = "Weak password";
          errorTextElement.style.left = "31%";
        }
        if (errorCode == "auth/uid-already-exists") {
          myStopFunction();
          errorTextElement.style.display = "initial";
          errorTextElement.textContent = "User exists";
          errorTextElement.style.left = "38%";
        }
        if (errorCode == "auth/invalid-email") {
          myStopFunction();
          errorTextElement.style.display = "initial";
          errorTextElement.textContent = "Invalid Email";
          errorTextElement.style.left = "37%";
        }
        if (errorCode == "auth/email-already-in-use") {
          myStopFunction();
          errorTextElement.style.display = "initial";
          errorTextElement.textContent = "Email exists";
          errorTextElement.style.left = "37%";
        }
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // catching errors
      });
  } else {
    let emailBox = document.getElementById("emailInput");
    let passwordBox = document.getElementById("passwordInput");

    emailBox.style.backgroundColor = "#3d333c";
    passwordBox.style.backgroundColor = "#3d333c";
    emailBox.style.border = "1px solid #844242";
    passwordBox.style.border = "1px solid #844242";
    emailBox.style.boxShadow = "none";
    passwordBox.style.boxShadow = "none";
  }
});
