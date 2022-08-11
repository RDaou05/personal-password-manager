import { React, useEffect, useLayoutEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { signOutUser, FSDB, firebaseAuth } from "../../firebase.js";
import { Link, useNavigate } from "react-router-dom";
import normalClasses from "./AppSelector.module.css";
import aminClasses from "./AminPurple.module.css";
import blackClasses from "./Black.module.css";
import premiumPurpleClasses from "./PremiumPurple.module.css";
import frostClasses from "./Frost.module.css";
import greyClasses from "./Grey.module.css";
import errorClasses from "./ErrorClasses.module.css";
import logo from "../../images/lockIcon.png";
import blackThemePic from "../../images/themes/black.png";
import frostThemePic from "../../images/themes/Frost.png";
import greyThemePic from "../../images/themes/grey.png";
import normalThemePic from "../../images/themes/normal.png";
import purpleBlueThemePic from "../../images/themes/purple-blue.png";
import purpleClassyThemePic from "../../images/themes/purple-classy.png";
import MfaBox from "../../components/MfaBox.js";
import { onAuthStateChanged } from "firebase/auth";

const AppSelector = () => {
  console.log("rendered");
  // window.history.pushState(null, window.document.title, window.location.href);
  // This makes it so the user can't click the back or forward arrow on the mouse

  let navigate = useNavigate();
  // const userUID = firebaseAuth.currentUser.uid;
  const [mfaIsEnabledState, setMfaIsEnabledState] = useState();
  const [mfaBoxState, setMfaBoxState] = useState();
  const [mfaPassedState, setMfaPassedState] = useState(false);
  const [roleState, setRoleState] = useState("");
  const [inPreviewState, setInPreviewState] = useState(false);
  const [themeSelectState, setThemeSelectState] = useState(false);
  const [classes, setClassesState] = useState(normalClasses);
  const [mfaKeyState, setMfaKeyState] = useState();

  useLayoutEffect(() => {
    return onAuthStateChanged(firebaseAuth, (user) => {
      console.log("on auth 1");
      const rDoc = doc(FSDB, "users", "filler", user.uid, "r");
      return onSnapshot(rDoc, (snap) => {
        console.log("ROLE: ");
        if (
          snap.data().memb == "ft" ||
          snap.data().memb == "p" ||
          snap.data().memb == "a"
        ) {
          setRoleState(snap.data().memb);
        } else {
          // If any state is undefined, nothing will render
          setRoleState(undefined);
        }
      });
    });
  }, []);
  useLayoutEffect(() => {
    return onAuthStateChanged(firebaseAuth, async (user) => {
      console.log("on auth 2");
      const mfaDoc = doc(FSDB, "users", "filler", user.uid, "mfa");
      return onSnapshot(mfaDoc, (snap) => {
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
      });
    });
  }, []);

  useLayoutEffect(() => {
    // If the user is role "p" or "a", we are checking local storage to see if they already have a set theme
    if (roleState == "a" || roleState == "p") {
      if (localStorage.getItem("pmTheme") !== null) {
        const localTheme = localStorage.getItem("pmTheme").trim();
        if (localTheme == "normalClasses") {
          setClassesState(normalClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to bottom right, #053f45, #0b817b)";
        } else if (localTheme == "aminClasses") {
          setClassesState(aminClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to left, #8e2de2, #4a00e0)";
        } else if (localTheme == "blackClasses") {
          setClassesState(blackClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to right, black 12%, #434343 95%)";
        } else if (localTheme == "premiumPurpleClasses") {
          setClassesState(premiumPurpleClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to right, #0f0c29, #302b63, #24243e)";
        } else if (localTheme == "frostClasses") {
          setClassesState(frostClasses);
          document.body.style.backgroundImage =
            "linear-gradient(to right, #000428, #004e92)";
        } else if (localTheme == "greyClasses") {
          setClassesState(greyClasses);
          document.body.style.backgroundImage = "none";
          document.body.style.backgroundColor = "#282d34";
        }
      }
    }
  }, [roleState]);
  useEffect(() => {
    // Signout user out when they press "Control + L"
    const signOutWithKeyPress = async (evt) => {
      if (evt.ctrlKey && evt.keyCode == 76) {
        if (!inPreviewState) {
          await signOutUser();
          sendToLoginPage();
        }
      }
    };
    document.addEventListener("keydown", signOutWithKeyPress);
    return () => {
      // The listener will remove itself when the user navigates to another page
      document.removeEventListener("keydown", signOutWithKeyPress);
    };
  }, [inPreviewState]);

  useEffect(() => {
    if (roleState == "ft") {
      // Reset to default settings if the user goes back to the "ft" role
      setClassesState(normalClasses);
      document.body.style.backgroundImage =
        "linear-gradient(to bottom right, #053f45, #0b817b)";
    } else if (roleState == "a" || roleState == "p") {
      // If the user upgrades to "p" or "a" and they are currently in preview mode, they will be taken out of it
      setInPreviewState(false);
    }
  }, [roleState]);

  useEffect(() => {
    return () => {
      // This return just makes sure the background is grey after leaving this page
      // (Role doesn't matter)
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#282d34";
      document.body.style.background = "#282d34";
    };
  }, []);

  const [firebaseEmail, setFirebaseEmailState] = useState();
  onAuthStateChanged(firebaseAuth, (user) => {
    console.log("on auth 3");
    setFirebaseEmailState(user.email);
  });

  const errorHasOccuredBox = (
    // This error box shows when a state is undefined
    <div className={errorClasses.errorHasOccuredBox}>
      <h3 id={errorClasses.errorHasOccuredHeader}>An error has occurred</h3>
      <h4 id={errorClasses.pcText}>Please contact</h4>
      <h4 className={errorClasses.supportEmail}>
        personal.pm.help.email@gmail.com
      </h4>
      <h4 id={errorClasses.ifYouWerentAwareText}>if you need any assistance</h4>
      <Link
        className={classes.backToLoginLink}
        to=""
        onClick={async (event) => {
          if (!inPreviewState) {
            event.preventDefault();
            await signOutUser();
            sendToLoginPage();
          }
        }}
        replace={true}
      >
        Log out • {firebaseEmail}
      </Link>
    </div>
  );
  const themeSelectorPopup = (
    <div className={classes.themeSelectorContainer}>
      {console.log(
        "THEME SELECTOR SHOWED .......................................................\n......................"
      )}
      <h1
        id={classes.closeThemeSelector}
        onClick={() => {
          // Hides theme selector window after clicking on "X" button
          setThemeSelectState(false);
          console.log("CLOSED from x button");
        }}
      >
        x
      </h1>
      <h1 id={classes.themeSelectorHeader}>PM themes</h1>
      <div className={classes.backgroundGridContainer}>
        <img
          id={classes.backgroundGridItemPremiumAmin}
          className={classes.backgroundGridItem}
          src={purpleBlueThemePic}
          alt="Image not available"
          onClick={() => {
            if (roleState == "ft") {
              setInPreviewState(true);
            } else {
              setInPreviewState(false);
              localStorage.setItem("pmTheme", "aminClasses");
            }
            setClassesState(aminClasses);
            setThemeSelectState(false); // Hides window after user selects an image
            console.log("CLOSED amin");
            document.body.style.backgroundImage =
              "linear-gradient(to left, #8e2de2, #4a00e0)";
          }}
        />
        <img
          id={classes.backgroundGridItemPremiumPurple}
          className={classes.backgroundGridItem}
          src={purpleClassyThemePic}
          alt="Image not available"
          onClick={() => {
            if (roleState == "ft") {
              setInPreviewState(true);
            } else {
              setInPreviewState(false);
              localStorage.setItem("pmTheme", "premiumPurpleClasses");
            }
            setClassesState(premiumPurpleClasses);
            setThemeSelectState(false); // Hides window after user selects an image
            console.log("CLOSED premium p");
            document.body.style.backgroundImage =
              "linear-gradient(to right, #0f0c29, #302b63, #24243e)";
          }}
        />
        <img
          id={classes.backgroundGridItemNormalStyles}
          className={classes.backgroundGridItem}
          src={normalThemePic}
          alt="Image not available"
          onClick={() => {
            if (roleState != "ft") {
              localStorage.setItem("pmTheme", "normalClasses");
            }
            setInPreviewState(false);
            setThemeSelectState(false); // Hides window after user selects an image
            console.log("CLOSED normal");
            setClassesState(normalClasses);
            document.body.style.backgroundImage =
              "linear-gradient(to bottom right, #053f45, #0b817b)";
          }}
        />
        <img
          id={classes.backgroundGridItemPremiumFrost}
          className={classes.backgroundGridItem}
          src={frostThemePic}
          alt="Image not available"
          onClick={() => {
            if (roleState == "ft") {
              setInPreviewState(true);
            } else {
              setInPreviewState(false);
              localStorage.setItem("pmTheme", "frostClasses");
            }
            setClassesState(frostClasses);
            setThemeSelectState(false); // Hides window after user selects an image
            console.log("CLOSED frost");
            document.body.style.backgroundImage =
              "linear-gradient(to right, #000428, #004e92)";
          }}
        />
        <img
          id={classes.backgroundGridItemPremiumBlack}
          className={classes.backgroundGridItem}
          src={blackThemePic}
          alt="Image not available"
          onClick={() => {
            if (roleState == "ft") {
              setInPreviewState(true);
            } else {
              setInPreviewState(false);
              localStorage.setItem("pmTheme", "blackClasses");
            }
            setClassesState(blackClasses);
            setThemeSelectState(false); // Hides window after user selects an image
            console.log("CLOSED black");
            document.body.style.backgroundImage =
              "linear-gradient(to right, black 12%, #434343 95%)";
          }}
        />
        <img
          id={classes.backgroundGridItemPremiumGrey}
          className={classes.backgroundGridItem}
          src={greyThemePic}
          alt="Image not available"
          onClick={() => {
            if (roleState == "ft") {
              setInPreviewState(true);
            } else {
              setInPreviewState(false);
              localStorage.setItem("pmTheme", "greyClasses");
            }
            setClassesState(greyClasses);
            setThemeSelectState(false); // Hides window after user selects an image
            console.log("CLOSED grey");
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = "#282d34";
          }}
        />
      </div>
    </div>
  );
  const exitPreviewButton = (
    <div className={classes.exitPreviewContainer}>
      <button
        className={classes.exitPreview}
        onClick={() => {
          setInPreviewState(false);
          document.body.style.backgroundImage =
            "linear-gradient(to bottom right, #053f45, #0b817b)";
          setClassesState(normalClasses);
        }}
      >
        Exit preview
      </button>
    </div>
  );
  const mainAppHTML = (
    <div>
      <div id={classes.container}>
        <div className={classes.showPUIButtonContainer}>
          <button
            className={classes.showPUIButton}
            onClick={() => {
              setThemeSelectState(true);
              console.log("CLOSED not closed");
            }}
          >
            <span id={classes.crownIcon}>👑</span>
            <p id={classes.showLayoutsText}>Show Premium Layouts</p>
          </button>
        </div>
        {roleState == "ft" && !inPreviewState ? (
          <div className={classes.upgradeToPContainer}>
            <button className={classes.upgradeToP}>
              <span id={classes.lockIconUpgrade}>🗝️</span>
              <p id={classes.upgradeButtonText}>Upgrade to premium</p>
            </button>
          </div>
        ) : null}
        <div className={classes.keyImage}>
          <img id={classes.realIcon} src={logo} />
        </div>
        <h1 id={classes.nameHeader}>Personal PM</h1>
        <button
          id={classes.takeToPMButton}
          className={classes.redirectAppButtons}
          onClick={() => {
            navigate("/pm", { replace: true });
          }}
        >
          <i className="fas fa-key" id={classes.keyPMIcon}></i>
          <p id={classes.pmButtonText}>Password Manager</p>
        </button>
        <button
          id={classes.takeToLockerButton}
          className={classes.redirectAppButtons}
        >
          <i className="fas fa-folder" id={classes.docLockerIcon}></i>
          <p id={classes.lockerButtonText}>Personal Locker</p>
        </button>
      </div>
    </div>
  );
  const sendToLoginPage = () => {
    navigate("/", { replace: true });
  };
  // Making app selector page resizeable
  let win = nw.Window.get();
  win.setResizable(true);
  win.resizeTo(1020, 570);

  return (
    <div>
      {mfaIsEnabledState != undefined &&
      mfaBoxState != undefined &&
      mfaPassedState != undefined &&
      roleState != undefined &&
      inPreviewState != undefined &&
      themeSelectState != undefined &&
      classes != undefined ? (
        <div id="appSelectorMain">
          {themeSelectState && mfaPassedState
            ? themeSelectorPopup
            : console.log("theme POP is null")}
          {mfaIsEnabledState && !mfaPassedState ? ( // Showing the MFA box if mfa is enabled and the mfa check hasn't been passed
            <MfaBox
              email={firebaseEmail}
              onMfaCorrect={() => {
                setMfaPassedState(true);
                setMfaBoxState(false);
              }}
              logOut={async () => {
                await signOutUser();
                sendToLoginPage();
              }}
              authenticatorKey={mfaKeyState}
            />
          ) : mfaPassedState ? (
            mainAppHTML
          ) : null}
          {inPreviewState && mfaPassedState ? exitPreviewButton : null}
          {mfaPassedState ? (
            <div id={classes.backToLoginLinkContainer}>
              <Link
                className={classes.backToLoginLink}
                to=""
                onClick={async (event) => {
                  if (!inPreviewState) {
                    event.preventDefault();
                    await signOutUser();
                    sendToLoginPage();
                  }
                }}
                replace={true}
              >
                Log out • {firebaseEmail}
              </Link>
            </div>
          ) : null}
          {console.log(
            "BOX STATE: ",
            mfaBoxState,
            "\n",
            "ENABLED STATE: ",
            mfaIsEnabledState,
            "\n",
            "PASSED STATE: ",
            mfaPassedState,
            "\n",
            "THEME BOX STATE: ",
            themeSelectState
          )}
        </div>
      ) : (
        errorHasOccuredBox
      )}
    </div>
  );
};

export default AppSelector;
