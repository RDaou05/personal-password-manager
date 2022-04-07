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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    alert("User is signed in. User is ", user.email);
    console.log(user);
    user.getIdTokenResult().then((res) => {
      console.log("Res is: ", res);
      console.log("Claims are: ", res.claims);
      const aStatus = res.claims.a;
      const pStatus = res.claims.p;
      let hasPrivileges;

      const exitPreviewButton = Array.from(
        document.getElementsByClassName("exitPreview")
      )[0];
      exitPreviewButton.style.pointerEvents = "auto";
      // Keeping the exit preview always clickable is needed to allow the user to exit the preview whenever they want

      //
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
        document.getElementById("container").style.pointerEvents = "none";
        document.getElementById(
          "backToLoginLinkContainer"
        ).style.pointerEvents = "none";
        // Dimming opacity of other elements
        document.getElementById("backToLoginLinkContainer").style.opacity =
          ".5";
        document.getElementById("container").style.opacity = ".5";
      });
      //
      if (!aStatus && !pStatus) {
        // Runs if user has free trial version
        hasPrivileges = false;
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

        const chooseThemeButton = Array.from(
          document.getElementsByClassName("showPUIButtonContainer")
        )[0];

        let premiumStyles = normalStyles;
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
              exitPreviewButton.style.display = "initial";
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
          document.getElementById("backToLoginLinkContainer").style.opacity =
            "1";
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
      });
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
