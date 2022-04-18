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
  getAuth,
  signOut,
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

const auth = getAuth();

document.getElementById("backToLoginLink").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Sign out successful");
      document.getElementById("backToLoginLinkHidden").click();
    })
    .catch((error) => {
      // An error happened.
    });
});
