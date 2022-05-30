import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";

import {
  doc,
  getFirestore,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app-check.js";

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

import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-functions.js";

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

// Importing other themes
import { premiumGrey } from "/appSelectorStyles/greyPremium.js";
import { premiumAmin } from "/appSelectorStyles/aminPremium.js";
import { premiumFrost } from "/appSelectorStyles/frostPremium.js";
import { premiumBlack } from "/appSelectorStyles/blackPremium.js";
import { premiumPurple } from "/appSelectorStyles/purplePremium.js";
import { normalStyles } from "/appSelectorStyles/normalStyles.js";

const auth = getAuth();
const functions = getFunctions();

try {
  nw.App.clearCache();
  const app = initializeApp(firebaseConfig);
  console.log("running");
  nw.App.clearCache();
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6LciglofAAAAAD8hjB0f5kYV809r-t30PI8rYAQz"
    ),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
  });
  console.log("ran");
} catch (err) {
  console.log(err);
}

const db = getFirestore();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userUID = user.uid;
    console.log(userUID);

    const checkForMFA = async () => {
      const mfaDoc = await getDoc(doc(db, "users", "filler", userUID, "mfa"));

      const mfaSecretHex = mfaDoc.data().hex;
      console.log("SEHE: ", mfaSecretHex);
      let mfaIsEnabled;
      if (mfaSecretHex.trim() == "") {
        mfaIsEnabled = false;
      } else if (mfaSecretHex.trim() != "") {
        mfaIsEnabled = true;
      }

      /* If the user has mfa enabled, elements will load after user enters mfa code.
      If user has no mfa, html is loaded right away */
      const mainHTML = `
      <div class="themeSelectorContainer">
      <h1 id="closeThemeSelector">x</h1>
      <h2 id="themeSelectorHeader">PM themes</h2>
      <div class="backgroundGridContainer">
        <img
          id="backgroundGridItemPremiumAmin"
          class="backgroundGridItem"
          src="images/themes/purple-blue.png"
          alt="Image not available"
        />
        <img
          id="backgroundGridItemPremiumPurple"
          class="backgroundGridItem"
          src="images/themes/purple-classy.png"
          alt="Image not available"
        />
        <img
          id="backgroundGridItemNormalStyles"
          class="backgroundGridItem"
          src="images/themes/normal.png"
          alt="Image not available"
        />
        <img
          id="backgroundGridItemPremiumFrost"
          class="backgroundGridItem"
          src="images/themes/Frost.png"
          alt="Image not available"
        />
        <img
          id="backgroundGridItemPremiumBlack"
          class="backgroundGridItem"
          src="images/themes/black.png"
          alt="Image not available"
        />
        <img
          id="backgroundGridItemPremiumGrey"
          class="backgroundGridItem"
          src="images/themes/grey.png"
          alt="Image not available"
        />
      </div>
    </div>
    <div id="container">
      <div class="showPUIButtonContainer">
        <button class="showPUIButton">
          <span id="crownIcon">👑</span>
          <p id="showLayoutsText">Show Premium Layouts</p>
        </button>
      </div>
      <div class="exitPreviewContainer">
        <button class="exitPreview">Exit preview</button>
      </div>
      <div class="upgradeToPContainer">
        <button class="upgradeToP">
          <span id="lockIconUpgrade">🗝️</span>
          <p id="upgradeButtonText">Upgrade to premium</p>
        </button>
      </div>
      <div class="keyImage">
        <img id="realIcon" src="images/lockIcon.png" />
      </div>
      <h1 id="nameHeader">Personal PM</h1>
      <button id="takeToPMButton" class="redirectAppButtons">
        <i class="fas fa-key" id="keyPMIcon"></i>
        <p id="pmButtonText">Password Manager</p>
      </button>
      <button id="takeToLockerButton" class="redirectAppButtons">
        <i class="fas fa-folder" id="docLockerIcon"></i>
        <p id="lockerButtonText">Personal Locker</p>
      </button>
      <a href="mainPage.html" id="takeToPMLinkHidden"></a>
      <a href="locker.html" id="takeToLockerLinkHidden"></a>
      <a href="login.html" id="fromMainToLogin"></a>
    </div>
    <div id="backToLoginLinkContainer">
      <a href="#" id="backToLoginLink">Log Out</a>
    </div>
    <a href="login.html" id="backToLoginLinkHidden">Back to login</a>
    <span id="elementsFinishedLoading"></span> 
    <!-- If this span exists, that means the html has finished loading, then we can start the event listeners -->
      `;
      if (mfaIsEnabled) {
        console.log("En");
      } else if (mfaIsEnabled == false) {
        console.log("DIS");
        document.body.innerHTML = mainHTML;
      }
    };
    await checkForMFA();
    console.log(user);
    // Listeners to go to password manager and file manager
    document.getElementById("takeToPMButton").addEventListener("click", () => {
      document.getElementById("takeToPMLinkHidden").click();
    });
    document
      .getElementById("takeToLockerButton")
      .addEventListener("click", () => {
        document.getElementById("takeToLockerLinkHidden").click();
      });

    // Listener for logout button
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
    //
    const res = await user.getIdTokenResult(true);
    console.log("Res is: ", res);
    console.log("Claims are: ", res.claims);
    const aStatus = res.claims.a;
    const pStatus = res.claims.p;
    let hasPrivileges;

    const exitPreviewButton = Array.from(
      document.getElementsByClassName("exitPreview")
    )[0];
    const upgradeButtonContainer = Array.from(
      document.getElementsByClassName("upgradeToPContainer")
    )[0];
    Array.from(
      document.getElementsByClassName("upgradeToP")
    )[0].addEventListener("click", () => {
      document.body.style.pointerEvents = "none";
      document.body.style.opacity = "0.5";
      const givePRole = httpsCallable(functions, "givePRole");
      givePRole({ uid: auth.currentUser.uid }).then((result) => {
        console.log(result);
        auth.currentUser.getIdTokenResult(true).then((idTokenResult) => {
          console.log("the result ", idTokenResult);
          console.log("the result claims ", idTokenResult.claims);
          document.body.style.pointerEvents = "auto";
          document.body.style.opacity = "1";
        });
      });
    });
    exitPreviewButton.style.pointerEvents = "auto";
    // Keeping the exit preview always clickable is needed to allow the user to exit the preview whenever they want

    const showPremiumUIButton = Array.from(
      document.getElementsByClassName("showPUIButton")
    )[0];
    /* This allows premium users to change to different themes
      If the user is on the free trial, they will also be able to use this as a preview for the premium themes
      
      If this is the case and the user is on the free trial,
      clicks will be disabled since this is only a preview */
    showPremiumUIButton.addEventListener("click", () => {
      // Showing theme change window
      Array.from(
        document.getElementsByClassName("themeSelectorContainer")
      )[0].style.display = "initial";
      //

      // Dimming opacity of other elements
      document.getElementById("backToLoginLinkContainer").style.opacity = ".5";
      document.getElementById("container").style.opacity = ".5";
    });
    //
    if (!aStatus && !pStatus) {
      // Runs if user has free trial version
      hasPrivileges = false;
      // Making sure upgrade button is visible if using free trial
      upgradeButtonContainer.style.display = "initial";
      // Adds blue border when hovering over the two middle buttons
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
      hasPrivileges = true;

      /* Making sure user can't see the exit preview button if they are
        a premium memeber */
      exitPreviewButton.style.display = "none";

      // Making sure upgrade button is hidden if not using free trial
      upgradeButtonContainer.style.display = "none";

      let setLocalTheme = localStorage.getItem("pmTheme");
      setLocalTheme.trim();
      // Checking if the user already has a theme saved from local storage
      let premiumStyles;
      if (setLocalTheme != null) {
        if (setLocalTheme == "PremiumBlack") {
          premiumStyles = premiumBlack;
        } else if (setLocalTheme == "PremiumFrost") {
          premiumStyles = premiumFrost;
        } else if (setLocalTheme == "PremiumAmin") {
          premiumStyles = premiumAmin;
        } else if (setLocalTheme == "PremiumPurple") {
          premiumStyles = premiumPurple;
        } else if (setLocalTheme == "NormalStyles") {
          premiumStyles = normalStyles;
        } else if (setLocalTheme == "PremiumGrey") {
          premiumStyles = premiumGrey;
        } else {
          console.log("There shouldn't be an else");
        }
      } else {
        premiumStyles = normalStyles;
      }

      // Inserting style tag
      let premiumStyleSheet = document.createElement("style");
      premiumStyleSheet.textContent = premiumStyles;
      document.head.appendChild(premiumStyleSheet);
    }

    // Listener to change theme
    Array.from(document.getElementsByClassName("backgroundGridItem")).forEach(
      (clickedTheme) => {
        clickedTheme.addEventListener("click", (clickThemeEvt) => {
          // Determining selected theme
          let themeID = clickThemeEvt.target.id;
          let themeName = themeID.substring(18);
          console.log(themeName);
          let premiumStyles;
          if (themeName == "PremiumBlack") {
            premiumStyles = premiumBlack;
          } else if (themeName == "PremiumFrost") {
            premiumStyles = premiumFrost;
          } else if (themeName == "PremiumAmin") {
            premiumStyles = premiumAmin;
          } else if (themeName == "PremiumPurple") {
            premiumStyles = premiumPurple;
          } else if (themeName == "NormalStyles") {
            premiumStyles = normalStyles;
          } else if (themeName == "PremiumGrey") {
            premiumStyles = premiumGrey;
          } else {
            console.log("There shouldn't be an else");
          }
          // Inserting selected styles
          let premiumStyleSheet = document.createElement("style");
          premiumStyleSheet.textContent = premiumStyles;
          document.head.appendChild(premiumStyleSheet);
          if (!hasPrivileges) {
            // Not allowing clicks since the user is in free trial preview
            document.getElementById("container").style.pointerEvents = "none";
            document.getElementById(
              "backToLoginLinkContainer"
            ).style.pointerEvents = "none";

            exitPreviewButton.style.display = "initial";
            upgradeButtonContainer.style.display = "none"; // Hiding upgrade button since exit button is taking up space
          } else {
            // If they have premium, store the selected theme in local storage
            localStorage.setItem("pmTheme", themeName);
          }

          // Automatically close theme window after select theme
          document.getElementById("closeThemeSelector").click();
        });
      }
    );

    // listener to close theme selector window
    document
      .getElementById("closeThemeSelector")
      .addEventListener("click", () => {
        // Hiding theme change window
        Array.from(
          document.getElementsByClassName("themeSelectorContainer")
        )[0].style.display = "none";

        // Making sure elements are back to max opacity
        document.getElementById("backToLoginLinkContainer").style.opacity = "1";
        document.getElementById("container").style.opacity = "1";

        document;
        // Making sure elements are clickable again if user has premium or is an admin
        // Since they are in the preview still here, allowing them to click would make it being a preview pointless
        // Only allow clicks for free trial users if they exit the premium UI preview
        if (hasPrivileges) {
          document.getElementById("container").style.pointerEvents = "auto";
          document.getElementById(
            "backToLoginLinkContainer"
          ).style.pointerEvents = "auto";
        }

        // Even if user is in free trial, they can still switch to different themes in the preview
        Array.from(
          document.getElementsByClassName("showPUIButton")
        )[0].style.pointerEvents = "auto";
      });

    // Listener to close out of premium theme preview
    Array.from(
      document.getElementsByClassName("exitPreview")
    )[0].addEventListener("click", () => {
      Array.from(document.head.getElementsByTagName("style")).forEach(
        /* 
          This for loop deletes all of the style tags that were added for
          the preview. The reason that we are checking that there is no
          ID is because the font awesome library adds its own style tags.
          But we can differentiate between these style tags because ours
          dont have an id on the style tags, unlike the ones added by 
          font awesome
          */
        (styleTag) => {
          if (styleTag.id.trim().length == 0) {
            styleTag.remove();
          }
        }
      );

      // Allowing clicks again
      document.getElementById("container").style.pointerEvents = "auto";
      document.getElementById("backToLoginLink").style.pointerEvents = "auto";

      // Hiding exit preview button after click
      Array.from(
        document.getElementsByClassName("exitPreview")
      )[0].style.display = "none";

      // Reshowing upgrade button since exit preview button is gone now
      upgradeButtonContainer.style.display = "initial";
    });
    document.getElementById(
      "backToLoginLink"
    ).textContent = `Log out • ${user.email}`;
    // ...
    // });
  } else {
    // User is signed out
    // ...
  }
});
