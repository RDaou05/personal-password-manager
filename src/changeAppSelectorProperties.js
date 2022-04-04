// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  signOut,
  getIdTokenResult,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-auth.js";
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    alert("User is signed in. User is ", user.email);
    console.log(user);
    user.getIdTokenResult().then((res) => {
      console.log("Res is: ", res);
      console.log("Claims are: ", res.claims);
      const aStatus = res.claims.a;
      const pStatus = res.claims.p;
      const ftStatus = res.claims.ft;
      if (ftStatus) {
        let ftStyles = `
        .redirectAppButtons:hover {
          border: 2px solid rgb(1 255 242);
        }
        `;
        let ftStyleSheet = document.createElement("style");
        ftStyleSheet.textContent = ftStyles;
        document.head.appendChild(ftStyleSheet);
      }
      if (aStatus || pStatus) {
        let premiumStyles = `
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200&display=swap");

        *:focus {
          outline: 0 !important;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif;
          margin: auto;
          max-width: 38rem;
          padding-bottom: 14rem;
          /* background-color: #282d34; */
          background-image: linear-gradient(to bottom right, #053f45, #0b817b);
          overflow: hidden;
        }

        #container {
          display: grid;
          margin-top: 10%;
        }

        #realIcon {
          width: auto;
          height: 58px;
          -webkit-filter: drop-shadow(5px 5px 5px #222);
          filter: drop-shadow(5px 5px 5px #222);
        }

        .keyImage {
          text-align: center;
          margin-bottom: 6%;
        }

        #takeToLockerButton {
          background-color: #492084;
        }

        #takeToPMButton {
          background-color: #14887b;
        }

        .redirectAppButtons {
          padding: 4%;
          border-radius: 2vh;
          border: none;
          outline: none;
          text-align: center;
          margin-top: 4%;
          box-shadow: 0 20px 20px rgb(0 0 0 / 33%);
        }

        #takeToLockerLinkHidden {
          display: none;
        }
        #takeToPMLinkHidden {
          display: none;
        }

        #fromMainToLogin {
          display: none;
        }

        #backToLoginLinkContainer {
          text-align: center;
          margin-top: 11%;
        }

        #backToLoginLink {
          font-weight: 900;
          font-family: "Montserrat", sans-serif;
          font-size: 17px;
          user-select: none;
          background: linear-gradient(to right, #fedb37 0%, #fdb931 8%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        #backToLoginLink:hover {
          opacity: 0.7;
          margin-top: 0.5%;
          transition: all ease-in-out 0.1s;
        }

        #keyPMIcon {
          font-size: 22px;
          float: left;
        }

        #pmButtonText {
          color: black;
          font-family: "Montserrat", sans-serif;
          font-weight: bolder;
          font-size: 19px;
          margin: 0;
          margin-right: 3%;
        }

        #docLockerIcon {
          font-size: 22px;
          float: left;
        }

        #lockerButtonText {
          color: black;
          font-family: "Montserrat", sans-serif;
          font-weight: bolder;
          font-size: 19px;
          margin: 0;
          margin-right: 3%;
        }

        #backToLoginLinkHidden {
          display: none;
        }

        #nameHeader {
          background: linear-gradient(to right, #fedb37 0%, #fdb931 8%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: "Montserrat", sans-serif;
          margin-left: 34%;
          margin-top: 0;
        }

        #takeToPMButton {
          min-width: 300px;
          min-height: 60px;
          font-family: "Nunito", sans-serif;
          font-size: 22px;
          text-transform: uppercase;
          letter-spacing: 1.3px;
          font-weight: 700;
          color: #313133;
          background: #4fd1c5;
          background-image: linear-gradient(
            90deg,
            rgb(99, 207, 192) 0%,
            rgb(28, 171, 157) 100%
          );
          border: none;
          border-radius: 1000px;
          transition: all 0.2s ease-in-out 0s;
          cursor: pointer;
          outline: none;
          position: relative;
          padding: 10px;
        }

        #takeToPMButton::before {
          content: "";
          border-radius: 1000px;
          min-width: calc(300px + 12px);
          min-height: calc(60px + 12px);
          /* border: 6px solid #00ffcb; */
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.2s ease-in-out 0s;
        }

        #takeToPMButton:hover,
        #takeToPMButton:focus {
          color: #313133;
          transform: translateY(-2px);
          background-position: right center;
        }

        #takeToPMButton::after {
          content: "";
          width: 30px;
          height: 30px;
          border-radius: 100%;
          /* border: 6px solid #00ffcb; */
          position: absolute;
          z-index: -1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          /* animation: ring 1.5s infinite; */
        }

        #takeToPMButton:hover::after,
        #takeToPMButton:focus::after {
          animation: none;
          display: none;
        }

        /*  */
        /*  */
        /*  */

        #takeToLockerButton {
          min-width: 300px;
          min-height: 60px;
          margin-top: 5%;
          font-family: "Nunito", sans-serif;
          font-size: 22px;
          text-transform: uppercase;
          letter-spacing: 1.3px;
          font-weight: 700;
          color: #313133;
          background: #4fd1c5;
          background-image: linear-gradient(90deg, rgb(175 133 238) 0%, rgb(118 40 166) 100%);
          border: none;
          border-radius: 1000px;
          transition: all 0.2s ease-in-out 0s;
          cursor: pointer;
          outline: none;
          position: relative;
          padding: 10px;
        }

        #takeToLockerButton::before {
          content: "";
          border-radius: 1000px;
          min-width: calc(300px + 12px);
          min-height: calc(60px + 12px);
          /* border: 6px solid #00ffcb; */
          box-shadow: 0 0 60px rgba(0, 255, 203, 0.64);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: all 0.2s ease-in-out 0s;
        }

        #takeToLockerButton:hover,
        #takeToLockerButton:focus {
          color: #313133;
          transform: translateY(-2px);
        }

        #takeToLockerButton::after {
          content: "";
          width: 30px;
          height: 30px;
          border-radius: 100%;
          /* border: 6px solid #00ffcb; */
          position: absolute;
          z-index: -1;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          /* animation: ring 1.5s infinite; */
        }

        #takeToLockerButton:hover::after,
        #takeToLockerButton:focus::after {
          animation: none;
          display: none;
        }

        /* */

        button#takeToPMButton {
          margin-top: 6%;
        }
        `;
        let premiumStyleSheet = document.createElement("style");
        premiumStyleSheet.textContent = premiumStyles;
        document.head.appendChild(premiumStyleSheet);
      }
    });
    document.getElementById(
      "backToLoginLink"
    ).textContent = `Log out • ${user.email}`;
    // ...
  } else {
    alert("User is signed out");
    // User is signed out
    // ...
  }
});
