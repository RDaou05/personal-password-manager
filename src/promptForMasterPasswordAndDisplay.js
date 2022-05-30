// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
// import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js";

import {
  getAuth,
  onAuthStateChanged,
  getIdTokenResult,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-auth.js";

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app-check.js";

import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-functions.js";

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
  serverTimestamp,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";

// import {} from "nw.js";

const crypto = require("crypto");
const CryptoJS = require("crypto-js");
const zxcvbn = require("zxcvbn");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3pL18gW3Ts88QX93bFhwmruuXLYmVKAo",
  authDomain: "personal-pm-98268.firebaseapp.com",
  projectId: "personal-pm-98268",
  storageBucket: "personal-pm-98268.appspot.com",
  messagingSenderId: "507153717923",
  appId: "1:507153717923:web:192d2eff57f54195f4fd16",
  measurementId: "G-59QL5BNCX4",
};
// Initialize Firebase

export let hashedSetMasterPassValue; // Exporting the hash of the master password to encrypt and decrypt

try {
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
  const db = getFirestore(); // Changed from getDatabase() to getFirestore()
  async function mainInit() {
    // async function waitForAuth() {
    //   return getAuth();
    // }

    const auth = await getAuth();
    const functions = await getFunctions();
    let initiated = false; // Using this to check if the auth token has been refreshed or not
    onAuthStateChanged(auth, async (mainUser) => {
      if (!initiated) {
        if (mainUser) {
          async function generateRandomString(length) {
            let result = "";
            let characters =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
              result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
              );
            }
            return result; // Returns a VERY long random id
          }
          // Checks if user is signed in
          initiated = true; // Setting this to true makes it so this wont run again when the reauth happens
          const mainUser = auth.currentUser;
          let openUrlObject =
            {}; /* This is where we store the links that open when 
          the user clicks on the icon for a query. The reason this is being stored in an object is
          because if the user decides to update the link, we can just update the object. The
          object will contain the randomID of the query as the key, and the url as the value*/
          let currentEncryptedString = "";
          mainUser.getIdTokenResult().then((res) => {
            // Checking if user a free trial, premium, or admin
            console.log("Res is: ", res);
            console.log("Claims are: ", res.claims);
            const aStatus = res.claims.a;
            const pStatus = res.claims.p;
            const ftStatus = res.claims.ft;
            if (aStatus || pStatus) {
              // Adding premium css if paid member or admin
              let premiumStyles = `
              #titleHeader {
                background: linear-gradient(to right, #fedb37 0%, #fdb931 8%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              `;
              let premiumStyleSheet = document.createElement("style");
              premiumStyleSheet.innerHTML = premiumStyles;
              document.head.appendChild(premiumStyleSheet);
            }
          });
          const init = async () => {
            let userUID = mainUser.uid;
            console.log(userUID);
            let originalMarginTop = 0.0;
            let refForMainUID = doc(db, "users", "filler", userUID, "mpaps");

            let refForMSCheck = collection(
              /* This collection stores a string that is encrypted with the
            master pass. When the user logs in, it checks to see if the master password
            the user entered can be used to decrypt the string that is stored here. If it can,
            that means the master pass they entered is correct. If the decryption returns
            a blank string, that means it is the wrong master password*/
              db,
              "users",
              "filler",
              userUID,
              "mpaps",
              "ms"
            );
            // let refForPS = query(
            //   collection(db, "users", "filler", userUID, "mpaps", "ps"),
            //   orderBy("nummy", "desc") // "Nummy" is just the timestamp of creation
            // );

            async function checkIfEnteredMPIsCorrect(enteredMP) {
              let receivedMPH; // This is the random string that is encrypted with the master pass
              // See line 145 for more details
              if (currentEncryptedString.trim() == "") {
                const docSnapGetEncryptedString = await getDocs(refForMSCheck);
                console.log("got it again on line 144 (getDocs)");
                docSnapGetEncryptedString.forEach((doc) => {
                  receivedMPH = doc.data().mph;
                });
                /* "currentEncryptedString" is a string stored in the database
                that has been encrypted with the hash of the master password.
                If the hash of the master password that the user is trying to login with
                is able to decrypt the string, that means the entered master password is correct */
                currentEncryptedString = receivedMPH;
                /* We are storing the encrypted string (recievedMPH) as a variable (currentEncryptedString)
                so we don't have to make a read everytime we want to validate the master password */

                console.log("THE CES: ", currentEncryptedString);
                console.log("THE MINI RMPH: ", receivedMPH);
              } else {
                receivedMPH = currentEncryptedString;
                console.log("THE RMPH: ", receivedMPH);
              }

              const hashedEnteredMasterPassword = crypto
                .createHash("sha512")
                .update(enteredMP)
                .digest("hex");

              let decryptedMPString;
              try {
                decryptedMPString = CryptoJS.AES.decrypt(
                  receivedMPH,
                  hashedEnteredMasterPassword
                ).toString(CryptoJS.enc.Utf8);
                console.log("LOG: ", decryptedMPString);
              } catch {
                decryptedMPString = "";
              }

              // If the string fails to decrypt, it will return a blank string
              if (decryptedMPString.trim().length == 0) {
                return false;
              } else {
                return true;
              }
            }

            const dimAbleToDarken = () => {
              Array.from(
                document
                  .getElementById("ableToDarken")
                  .getElementsByTagName("div")
              ).forEach((cv) => {
                cv.style.opacity = "0.7";
              });
            };
            const resetDimAbleToDarken = () => {
              Array.from(
                document
                  .getElementById("ableToDarken")
                  .getElementsByTagName("div")
              ).forEach((cv) => {
                cv.style.opacity = "1";
              });
            };

            const changeMPWindow = Array.from(
              document.getElementsByClassName("changeMasterPasswordScreen")
            )[0];

            changeMPWindow.addEventListener("animationend", (ani) => {
              let aniName = ani.animationName;
              if (aniName == "pushOutMPTab") {
                changeMPWindow.style.padding = "3%";
                changeMPWindow.style.width = "37%";
                Array.from(
                  document.getElementsByClassName("changeMasterPasswordHeader")
                )[0].style.display = "initial";
                Array.from(
                  document.getElementsByClassName("changeMPInputsContainer")
                )[0].style.display = "flex";
                Array.from(
                  document.getElementsByClassName("changeMPFooter")
                )[0].style.display = "flex";
                Array.from(
                  document.getElementsByClassName(
                    "closeChangeMasterPasswordWindow"
                  )
                )[0].style.display = "initial";
              } else if (aniName == "pullInMPTab") {
                changeMPWindow.style.padding = "0%";
                changeMPWindow.style.width = "0%";
                Array.from(
                  document.getElementsByClassName("changeMasterPasswordHeader")
                )[0].style.display = "none";
                Array.from(
                  document.getElementsByClassName("changeMPInputsContainer")
                )[0].style.display = "none";
                Array.from(
                  document.getElementsByClassName("changeMPFooter")
                )[0].style.display = "none";
                Array.from(
                  document.getElementsByClassName(
                    "closeChangeMasterPasswordWindow"
                  )
                )[0].style.display = "none";
              }
            });

            const showChangeMPWindow = () => {
              changeMPWindow.style.animation = "pushOutMPTab 0.3s ease";
            };
            const hideChangeMPWindow = () => {
              changeMPWindow.style.animation = "pullInMPTab 0.3s ease";
            };

            const checkIfUIDExistsInFS = async () => {
              getDoc(refForMainUID)
                .then((tempSnap) => {
                  console.log("get Doc line 214");
                  console.log("temp is ", tempSnap);
                  console.log("If snap exists or not is ", tempSnap.exists());
                  let mfaCurrentlyEnabled;
                  let receivedMFASecretHex;
                  async function startUpSettingsListeners() {
                    console.log("Settings have been started up");

                    const resetUpdateMasterPasswordTab = async () => {
                      // This function is for the tab to update the master password
                      /* When its called, it returns the input boxes to the normal color 
                      incase they turned red from an error */
                      // It will also make sure all error messages are hidden

                      Array.from(
                        document.getElementsByClassName("changeMPInput")
                      ).forEach((e) => {
                        // Clearing input fields
                        e.value = "";
                        // Resetting input box backgrounds incase they turned red
                        e.style.backgroundColor = "#30343c";
                      });
                      // Hiding all error messages
                      document.getElementById(
                        "changeTooWeakError"
                      ).style.display = "none";
                      document.getElementById(
                        "changeHasToBeDifferentError"
                      ).style.display = "none";
                      document.getElementById(
                        "changeDontMatchError"
                      ).style.display = "none";
                      document.getElementById(
                        "changeIncorrectPasswordError"
                      ).style.display = "none";
                    };
                    const updateTextOfSettingsButtons = async () => {
                      // This function changes the text of the settings buttons
                      /* For example, for the button to change the mfa, this function
                      will check if the user has mfa enabled or disabled. If it's disabled,
                      it will say "Enable MFA". If it's enabled, it will say "Disable MFA" */

                      const mfaDoc = await getDoc(
                        doc(db, "users", "filler", userUID, "mfa")
                      );
                      receivedMFASecretHex = mfaDoc.data().hex;
                      if (receivedMFASecretHex.trim() != "") {
                        mfaCurrentlyEnabled = true;
                      } else {
                        mfaCurrentlyEnabled = false;
                      }

                      console.log("ITS: ", mfaCurrentlyEnabled);
                      console.log("RECIVED HEX IS: ", receivedMFASecretHex);

                      const buttonToEnableOrDisableMFA = Array.from(
                        document.getElementsByClassName(
                          "buttonToEnableOrDisable"
                        )
                      )[0];

                      if (mfaCurrentlyEnabled) {
                        // If mfa is enabled, give option to disable
                        buttonToEnableOrDisableMFA.textContent = "Disable";
                        // Just to make sure pointer events are working incase user opens them
                        Array.from(
                          document.getElementsByClassName(
                            "popupAskForMFAToDisableMFA"
                          )
                        )[0].style.pointerEvents = "auto";
                      } else {
                        buttonToEnableOrDisableMFA.textContent = "Enable";
                        // Just to make sure pointer events are working incase user opens them
                        Array.from(
                          document.getElementsByClassName(
                            "popupAskForMPToEnableMFA"
                          )
                        )[0].style.pointerEvents = "auto";
                        Array.from(
                          document.getElementsByClassName(
                            "popupWithMFAInformation"
                          )
                        )[0].style.pointerEvents = "auto";
                      }
                    };
                    const lowerOpacityOfPopupElements = (classOfPopup) => {
                      // This is for making the popup opacity lower while things are loading
                      Array.from(
                        document.getElementsByClassName(classOfPopup)
                      )[0].childNodes.forEach((e) => {
                        if (e.id != undefined) {
                          e.style.opacity = "0.3";
                        }
                      });
                    };
                    const higherOpacityOfPopupElements = (classOfPopup) => {
                      // This makes elements of the popup back to normal after process is done loading
                      Array.from(
                        document.getElementsByClassName(classOfPopup)
                      )[0].childNodes.forEach((e) => {
                        if (e.id != undefined) {
                          e.style.opacity = "1";
                        }
                      });
                    };
                    async function openAndCloseSettingsFunction() {
                      document
                        .getElementById("settingsButton")
                        .addEventListener("click", () => {
                          document.body.style.userSelect = "none";
                          document.getElementById(
                            "settingsScreen"
                          ).style.userSelect = "auto";
                          document.body.style.pointerEvents = "none";
                          document.getElementById(
                            "headerFlexbox"
                          ).style.opacity = ".5";
                          document.getElementById("queryScreen").style.opacity =
                            ".5";
                          document.getElementById(
                            "settingsScreen"
                          ).style.display = "flex";
                          document.getElementById(
                            "settingsScreen"
                          ).style.pointerEvents = "auto";
                          document.getElementById(
                            "popups"
                          ).style.pointerEvents = "auto";
                          // Allow user to click on popups as well (Ex. Popup to enable MFA)

                          document.getElementById(
                            "settingsScreen"
                          ).style.opacity = "1";
                        });
                      document
                        .getElementById("closeSettings")
                        .addEventListener("click", () => {
                          resetUpdateMasterPasswordTab(); /* Resetting update
                          master pass tab just incase its been used */
                          document.body.style.userSelect = "auto";
                          document.getElementById(
                            "settingsScreen"
                          ).style.userSelect = "none";
                          document.body.style.pointerEvents = "auto";
                          document.body.style.opacity = "1";
                          document.getElementById(
                            "headerFlexbox"
                          ).style.opacity = "1";
                          document.getElementById("queryScreen").style.opacity =
                            "1";
                          document.getElementById(
                            "settingsScreen"
                          ).style.display = "none";
                          document.getElementById(
                            "settingsScreen"
                          ).style.pointerEvents = "none";
                          document.getElementById(
                            "settingsScreen"
                          ).style.opacity = "1";
                        });
                    }

                    // CODE UNDERNEATH IS FOR INSIDE THE SETTINGS PAGE

                    async function startLogoutButtonListeners() {
                      const logOutSettingsButton = Array.from(
                        document.getElementsByClassName("logOutOfPMAccount")
                      )[0];

                      logOutSettingsButton.addEventListener("click", () => {
                        document.getElementById("fromPMToMain").click();
                      });
                    }

                    async function startChangeMasterPasswordListeners() {
                      // Make color of new master pass change while typing depending on password strength level
                      const scoreColorObject = {
                        0: "red",
                        1: "red",
                        2: "orange",
                        3: "yellow",
                        4: "lime",
                      };

                      const inputBoxForNewMP = Array.from(
                        document.getElementsByClassName("changeMPNewMP")
                      )[0];
                      const inputBoxForConfirmingNewMP = Array.from(
                        document.getElementsByClassName("changeMPRenterNewMP")
                      )[0];

                      inputBoxForNewMP.addEventListener("keyup", () => {
                        const scoreOfCurrentInputBoxValue = zxcvbn(
                          inputBoxForNewMP.value
                        ).score;
                        inputBoxForNewMP.style.color =
                          scoreColorObject[scoreOfCurrentInputBoxValue];
                        console.log(
                          "Keyed up: ",
                          scoreColorObject[scoreOfCurrentInputBoxValue]
                        );
                      });

                      inputBoxForConfirmingNewMP.addEventListener(
                        "keyup",
                        () => {
                          const scoreOfConfirmCurrentInputBoxValue = zxcvbn(
                            inputBoxForConfirmingNewMP.value
                          ).score;
                          inputBoxForConfirmingNewMP.style.color =
                            scoreColorObject[
                              scoreOfConfirmCurrentInputBoxValue
                            ];
                          console.log(
                            "Keyed up: ",
                            scoreColorObject[scoreOfConfirmCurrentInputBoxValue]
                          );
                        }
                      );

                      const changeMasterPasswordSettingsButton = Array.from(
                        document.getElementsByClassName("changeMasterPassword")
                      )[0];
                      const closeChangeMasterPasswordTabButton = Array.from(
                        document.getElementsByClassName(
                          "closeChangeMasterPasswordWindow"
                        )
                      )[0];

                      changeMasterPasswordSettingsButton.addEventListener(
                        "click",
                        () => {
                          showChangeMPWindow();
                        }
                      );

                      closeChangeMasterPasswordTabButton.addEventListener(
                        "click",
                        () => {
                          hideChangeMPWindow(); // Hides tab
                          resetUpdateMasterPasswordTab(); // Resets tab settings
                        }
                      );

                      Array.from(
                        document.getElementsByClassName(
                          "confirmMasterPasswordChange"
                        )
                      )[0].addEventListener("click", async () => {
                        // Listener to change master password
                        const arrayOfChangeMPInputBoxes = Array.from(
                          document.getElementsByClassName("changeMPInput")
                        );
                        const enterCurrentMPInputBox =
                          arrayOfChangeMPInputBoxes[0];
                        const enterNewMPInputBox = arrayOfChangeMPInputBoxes[1];
                        const reEnterNewMPInputBox =
                          arrayOfChangeMPInputBoxes[2];
                        /////////////////////////////////
                        const currentMPInputBoxValue =
                          enterCurrentMPInputBox.value;
                        const newMPInputBoxValue = enterNewMPInputBox.value;
                        //
                        const reEnterNewMPInputBoxValue =
                          reEnterNewMPInputBox.value;

                        if (
                          // Checking if user entered the correct current master pass before updating
                          await checkIfEnteredMPIsCorrect(
                            currentMPInputBoxValue
                          )
                        ) {
                          if (
                            // Checking if the user re-entered the new master password correctly
                            newMPInputBoxValue == reEnterNewMPInputBoxValue
                          ) {
                            if (
                              // Checking if the user just re-entered their current master pass
                              // Can't change master pass to current master pass
                              currentMPInputBoxValue != newMPInputBoxValue
                            ) {
                              const zxcvbnOfNewRequestedMasterPass =
                                zxcvbn(newMPInputBoxValue);

                              if (
                                // Checking if new pass is strong enough
                                zxcvbnOfNewRequestedMasterPass.score >= 3
                              ) {
                                // Clearing all input fields (we already have the values stored as variables, so its fine)
                                enterCurrentMPInputBox.value = "";
                                enterNewMPInputBox.value = "";
                                reEnterNewMPInputBox.value = "";
                                //

                                const hashedCurrentMasterPassword = crypto
                                  .createHash("sha512")
                                  .update(currentMPInputBoxValue)
                                  .digest("hex");
                                console.log(
                                  "HASH of the 'correct' entered one: ",
                                  hashedCurrentMasterPassword
                                );
                                const hashedNewMasterPassword = crypto
                                  .createHash("sha512")
                                  .update(newMPInputBoxValue)
                                  .digest("hex");
                                const updateMasterPassword = httpsCallable(
                                  functions,
                                  "updateMasterPassword"
                                );
                                document.body.style.pointerEvents = "none";
                                document.body.style.opacity = "0.5";

                                // Making a new random string to test if master pass is correct at login
                                let newRandomStringToBeEncrypted =
                                  await generateRandomString(250); // See line 145 for details
                                const newRandomStringEncrypted =
                                  CryptoJS.AES.encrypt(
                                    // Encrypting the random string with the master pass hash as the key
                                    newRandomStringToBeEncrypted,
                                    hashedNewMasterPassword
                                  ).toString();
                                const updateResult = await updateMasterPassword(
                                  {
                                    userUID: userUID,
                                    currentMPH: hashedCurrentMasterPassword,
                                    newMPH: hashedNewMasterPassword,
                                    newRandomStringEncrypted:
                                      newRandomStringEncrypted,
                                  }
                                );
                                currentEncryptedString =
                                  newRandomStringEncrypted;
                                // Encrypting the random string with the master pass hash as the key

                                newRandomStringToBeEncrypted = undefined;

                                // Updating that set hashed master password
                                // Its used to do encrypt and decrypt things
                                hashedSetMasterPassValue =
                                  hashedNewMasterPassword;

                                // console.log(updateResult);
                                document.body.style.pointerEvents = "auto";
                                document.body.style.opacity = "1";
                                console.log("DONEDITITITI DONE DONE DONE 👍");

                                console.log("WG: ", updateResult);
                              } else {
                                document.getElementById(
                                  "changeTooWeakError"
                                ).style.display = "flex";
                                document.getElementById(
                                  "changeHasToBeDifferentError"
                                ).style.display = "none";
                                document.getElementById(
                                  "changeDontMatchError"
                                ).style.display = "none";
                                document.getElementById(
                                  "changeIncorrectPasswordError"
                                ).style.display = "none";
                              }
                            } else {
                              // Do NOT execute request to change password
                              // Will waste reads and writes
                              document.getElementById(
                                "changeTooWeakError"
                              ).style.display = "none";
                              document.getElementById(
                                "changeHasToBeDifferentError"
                              ).style.display = "flex";
                              document.getElementById(
                                "changeDontMatchError"
                              ).style.display = "none";
                              document.getElementById(
                                "changeIncorrectPasswordError"
                              ).style.display = "none";
                            }
                          } else {
                            const newPassAndConfirmNewPassInputBoxes =
                              Array.from(
                                document.getElementsByClassName("newPass")
                              );
                            newPassAndConfirmNewPassInputBoxes.forEach((e) => {
                              e.style.backgroundColor = "#7a1c1c";
                            });
                            document.getElementById(
                              "changeTooWeakError"
                            ).style.display = "none";
                            document.getElementById(
                              "changeHasToBeDifferentError"
                            ).style.display = "none";
                            document.getElementById(
                              "changeIncorrectPasswordError"
                            ).style.display = "none";
                            document.getElementById(
                              "changeDontMatchError"
                            ).style.display = "flex";
                          }
                        } else {
                          console.log("BRRR");
                          document.getElementById(
                            "changeTooWeakError"
                          ).style.display = "none";
                          document.getElementById(
                            "changeHasToBeDifferentError"
                          ).style.display = "none";
                          document.getElementById(
                            "changeIncorrectPasswordError"
                          ).style.display = "flex";
                          document.getElementById(
                            "changeDontMatchError"
                          ).style.display = "none";
                        }
                      });

                      // Listener to show and hide password text
                      Array.from(
                        document.getElementsByClassName(
                          "showNewMPPasswordsButton"
                        )
                      )[0].addEventListener("click", () => {
                        /* Here im checking the type of the first input box (out of the three that show up in the change master pass window) 
  If it is text I change it to password (and the other way around) I could of checked for any of 
  the input boxes, but they would all be the same since im changing the type for them all at once */

                        const currentInputType = Array.from(
                          document.getElementsByClassName("changeMPInput")
                        )[0].type;
                        const arrayOfInputBoxesToCheck = Array.from(
                          document.getElementsByClassName("changeMPInput")
                        );
                        if (currentInputType == "password") {
                          arrayOfInputBoxesToCheck[0].type = "text";
                          arrayOfInputBoxesToCheck[1].type = "text";
                          arrayOfInputBoxesToCheck[2].type = "text";
                        } else if (currentInputType == "text") {
                          arrayOfInputBoxesToCheck[0].type = "password";
                          arrayOfInputBoxesToCheck[1].type = "password";
                          arrayOfInputBoxesToCheck[2].type = "password";
                        }

                        document
                          .getElementById("showPasswordsIcon")
                          .classList.toggle("fa-eye-slash");
                      });
                    }

                    async function startMFAListeners() {
                      const mfaSettingsButton = Array.from(
                        document.getElementsByClassName(
                          "buttonToEnableOrDisable"
                        )
                      )[0];
                      mfaSettingsButton.addEventListener("click", () => {
                        if (mfaCurrentlyEnabled == false) {
                          // Show screen to enable MFA
                          // Dimming background of popup
                          // The popup doesn't get affected because all the popups aren't in the main settings div
                          Array.from(
                            document.getElementsByClassName(
                              "popupAskForMPToEnableMFA"
                            )
                          )[0].style.display = "flex";
                          Array.from(
                            document.getElementsByClassName("mainSettings")
                          )[0].style.opacity = "0.3";
                          document.getElementById(
                            "closeSettings"
                          ).style.opacity = "0.3";
                        } else if (mfaCurrentlyEnabled == true) {
                          // Show screen to disable MFA
                          // Dimming background of popup
                          // The popup doesn't get affected because all the popups aren't in the main settings div
                          Array.from(
                            document.getElementsByClassName(
                              "popupAskForMFAToDisableMFA"
                            )
                          )[0].style.display = "flex";
                          Array.from(
                            document.getElementsByClassName("mainSettings")
                          )[0].style.opacity = "0.3";
                          document.getElementById(
                            "closeSettings"
                          ).style.opacity = "0.3";
                        }
                      });
                      // Listeners for inside popups

                      let mfaSecretHex;
                      // Listeners for popup to enable MFA
                      document
                        .getElementById("showPassBeingConfirmed")
                        .addEventListener("click", () => {
                          const confirmMPForMFASetInputBox =
                            document.getElementById("confirmMPForMFAInput");
                          const showPassConfirmMPForMFAButton =
                            document.getElementById("showPassBeingConfirmed");

                          if (confirmMPForMFASetInputBox.type == "password") {
                            confirmMPForMFASetInputBox.type = "text";
                            showPassConfirmMPForMFAButton.textContent =
                              "Hide password";
                          } else {
                            confirmMPForMFASetInputBox.type = "password";
                            showPassConfirmMPForMFAButton.textContent =
                              "Show password";
                          }
                        });
                      document
                        .getElementById("buttonToCloseConfirmMPForMFAPopup")
                        .addEventListener("click", () => {
                          // Close out of the popup that confirms the master password
                          Array.from(
                            document.getElementsByClassName(
                              "popupAskForMPToEnableMFA"
                            )
                          )[0].style.display = "none";
                          Array.from(
                            document.getElementsByClassName("mainSettings")
                          )[0].style.opacity = "1";
                          document.getElementById(
                            "closeSettings"
                          ).style.opacity = "1";

                          // Making anything that may have turn red from an error go back to normal
                          const inputBoxForMP = document.getElementById(
                            "confirmMPForMFAInput"
                          );
                          inputBoxForMP.value = "";
                          inputBoxForMP.style.backgroundColor = "#5c615c";
                          inputBoxForMP.style.border = "3px solid grey";
                          document.getElementById(
                            "settingsScreen"
                          ).style.pointerEvents = "auto";
                        });
                      document
                        .getElementById("confirmMPForMFAButton")
                        .addEventListener("click", async () => {
                          lowerOpacityOfPopupElements(
                            "popupAskForMPToEnableMFA"
                          );
                          Array.from(
                            // Cant click on anything on the popup until done confirming master password entry
                            document.getElementsByClassName(
                              "popupAskForMPToEnableMFA"
                            )
                          )[0].style.pointerEvents = "none";
                          const enteredMP = document.getElementById(
                            "confirmMPForMFAInput"
                          ).value;
                          const masterPasswordIsCorrect =
                            await checkIfEnteredMPIsCorrect(enteredMP);
                          if (masterPasswordIsCorrect) {
                            // Master password has been confirmed
                            // Reset the value of the input box just incase it gets re-opened later
                            document.getElementById(
                              "confirmMPForMFAInput"
                            ).value = "";
                            // Hide the popup for confirming master password
                            Array.from(
                              document.getElementsByClassName(
                                "popupAskForMPToEnableMFA"
                              )
                            )[0].style.display = "none";
                            // Generating mfa information
                            let mfaSecret = speakeasy.generateSecret({
                              name: "Personal PM",
                            });

                            console.log(mfaSecret);

                            const mfaCode = mfaSecret.base32;
                            mfaSecretHex = mfaSecret.hex;
                            document.getElementById("mfaCode").textContent =
                              mfaCode;

                            qrcode.toDataURL(
                              mfaSecret.otpauth_url,
                              (err, data) => {
                                console.log(data);
                                const imgElementToStoreQrcode =
                                  document.getElementById("qrcodeForMFA");
                                // Make this data as the src of image (will show qrcode)
                                imgElementToStoreQrcode.src = data;
                              }
                            );

                            // Show popup with mfa information
                            Array.from(
                              document.getElementsByClassName(
                                "popupWithMFAInformation"
                              )
                            )[0].style.display = "flex";
                          } else {
                            const inputBoxForConfirmingMP =
                              document.getElementById("confirmMPForMFAInput");
                            // Making them red
                            inputBoxForConfirmingMP.style.backgroundColor =
                              "#823030";
                            inputBoxForConfirmingMP.style.border =
                              "3px solid #3a1c1c";
                            // Remember to make the go back to normal if the user closes out of the popup
                            Array.from(
                              // Turning pointer events back on so the user can re-enter the master password
                              document.getElementsByClassName(
                                "popupAskForMPToEnableMFA"
                              )
                            )[0].style.pointerEvents = "auto";
                          }
                          higherOpacityOfPopupElements(
                            "popupAskForMPToEnableMFA"
                          );
                        });
                      document
                        .getElementById("confirmMFAConfirmationButton")
                        .addEventListener("click", async () => {
                          // Checks if the user entered the correct MFA confirmation code
                          // Turn off pointer events while confirming code
                          Array.from(
                            document.getElementsByClassName(
                              "popupWithMFAInformation"
                            )
                          )[0].style.pointerEvents = "none";

                          const enteredMfaConfirmationCode =
                            document.getElementById(
                              "enterConfirmMFACode"
                            ).value;
                          const mfaIsCorrect = speakeasy.totp.verify({
                            secret: mfaSecretHex,
                            encoding: "hex",
                            token: enteredMfaConfirmationCode,
                          });
                          if (mfaIsCorrect) {
                            // User confirmed the MFA code correctly
                            // Store the hex in database using cloud function

                            const enableMFA = httpsCallable(
                              functions,
                              "enableMFA"
                            );
                            const enableMFACF = await enableMFA({
                              mfaSecretHex: mfaSecretHex,
                              hashedSetMasterPassValue:
                                hashedSetMasterPassValue,
                              userUID: userUID,
                            });
                            console.log(enableMFACF);
                            await updateTextOfSettingsButtons();
                            // Clear input box with MFA code
                            document.getElementById(
                              "enterConfirmMFACode"
                            ).value = "";
                            // Hide MFA popup
                            Array.from(
                              document.getElementsByClassName(
                                "popupWithMFAInformation"
                              )
                            )[0].style.display = "none";

                            // Allow pointer events for main settings screen again (and changing opacity to normal)
                            document.getElementById(
                              "settingsScreen"
                            ).style.pointerEvents = "auto";
                            document.getElementById(
                              "settingsScreen"
                            ).style.opacity = "1";
                            Array.from(
                              document.getElementsByClassName("mainSettings")
                            )[0].style.opacity = "1";
                            document.getElementById(
                              "closeSettings"
                            ).style.opacity = "1";
                          } else {
                            // Turn pointer events back on so they can try again
                            Array.from(
                              document.getElementsByClassName(
                                "popupWithMFAInformation"
                              )
                            )[0].style.pointerEvents = "auto";
                          }
                        });

                      // Listeners for popup to disable MFA
                      document
                        .getElementById(
                          "buttonToCloseConfirmMFAForDisableMFAPopup"
                        )
                        .addEventListener("click", () => {
                          // Close out of the popup that confirms the MFA token to disable MFA
                          Array.from(
                            document.getElementsByClassName(
                              "popupAskForMFAToDisableMFA"
                            )
                          )[0].style.display = "none";
                          Array.from(
                            document.getElementsByClassName("mainSettings")
                          )[0].style.opacity = "1";
                          document.getElementById(
                            "closeSettings"
                          ).style.opacity = "1";

                          // Making anything that may have turn red from an error go back to normal
                          const inputBoxForMFA = document.getElementById(
                            "confirmMFAToDisableMFAInput"
                          );
                          inputBoxForMFA.value = "";
                          inputBoxForMFA.style.backgroundColor = "#5c615c";
                          inputBoxForMFA.style.border = "3px solid grey";
                          document.getElementById(
                            "settingsScreen"
                          ).style.pointerEvents = "auto";
                        });
                      document
                        .getElementById("confirmMFAToDisableMFAButton")
                        .addEventListener("click", async () => {
                          lowerOpacityOfPopupElements(
                            "popupAskForMFAToDisableMFA"
                          );
                          // Don't allow any clicking while checking so the user doesn't spam the confirm button
                          Array.from(
                            document.getElementsByClassName(
                              "popupAskForMFAToDisableMFA"
                            )
                          )[0].style.pointerEvents = "none";

                          const inputBoxForMFA = document.getElementById(
                            "confirmMFAToDisableMFAInput"
                          );
                          const whatToDoIfMFAIsRightOrWrong = async (
                            mfaMatched
                          ) => {
                            // This function will adjust the UI depending on if the mfa was entered correctly or not
                            // It can also call the CF that disables MFA

                            if (mfaMatched) {
                              // Call CF to disable MFA
                              const disableMFACF = httpsCallable(
                                functions,
                                "disableMFA"
                              );
                              const disableMFAReturn = await disableMFACF({
                                userUID: userUID,
                              });
                              console.log(disableMFAReturn);
                              await updateTextOfSettingsButtons();

                              Array.from(
                                document.getElementsByClassName(
                                  "popupAskForMFAToDisableMFA"
                                )
                              )[0].style.display = "none";
                              Array.from(
                                document.getElementsByClassName("mainSettings")
                              )[0].style.opacity = "1";
                              document.getElementById(
                                "closeSettings"
                              ).style.opacity = "1";

                              // Making anything that may have turn red from an error go back to normal
                              const inputBoxForMFA = document.getElementById(
                                "confirmMFAToDisableMFAInput"
                              );
                              inputBoxForMFA.value = "";
                              inputBoxForMFA.style.backgroundColor = "#5c615c";
                              inputBoxForMFA.style.border = "3px solid grey";
                              document.getElementById(
                                "settingsScreen"
                              ).style.pointerEvents = "auto";
                            } else if (mfaMatched == false) {
                              const inputBoxForMFA = document.getElementById(
                                "confirmMFAToDisableMFAInput"
                              );
                              // Making them red
                              inputBoxForMFA.style.backgroundColor = "#823030";
                              inputBoxForMFA.style.border = "3px solid #3a1c1c";

                              // Allow clicks again so the user can try again
                              Array.from(
                                document.getElementsByClassName(
                                  "popupAskForMFAToDisableMFA"
                                )
                              )[0].style.pointerEvents = "auto";
                            }
                            higherOpacityOfPopupElements(
                              "popupAskForMFAToDisableMFA"
                            );
                          };
                          if (mfaSecretHex != undefined) {
                            /* The variable "mfaSecretHex" is the secret we need
                            in order to verify the user's mfa token. If this is defined,
                            that means the user is trying to disable mfa in the
                            same session they enabled it. If this isn't defined,
                            that means the user enabled mfa in a different session,
                            meaning we don't have the secret stored. So we would have
                            to make a read to the database to get it */

                            const mfaIsCorrect = speakeasy.totp.verify({
                              secret: mfaSecretHex,
                              encoding: "hex",
                              token: inputBoxForMFA.value,
                            });
                            await whatToDoIfMFAIsRightOrWrong(mfaIsCorrect);
                          } else {
                            // Have to get "mfaSecretHex" from the database
                            // Use CF for this because the hex is encrypted with the master password hash + user's secret
                            // Use CF to determine wether user entered the correct MFA
                            const checkMFACF = httpsCallable(
                              functions,
                              "checkIfMFATokenIsCorrect"
                            );
                            const checkMFACFReturn = await checkMFACF({
                              userUID: userUID,
                              hashedSetMasterPassValue:
                                hashedSetMasterPassValue,
                              enteredMFAToken: inputBoxForMFA.value,
                            });
                            console.log(checkMFACFReturn);
                            const mfaIsCorrect =
                              checkMFACFReturn.data.enteredMFAIsCorrect;
                            await whatToDoIfMFAIsRightOrWrong(mfaIsCorrect);
                          }
                        });
                    }

                    await openAndCloseSettingsFunction();
                    await updateTextOfSettingsButtons();
                    await startLogoutButtonListeners();
                    await startChangeMasterPasswordListeners();
                    await startMFAListeners();
                  }
                  if (tempSnap.exists()) {
                    // If statement checking if user already has a Master Password
                    console.log(tempSnap.data(), " exists!");
                    document.body.style.pointerEvents = "none";
                    document.getElementById(
                      "setupMasterPasswordScreen"
                    ).style.display = "initial";
                    document.getElementById(
                      "setupMasterPasswordScreen"
                    ).style.pointerEvents = "auto";
                    document.body.style.opacity = ".65";
                    document.getElementById(
                      "createMasterPasswordHeader"
                    ).textContent = "Enter Master Password";
                    document.getElementById(
                      "passwordStrengthBar"
                    ).style.display = "none";
                    document.getElementById(
                      "reenterPasswordStrengthBar"
                    ).style.display = "none";
                    document.getElementById(
                      "confirmMasterPasswordButton"
                    ).style.marginTop = "10%";
                    document.getElementById(
                      "confirmMasterPasswordButton"
                    ).textContent = "Login to Personal PM";
                    document.getElementById("newMasterPasswordField").id =
                      "newAndEnterMasterPasswordField";
                    document.getElementById(
                      "confirmMasterPasswordButton"
                    ).style.marginTop = "5%";
                    document.getElementById(
                      "newAndEnterMasterPasswordField"
                    ).style.border = "none";
                    document.getElementById(
                      "newAndEnterMasterPasswordField"
                    ).style.borderBottom = "1px solid teal";

                    document.getElementById("renterMP").style.display = "none";

                    //----------------------Check if master password is correct----------------------//
                    async function checkRequestedMP() {
                      let rawRequest = document.getElementById(
                        "newAndEnterMasterPasswordField"
                      ).value;
                      const masterPasswordIsCorrect =
                        await checkIfEnteredMPIsCorrect(rawRequest);
                      if (masterPasswordIsCorrect) {
                        // Master password is correct and user is logged in

                        await startUpSettingsListeners(); /* After user logs in, we start up the
                        listeners for settings so the user can navigate the settings page */

                        const hashedValueOfCorrectMP = crypto
                          .createHash("sha512")
                          .update(rawRequest)
                          .digest("hex");
                        hashedSetMasterPassValue = hashedValueOfCorrectMP; /* 
                        Just making a variable that has the correct hash of the
                        master password */

                        let orderNumber =
                          -10000; /* This negative number is for making updated
                        queries go to the top of the page. The more negative order number an
                        element has, the higher it will go on the page. This number will -1
                        everytime an query gets updated so that if another query gets updated
                        after, it will go even higher than the previously updated one*/
                        document.getElementById(
                          "setupMasterPasswordScreen"
                        ).style.display = "none";
                        document.body.style.pointerEvents = "auto";
                        document.body.style.opacity = "1";

                        // Getting each object of each user query and putting them in an array
                        // The array gets sent to a cloud function to be decrypted
                        // The cloud function will return all of the decrypted objects
                        console.log(
                          "THE HASSSSSSSSSHHHHHHHHHHH: ",
                          hashedSetMasterPassValue
                        );
                        console.log("(AND UID): ", userUID);
                        const decryptUserQueriesCF = httpsCallable(
                          functions,
                          "decryptUserQueries"
                        );
                        const finalDecryptedQueryReturn =
                          await decryptUserQueriesCF({
                            hashedSetMasterPassValue: hashedSetMasterPassValue,
                            userUID: userUID,
                          });
                        console.log(finalDecryptedQueryReturn);
                        const listOfDecryptedObjectsAndIDs =
                          finalDecryptedQueryReturn.data.finalList;

                        /* The "listOfDecryptedObjectsAndIDs" is a list with lists containing an object of a doc and its doc id
                        Ex. 
                        [
                          [{user: randomUser, pass: randomPass}, randomID],
                          [{user: randomUser, pass: randomPass}, randomID],
                          [{user: randomUser, pass: randomPass}, randomID]
                        ]
                        */

                        async function startUpShow(sourceDoc, sourceDocRef) {
                          const importedData = sourceDoc;
                          console.log("THE REFREF IS: ", sourceDocRef);
                          console.log("IMPORTED DATA IS.... ", importedData);

                          let rawRandomID;
                          function getDecryptedID() {
                            rawRandomID = importedData.random;
                          }
                          getDecryptedID();

                          let mainDiv = document.createElement("div");
                          mainDiv.setAttribute("id", `mainDiv${rawRandomID}`);
                          mainDiv.style.marginTop = `${originalMarginTop}%`;
                          document
                            .getElementById("queryScreen")
                            .appendChild(mainDiv);
                          document
                            .getElementById(`mainDiv${rawRandomID}`)
                            .classList.add("mainDivClass");
                          ////////
                          let infoDiv = document.createElement("div");
                          infoDiv.setAttribute("id", `infoDiv${rawRandomID}`);
                          document
                            .getElementById(`mainDiv${rawRandomID}`)
                            .appendChild(infoDiv);
                          document
                            .getElementById(`infoDiv${rawRandomID}`)
                            .classList.add("infoDiv");
                          let line = document.createElement("div");
                          // let divForSection = document.createElement("div");
                          line.setAttribute("id", `line${rawRandomID}`);
                          // line.style.marginTop = `${originalMarginTop}%`;
                          document
                            .getElementById(`mainDiv${rawRandomID}`)
                            .appendChild(line);
                          document
                            .getElementById(`line${rawRandomID}`)
                            .classList.add("queryLine");
                          // Subinfo span is for everything except the three toggles
                          let subInfoSpan = document.createElement("span");
                          subInfoSpan.setAttribute(
                            "id",
                            `subInfoSpan${rawRandomID}`
                          );
                          subInfoSpan.setAttribute("class", `subInfoSpan`);
                          document
                            .getElementById(`infoDiv${rawRandomID}`)
                            .appendChild(subInfoSpan);
                          //
                          if (importedData.isLink == "true") {
                            async function addLetterBox() {
                              console.log("Its been true");
                              let icon = document.createElement("img");
                              let websiteLink = importedData.directLink;
                              if (
                                websiteLink.substring(0, 5) == "http:" ||
                                websiteLink.substring(0, 6) == "https:" ||
                                websiteLink.substring(0, 7) == "http://" ||
                                websiteLink.substring(0, 8) == "https://"
                              ) {
                                icon.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${websiteLink}&size=48`;
                              } else {
                                icon.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${websiteLink}&size=48`;
                              }

                              icon.style.marginBottom = "-1%";
                              icon.setAttribute("id", `icon${rawRandomID}`);
                              document
                                .getElementById(`subInfoSpan${rawRandomID}`)
                                .appendChild(icon);
                              document
                                .getElementById(`icon${rawRandomID}`)
                                .classList.add("linkIcons");
                              console.log("Its been true end");
                            }
                            addLetterBox();
                          } else {
                            let listOfColors = [
                              "#198582",
                              "#3d3dad",
                              "#830a08",
                              "#ffa800",
                              "#626f7a",
                            ];
                            async function addLetterBox() {
                              // console.log("Its been false");
                              let firstLetterOfAppName = importedData.website;
                              firstLetterOfAppName =
                                firstLetterOfAppName[0].toUpperCase();
                              console.log(
                                "First letter is ",
                                firstLetterOfAppName
                              );
                              let letterBox = document.createElement("div");
                              letterBox.style.backgroundColor =
                                listOfColors[
                                  Math.floor(
                                    Math.random() * listOfColors.length
                                  )
                                ];
                              letterBox.setAttribute(
                                "id",
                                `letterBox${rawRandomID}`
                              );
                              let letterBoxLetter =
                                document.createElement("h4");
                              letterBoxLetter.textContent =
                                firstLetterOfAppName;
                              letterBoxLetter.setAttribute(
                                "id",
                                `letterBoxLetter${rawRandomID}`
                              );
                              document
                                .getElementById(`subInfoSpan${rawRandomID}`)
                                .appendChild(letterBox);
                              document
                                .getElementById(`letterBox${rawRandomID}`)
                                .appendChild(letterBoxLetter);
                              document
                                .getElementById(`letterBox${rawRandomID}`)
                                .classList.add("letterLinkIcons");
                              document
                                .getElementById(`letterBoxLetter${rawRandomID}`)
                                .classList.add("letterBoxLetter");
                              console.log("Its been false end");
                            }
                            addLetterBox();
                          }
                          ///////////////////////////////////////////////////////////////////////////////////////////
                          async function createThreeContainerHolder() {
                            let threeToggles = document.createElement("div");
                            threeToggles.setAttribute("class", "tholder");
                            threeToggles.id = `threeToggles${rawRandomID}`;
                            document
                              .getElementById(`infoDiv${rawRandomID}`)
                              .appendChild(threeToggles);
                          }
                          async function showUserAndPass() {
                            let shownAppName = document.createElement("input");
                            let decryptedShownAppName = importedData.website;
                            shownAppName.value =
                              decryptedShownAppName.charAt(0).toUpperCase() +
                              decryptedShownAppName.slice(1);
                            // if (importedData.isLink == "true") {
                            // } else {
                            //   shownAppName.style.marginLeft = "13%";
                            // }
                            shownAppName.readOnly = true;
                            shownAppName.setAttribute(
                              "id",
                              `shownAppName${rawRandomID}`
                            );

                            document
                              .getElementById(`subInfoSpan${rawRandomID}`)
                              .appendChild(shownAppName);
                            document
                              .getElementById(`shownAppName${rawRandomID}`)
                              .classList.add("shownAppName");
                            if (importedData.isLink == "true") {
                              document.getElementById(
                                `icon${rawRandomID}`
                              ).style.cursor = "pointer";
                            }
                            let shownEmail = document.createElement("input");
                            shownEmail.value = importedData.email;
                            shownEmail.setAttribute(
                              "id",
                              `shownEmail${rawRandomID}`
                            );
                            shownEmail.readOnly = true;
                            document
                              .getElementById(`subInfoSpan${rawRandomID}`)
                              .appendChild(shownEmail);
                            document
                              .getElementById(`shownEmail${rawRandomID}`)
                              .classList.add("shownEmail");
                          }
                          async function requestUpdateQueryFunction() {
                            document
                              .getElementById(`mainDiv${rawRandomID}`)
                              .addEventListener("click", async (clickedEvt) => {
                                if (
                                  // This if statement checks if a query is clicked
                                  // If a query is clicked, it will launch an update screen for it
                                  clickedEvt.target.className.includes(
                                    "infoDiv"
                                  ) ||
                                  clickedEvt.target.className.includes(
                                    "mainDivClass"
                                  ) ||
                                  clickedEvt.target.className.includes(
                                    "shownAppName"
                                  ) ||
                                  clickedEvt.target.className.includes(
                                    "shownEmail"
                                  )
                                ) {
                                  //
                                  async function checkIfUpdateScreenExists() {
                                    let arrayOfExistingUpdateScreens = [];
                                    async function createAndAddUpdatesCheckList() {
                                      Array.from(
                                        // mc is the main container for the dashboard
                                        Array.from(
                                          document.getElementsByClassName("mc")
                                        )[0].children
                                      ).forEach((eleS) => {
                                        if (eleS.tagName == "SPAN") {
                                          if (eleS.id != "ableToDarken") {
                                            // If the element is a span, and the ID of it is not "ableToDarken", then the element is an update tab
                                            // "eleS" will have 2 child elements
                                            // The first one is the update tab, and the second is the confirm delete popup

                                            arrayOfExistingUpdateScreens.push(
                                              Array.from(eleS.children)[0].id
                                            );
                                          }
                                        }
                                      });
                                    }
                                    async function confirmUpdateList() {
                                      if (
                                        arrayOfExistingUpdateScreens.includes(
                                          `updateQueryScreen${rawRandomID}`
                                        )
                                      ) {
                                        return true;
                                      } else {
                                        return false;
                                      }
                                    }
                                    await createAndAddUpdatesCheckList();
                                    return await confirmUpdateList();
                                  }
                                  async function showNewUpdateScreen() {
                                    let updateExists =
                                      await checkIfUpdateScreenExists();
                                    if (updateExists) {
                                      // Will run if an update tab for a query has already been created
                                      console.log("true");
                                      document.getElementById(
                                        `updateQueryScreen${rawRandomID}`
                                      ).style.animation = "";
                                      document.getElementById(
                                        `updateQueryScreen${rawRandomID}`
                                      ).style.animation =
                                        "pushOutUpdateTab 0.3s ease";
                                      document
                                        .getElementById(
                                          `updateQueryScreen${rawRandomID}`
                                        )
                                        .classList.remove("prototype"); // Removing this class indicates that the update tab has been opened before
                                      // document.getElementById(
                                      //   "ableToDarken"
                                      // ).style.animation = "fadeSlight 0.25s ease";
                                      dimAbleToDarken();
                                    } else if (updateExists == false) {
                                      // Code to run when creating a new update tab
                                      // This is created when the user clicks on a query the first time to edit it
                                      // If the user closes out of the update tab then clicks on the SAME query to edit it again, then this else if statement won't run
                                      console.log("false");
                                      const mcParent = Array.from(
                                        document.getElementsByClassName("mc")
                                      )[0];

                                      // Adding html of new update tab
                                      // Added the prototype class to the first line of the html below
                                      // Use this class to tell when the first time the update tab is being opened
                                      // This is useful when we add the click event listener for the save and cancel buttons
                                      // Will get rid of prototype class in the if statement above (when we open the update tab and it has already been opened before)

                                      // The prototype class is also added to the edit button when it is clicked the first time
                                      let htmlOfNewUpdateScreen = `
                              <div id="updateQueryScreen${rawRandomID}" class="updateQueryScreen prototype uce">
                                <table id="queryInfoTable${rawRandomID}" class="queryInfoTable uce">
                                  <thead class="uce">
                                    <tr class="uce">
                                      <td class="uce">
                                        <img id="updateScreenIcon${rawRandomID}" class="updateScreenIcon uce" src="" alt="" />
                                      </td>
                                    </tr>
                                    <tr class="uce">
                                      <td class="uce">
                                        <h2 id="updateScreenQueryNameHeader${rawRandomID}" class="updateScreenQueryNameHeader uce"></h2>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody class="uce">
                                    <tr class="uce">
                                      <td class="uce">
                                        <div id="strongUpdateDisplayTextNameContainer${rawRandomID}" class="strongUpdateDisplayTextContainer strongUpdateDisplayTextNameContainer uce">
                                          <input
                                          class="strongUpdateDisplayText strongUpdateDisplayTextName uce"
                                          id="strongUpdateDisplayTextName${rawRandomID}" readonly
                                          ></input>
                                          <small class="smallUpdateDisplayText uce">Name</small>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr class="uce">
                                      <td class="uce">
                                        <div id="strongUpdateDisplayTextEmailContainer${rawRandomID}" class="strongUpdateDisplayTextContainer strongUpdateDisplayTextEmailContainer uce">
                                          <input
                                          class="strongUpdateDisplayText strongUpdateDisplayTextEmail uce"
                                          id="strongUpdateDisplayTextEmail${rawRandomID}" readonly
                                          ></input>
                                          <small class="smallUpdateDisplayText uce">Email</small>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr class="uce">
                                      <td class="uce">
                                        <div id="strongUpdateDisplayTextPasswordContainer${rawRandomID}" class="strongUpdateDisplayTextContainer strongUpdateDisplayTextPasswordContainer uce">
                                          <input
                                          class="strongUpdateDisplayText strongUpdateDisplayTextPassword uce"
                                          id="strongUpdateDisplayTextPassword${rawRandomID}" readonly
                                          ></input>
                                          <small class="smallUpdateDisplayText uce">Password</small>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr class="uce">
                                      <td class="uce">
                                        <div id="strongUpdateDisplayTextURLContainer${rawRandomID}" class="strongUpdateDisplayTextContainer strongUpdateDisplayTextURLContainer uce">
                                          <input
                                            class="strongUpdateDisplayText strongUpdateDisplayTextURL uce"
                                            id="strongUpdateDisplayTextURL${rawRandomID}" readonly
                                          ></input>
                                          <small class="smallUpdateDisplayText uce">URL/Link</small>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                  <tfoot class="uce">
                                    <tr id="editRow${rawRandomID}" class="editRow uce">
                                      <td class="uce">
                                        <button id="editButtonUpdate${rawRandomID}" class="editButtonUpdate prototype uce">Edit</button>
                                      </td>
                                    </tr>
                                    <tr id="saveRow${rawRandomID}" class="saveRow uce">
                                      <td class="uce">
                                        <button id="saveButtonUpdate${rawRandomID}" class="saveButtonUpdate uce">Save</button>
                                      </td>
                                    </tr>
                                    <tr id="cancelRow${rawRandomID}" class="cancelRow uce">
                                      <td class="uce">
                                        <button id="cancelButtonUpdate${rawRandomID}" class="cancelButtonUpdate uce">Cancel</button>
                                      </td>
                                    </tr>
                                    <tr id="deleteRow${rawRandomID}" class="deleteRow uce">
                                        <td class="uce">
                                          <button id="deleteQueryButton${rawRandomID}" class="deleteQueryButton uce">Delete</button>
                                        </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                              `;
                                      let updateHolder =
                                        document.createElement("span");
                                      updateHolder.innerHTML =
                                        htmlOfNewUpdateScreen;
                                      mcParent.appendChild(updateHolder);

                                      /* We are putting in the class "uce" so 
                                the update tab wil not disapper when the popup gets clicked*/

                                      // This is a "confirm delete" popup when a user deletes a query
                                      let htmlOfConfirmDeletePopup = `
                                <div id="cdel${rawRandomID}" class="cdel uce">
                                  <h2 id="askConfirmDelete${rawRandomID}" class="askConfirmDelete uce">Delete this item?</h2>
                                  <p id="delmessage${rawRandomID}" class="delmessage uce">Are you sure you want to delete this item?</p>
                                  <button id="yesdel${rawRandomID}" class="yesdel delConfirmAndCancel uce">Delete</button>
                                  <button id="canceldel${rawRandomID}" class="canceldel delConfirmAndCancel uce">Cancel</button>
                                </div>
                                `;

                                      // We want the popup to be in the same span tag as the update tab

                                      // Adding the popup to the span tag
                                      let confirmDeletePopup =
                                        document.createElement("span");
                                      confirmDeletePopup.innerHTML =
                                        htmlOfConfirmDeletePopup;
                                      updateHolder.appendChild(
                                        confirmDeletePopup
                                      );

                                      document.getElementById(
                                        `delmessage${rawRandomID}`
                                      ).textContent = `Are you sure you want to delete ${importedData.website}?`;

                                      // Listener to delete query that was added
                                      console.log("listener created");
                                      document
                                        .getElementById(`yesdel${rawRandomID}`) // Confirm delete button
                                        .addEventListener("click", async () => {
                                          console.log(
                                            "Delete button has been clicked"
                                          );
                                          await deleteDoc(sourceDocRef); // Deleting query
                                          console.log("A delete has been made");

                                          // Animation to delete query from main page
                                          document.getElementById(
                                            `mainDiv${rawRandomID}`
                                          ).style.animation =
                                            "fadeAway 0.3s ease";
                                          document
                                            .getElementById(
                                              `mainDiv${rawRandomID}`
                                            )
                                            .addEventListener(
                                              "animationend",
                                              () => {
                                                document.getElementById(
                                                  `mainDiv${rawRandomID}`
                                                ).style.display = "none";
                                              }
                                            );
                                          document // No need to also hide the confirm delete popup since the whole span will be deleted
                                            .getElementById(
                                              `updateQueryScreen${rawRandomID}`
                                            )
                                            .parentNode.remove();

                                          document.getElementById(
                                            "ableToDarken"
                                          ).style.pointerEvents = "auto"; // Allowing user to interact with background
                                          resetDimAbleToDarken(); // Undim screen
                                        });

                                      document
                                        .getElementById(
                                          `canceldel${rawRandomID}`
                                        )
                                        .addEventListener("click", () => {
                                          document.getElementById(
                                            // Hide confirm delete tab
                                            `cdel${rawRandomID}`
                                          ).style.display = "none";

                                          document.getElementById(
                                            // Push update tab back out
                                            `updateQueryScreen${rawRandomID}`
                                          ).style.animation =
                                            "pushOutUpdateTab 0.3s ease";
                                          document.getElementById(
                                            "ableToDarken"
                                          ).style.pointerEvents = "auto"; // Allowing user to interact with background
                                        });
                                      let deleteButton =
                                        document.getElementById(
                                          `deleteQueryButton${rawRandomID}`
                                        );
                                      deleteButton.addEventListener(
                                        "click",
                                        async () => {
                                          document.getElementById(
                                            `cdel${rawRandomID}`
                                          ).style.display = "initial";
                                          document.getElementById(
                                            `updateQueryScreen${rawRandomID}`
                                          ).style.animation =
                                            "pullInUpdateTab 0.3s ease";
                                          document.getElementById(
                                            "ableToDarken"
                                          ).style.pointerEvents = "none"; // Not allowing user to interact with background while delete popup is active
                                        }
                                      );

                                      // Animation listeners
                                      const updateInputFieldsForAniListeners = [
                                        document.getElementById(
                                          `strongUpdateDisplayTextName${rawRandomID}`
                                        ),
                                        document.getElementById(
                                          `strongUpdateDisplayTextEmail${rawRandomID}`
                                        ),
                                        document.getElementById(
                                          `strongUpdateDisplayTextPassword${rawRandomID}`
                                        ),
                                        document.getElementById(
                                          `strongUpdateDisplayTextURL${rawRandomID}`
                                        ),
                                      ];
                                      updateInputFieldsForAniListeners.forEach(
                                        (eleani) => {
                                          eleani.addEventListener(
                                            "animationend",
                                            (aniEvt) => {
                                              if (
                                                aniEvt.animationName ==
                                                "updateInputBoxesGlow"
                                              ) {
                                                eleani.style.boxShadow =
                                                  "rgb(255, 255, 255) 0px 0px 12px 1px";
                                              } else if (
                                                aniEvt.animationName ==
                                                "updateInputBoxesNormal"
                                              ) {
                                                eleani.style.boxShadow =
                                                  "0px 10px 30px 5px rgba(0, 0, 0.15)";
                                              }
                                            }
                                          );
                                        }
                                      );
                                      //
                                      document
                                        .getElementById(
                                          `updateQueryScreen${rawRandomID}`
                                        )
                                        .addEventListener(
                                          "animationend",
                                          (aniii) => {
                                            console.log(
                                              "the ani0 is ",
                                              aniii.animationName
                                            );
                                            if (
                                              aniii.animationName ==
                                              "pushOutUpdateTab"
                                            ) {
                                              document.getElementById(
                                                `updateQueryScreen${rawRandomID}`
                                              ).style.width = "40%";
                                            }
                                            if (
                                              aniii.animationName ==
                                              "pullInUpdateTab"
                                            ) {
                                              document.getElementById(
                                                `updateQueryScreen${rawRandomID}`
                                              ).style.width = "0%";
                                            }
                                            if (
                                              aniii.animationName ==
                                              "updateTabToDark"
                                            ) {
                                              console.log(
                                                "Its been to dark: ",
                                                aniii.animationName
                                              );
                                              document.getElementById(
                                                `updateQueryScreen${rawRandomID}`
                                              ).style.backgroundColor =
                                                "#0b0b0b";
                                            }
                                            if (
                                              aniii.animationName ==
                                              "updateTabToNormal"
                                            ) {
                                              document.getElementById(
                                                `updateQueryScreen${rawRandomID}`
                                              ).style.backgroundColor =
                                                "#0c1213";
                                            }
                                          }
                                        );
                                      // This won't excecute if the update tab has already been opened before because this runs in an else if statement that only excecutes of the update tab doesn't exist at all yet
                                      // setTimeout(() => {
                                      // Setting timeout because when click on query to open update tab, the click will register to open and close the tab right away because that same click will also trigger this listener to close the tab
                                      document // Listener to close update tab by clicking out of it
                                        .getElementById("htmlMain")
                                        .addEventListener(
                                          "mousedown",
                                          (updateClickEvt) => {
                                            if (
                                              updateClickEvt.target.className
                                                .split(" ")
                                                .includes("uce") //If an element is in the update tab box, it contains a class of "uce"
                                            ) {
                                              console.log("Contains uce");
                                            } else {
                                              if (
                                                // Doesn't do the animation if update tab is already closed in and not showing
                                                document.getElementById(
                                                  `updateQueryScreen${rawRandomID}`
                                                ).style.width == "40%"
                                              ) {
                                                console.log("no contain");
                                                if (
                                                  // Checking if update tab is in edit mode while trying to close the update tab
                                                  document.getElementById(
                                                    `cancelButtonUpdate${rawRandomID}`
                                                  ).style.display ==
                                                    "initial" &&
                                                  document.getElementById(
                                                    `saveButtonUpdate${rawRandomID}`
                                                  ).style.display ==
                                                    "initial" &&
                                                  document.getElementById(
                                                    `editButtonUpdate${rawRandomID}`
                                                  ).style.display == "none"
                                                ) {
                                                  console.log(
                                                    "Exiting edit mode..."
                                                  );
                                                  // Checking if update tab is in edit mode, send click event to cancel button to discard changes and go out of edit mode
                                                  document
                                                    .getElementById(
                                                      `cancelButtonUpdate${rawRandomID}`
                                                    )
                                                    .click();
                                                }
                                                let newUpdateTab =
                                                  document.getElementById(
                                                    `updateQueryScreen${rawRandomID}`
                                                  );
                                                newUpdateTab.style.animation =
                                                  "";
                                                newUpdateTab.style.animation =
                                                  "pullInUpdateTab 0.3s ease";
                                                resetDimAbleToDarken();
                                                // Array.from(
                                                //   document
                                                //     .getElementById(
                                                //       "ableToDarken"
                                                //     )
                                                //     .getElementsByTagName("div")
                                                // ).forEach((cv) => {
                                                //   cv.style.animation =
                                                //     "fadeBack 0.25s ease";
                                                // });
                                              }
                                            }
                                          }
                                        );
                                      // }, 200);

                                      async function listenForEditRequest() {
                                        console.log("Up here in func");
                                        console.log(
                                          "EDIT ELE SHOULD BE....... ",
                                          document.getElementById(
                                            `editButtonUpdate${rawRandomID}`
                                          )
                                        );
                                        document
                                          .getElementById(
                                            `editButtonUpdate${rawRandomID}`
                                          )
                                          .addEventListener("click", () => {
                                            // Checking if its the first time this edit button has been clicked
                                            let editButtonClickedFirstTime;
                                            if (
                                              Array.from(
                                                document.getElementById(
                                                  `editButtonUpdate${rawRandomID}`
                                                ).classList
                                              ).includes("prototype")
                                            ) {
                                              console.log("first time?");
                                              editButtonClickedFirstTime = true;
                                            } else {
                                              console.log("NOT FIRST TIME");
                                              editButtonClickedFirstTime = false;
                                            }

                                            console.log(
                                              "DA NAME... ",
                                              document.getElementById(
                                                `strongUpdateDisplayTextName${rawRandomID}`
                                              ).value
                                            );
                                            //
                                            let originalUpdateInputFields = {
                                              ogName: document.getElementById(
                                                `strongUpdateDisplayTextName${rawRandomID}`
                                              ).value,
                                              ogEmail: document.getElementById(
                                                `strongUpdateDisplayTextEmail${rawRandomID}`
                                              ).value,
                                              ogPass: document.getElementById(
                                                `strongUpdateDisplayTextPassword${rawRandomID}`
                                              ).value,
                                              ogLink: document
                                                .getElementById(
                                                  `strongUpdateDisplayTextURL${rawRandomID}`
                                                )
                                                .value.trim(),
                                            };

                                            // Making input fields editable
                                            document.getElementById(
                                              `strongUpdateDisplayTextName${rawRandomID}`
                                            ).readOnly = false;
                                            document.getElementById(
                                              `strongUpdateDisplayTextEmail${rawRandomID}`
                                            ).readOnly = false;
                                            document.getElementById(
                                              `strongUpdateDisplayTextPassword${rawRandomID}`
                                            ).readOnly = false;
                                            document.getElementById(
                                              `strongUpdateDisplayTextURL${rawRandomID}`
                                            ).readOnly = false;
                                            // Making input fields editable
                                            //
                                            const updateInputFields = [
                                              document.getElementById(
                                                `strongUpdateDisplayTextName${rawRandomID}`
                                              ),
                                              document.getElementById(
                                                `strongUpdateDisplayTextEmail${rawRandomID}`
                                              ),
                                              document.getElementById(
                                                `strongUpdateDisplayTextPassword${rawRandomID}`
                                              ),
                                              document.getElementById(
                                                `strongUpdateDisplayTextURL${rawRandomID}`
                                              ),
                                            ];

                                            // Listener adds light blue glow if any of the fields become different from the original values
                                            if (editButtonClickedFirstTime) {
                                              updateInputFields.forEach(
                                                (
                                                  updateQueryField,
                                                  queryFieldIndexIndentifer
                                                ) => {
                                                  updateQueryField.addEventListener(
                                                    "keyup",
                                                    () => {
                                                      // The order of "originalUpdateInputFields" and "updateInputFields" are both the same
                                                      // The are both name of query, email of query, password of query, URL of query
                                                      let ogValue =
                                                        Object.values(
                                                          originalUpdateInputFields
                                                        )[
                                                          queryFieldIndexIndentifer
                                                        ];
                                                      if (
                                                        // Checking if value of query field input box has changed
                                                        ogValue.trim() !=
                                                        updateQueryField.value
                                                      ) {
                                                        console.log(
                                                          "NOT EQUAL!!",
                                                          {
                                                            og: ogValue,
                                                            current:
                                                              updateQueryField.value,
                                                          }
                                                        );
                                                        // Light blue box shadow
                                                        updateQueryField.style.boxShadow =
                                                          "rgb(0 218 201) 0px 0px 12px 1px";
                                                      } else {
                                                        // Regular white glow box shadow
                                                        updateQueryField.style.boxShadow =
                                                          "rgb(255 255 255) 0px 0px 12px 1px";
                                                      }
                                                    }
                                                  );
                                                }
                                              );
                                            }

                                            //
                                            let saveButton =
                                              document.getElementById(
                                                `saveButtonUpdate${rawRandomID}`
                                              );
                                            let cancelButton =
                                              document.getElementById(
                                                `cancelButtonUpdate${rawRandomID}`
                                              );
                                            let editButtonUpdate =
                                              document.getElementById(
                                                `editButtonUpdate${rawRandomID}`
                                              );
                                            editButtonUpdate.style.display =
                                              "none";
                                            cancelButton.style.display =
                                              "initial";
                                            // Bug fix //
                                            Array.from(
                                              document.getElementsByClassName(
                                                "cancelButtonUpdate"
                                              )
                                            ).forEach((ele) => {
                                              ele.textContent = "Cancel";
                                            });
                                            // Bug fix //
                                            saveButton.style.display =
                                              "initial";

                                            if (editButtonClickedFirstTime) {
                                              // This is why the prototype class was added
                                              // Checks if this is the first time the update tab is being created
                                              // If this was just ran everytime the update tab was opened, the cancel button and save button click event listeners would stack and would get created multiple times
                                              // This could cause too many writes to the database
                                              console.log(
                                                "STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN STARTING UP LISTENERS AGAIN ....1"
                                              );
                                              cancelButton.addEventListener(
                                                "click",
                                                () => {
                                                  console.log(
                                                    "Should show once cancel"
                                                  );
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextName${rawRandomID}`
                                                  ).value =
                                                    originalUpdateInputFields.ogName;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextEmail${rawRandomID}`
                                                  ).value =
                                                    originalUpdateInputFields.ogEmail;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextPassword${rawRandomID}`
                                                  ).value =
                                                    originalUpdateInputFields.ogPass;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextURL${rawRandomID}`
                                                  ).value =
                                                    originalUpdateInputFields.ogLink;

                                                  // Making input fields NON editable
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextName${rawRandomID}`
                                                  ).readOnly = true;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextEmail${rawRandomID}`
                                                  ).readOnly = true;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextPassword${rawRandomID}`
                                                  ).readOnly = true;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextURL${rawRandomID}`
                                                  ).readOnly = true;
                                                  // Making input fields NON editable

                                                  // Reset visual properties
                                                  document.getElementById(
                                                    `updateQueryScreen${rawRandomID}`
                                                  ).style.animation =
                                                    "updateTabToNormal 0.4s ease";
                                                  updateInputFields.forEach(
                                                    (displayTextInputEle) => {
                                                      displayTextInputEle.style.animation =
                                                        "updateInputBoxesNormal 0.4s ease";
                                                    }
                                                  );
                                                  document.getElementById(
                                                    `saveButtonUpdate${rawRandomID}`
                                                  ).style.display = "none";
                                                  document.getElementById(
                                                    `cancelButtonUpdate${rawRandomID}`
                                                  ).style.display = "none";
                                                  document.getElementById(
                                                    `editButtonUpdate${rawRandomID}`
                                                  ).style.display = "initial";
                                                  // Reset visual properties
                                                }
                                              );
                                              saveButton.addEventListener(
                                                "click",
                                                () => {
                                                  // Making input fields NON editable
                                                  console.log(
                                                    "Save button has been clicked (should only show once)"
                                                  );
                                                  console.log(
                                                    "hh has happened save"
                                                  );
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextName${rawRandomID}`
                                                  ).readOnly = true;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextEmail${rawRandomID}`
                                                  ).readOnly = true;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextPassword${rawRandomID}`
                                                  ).readOnly = true;
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextURL${rawRandomID}`
                                                  ).readOnly = true;
                                                  // Making input fields NON editable

                                                  let nameIsTheSame;
                                                  let emailIsTheSame;
                                                  let passIsTheSame;
                                                  let linkIsTheSame;

                                                  if (
                                                    originalUpdateInputFields.ogName ==
                                                    document.getElementById(
                                                      `strongUpdateDisplayTextName${rawRandomID}`
                                                    ).value
                                                  ) {
                                                    nameIsTheSame = true;
                                                  } else {
                                                    nameIsTheSame = false;
                                                  }
                                                  if (
                                                    originalUpdateInputFields.ogEmail ==
                                                    document.getElementById(
                                                      `strongUpdateDisplayTextEmail${rawRandomID}`
                                                    ).value
                                                  ) {
                                                    emailIsTheSame = true;
                                                  } else {
                                                    emailIsTheSame = false;
                                                  }
                                                  if (
                                                    originalUpdateInputFields.ogPass ==
                                                    document.getElementById(
                                                      `strongUpdateDisplayTextPassword${rawRandomID}`
                                                    ).value
                                                  ) {
                                                    passIsTheSame = true;
                                                  } else {
                                                    passIsTheSame = false;
                                                  }
                                                  if (
                                                    originalUpdateInputFields.ogLink ==
                                                    document
                                                      .getElementById(
                                                        `strongUpdateDisplayTextURL${rawRandomID}`
                                                      )
                                                      .value.trim()
                                                  ) {
                                                    linkIsTheSame = true;
                                                  } else {
                                                    linkIsTheSame = false;
                                                  }
                                                  // setTimeout(() => {
                                                  if (
                                                    // Checks if none of the values were changed so no need to send update request
                                                    nameIsTheSame &&
                                                    emailIsTheSame &&
                                                    passIsTheSame &&
                                                    linkIsTheSame
                                                  ) {
                                                    console.log(
                                                      "Will not update query"
                                                    );
                                                  } else {
                                                    // Code to update values
                                                    console.log(
                                                      "will update query"
                                                    );
                                                    console.log(
                                                      "A normal object: ",
                                                      {
                                                        hey: "oh hey",
                                                        bye: "oh ok bye",
                                                      }
                                                    );
                                                    let objectToUpdate = {}; // Contains all the values to be updated
                                                    async function loadingQueryUpdate() {
                                                      orderNumber -= 1; // Makes the query that is about to be updated go to the top of the screen when its done updating
                                                      objectToUpdate = {};

                                                      // Adding name to object to update
                                                      let newName =
                                                        document.getElementById(
                                                          `strongUpdateDisplayTextName${rawRandomID}`
                                                        ).value;
                                                      objectToUpdate.website =
                                                        newName;
                                                      //

                                                      // Adding email to object to update
                                                      let newEmail =
                                                        document.getElementById(
                                                          `strongUpdateDisplayTextEmail${rawRandomID}`
                                                        ).value;

                                                      objectToUpdate.email =
                                                        newEmail;
                                                      console.log(
                                                        "update doc line 1276"
                                                      );
                                                      //

                                                      // Adding pass to object to update
                                                      let newPass =
                                                        document.getElementById(
                                                          `strongUpdateDisplayTextPassword${rawRandomID}`
                                                        ).value;

                                                      objectToUpdate.pass =
                                                        newPass;
                                                      console.log(
                                                        "update Doc line 1302"
                                                      );
                                                      //

                                                      // Adding link is present boolean value to object to update
                                                      if (
                                                        document
                                                          .getElementById(
                                                            `strongUpdateDisplayTextURL${rawRandomID}`
                                                          )
                                                          .value.trim()
                                                          .length != 0
                                                      ) {
                                                        objectToUpdate.isLink =
                                                          "true";
                                                        console.log(
                                                          "update Doc line 1329"
                                                        );
                                                      } else if (
                                                        document
                                                          .getElementById(
                                                            `strongUpdateDisplayTextURL${rawRandomID}`
                                                          )
                                                          .value.trim()
                                                          .length == 0
                                                      ) {
                                                        objectToUpdate.isLink =
                                                          "false";
                                                        console.log(
                                                          "update doc line 1348"
                                                        );
                                                      }

                                                      // Adding link to object to update
                                                      let newLink =
                                                        document.getElementById(
                                                          `strongUpdateDisplayTextURL${rawRandomID}`
                                                        ).value;

                                                      objectToUpdate.directLink =
                                                        newLink;
                                                      console.log(
                                                        "update doc line 1366"
                                                      );

                                                      //
                                                    }
                                                    loadingQueryUpdate().then(
                                                      async () => {
                                                        /* The "original values" are what we
                                                            are using to determine wether or not
                                                            we should send the update request
                                                            through. Before the user clicks edit,
                                                            we get the values that are in the input
                                                            boxes. When the user clicks save, we 
                                                            check if the input boxes have stayed the
                                                            same. If they have, we don't send the update
                                                            request */

                                                        /* Here we are updating the "original
                                                            values" after the update. Because lets say
                                                            after this update, the user wants to update
                                                            the values back to how they were before.
                                                            The update will not go through because they
                                                            will be detected as the same as the original
                                                            values. So we have to change the "original values"
                                                            to what the values are after the update */

                                                        console.log(
                                                          "THIS IS THE THE THE THE THE LOGGG: ",
                                                          objectToUpdate
                                                        );

                                                        console.log(
                                                          "STRIGIFIED OBJECT TO UPDATE: ",
                                                          JSON.stringify(
                                                            objectToUpdate
                                                          )
                                                        );

                                                        console.log(
                                                          "ban: ",
                                                          sourceDocRef
                                                        );
                                                        const updateUserQuery =
                                                          httpsCallable(
                                                            functions,
                                                            "updateRawData"
                                                          );
                                                        let sourceRef =
                                                          sourceDocRef;

                                                        console.log(
                                                          "SENDING: ",
                                                          userUID
                                                        );

                                                        await updateUserQuery({
                                                          objectToUpdate:
                                                            objectToUpdate,
                                                          hashedSetMasterPassValue:
                                                            hashedSetMasterPassValue,
                                                          sourceRefID:
                                                            sourceRef.id,
                                                          userUID: userUID,
                                                          isLink:
                                                            objectToUpdate.isLink,
                                                          randomID:
                                                            importedData.random,
                                                        })
                                                          .then((result) => {
                                                            console.log(
                                                              "Sucess updateUserQuery"
                                                            );
                                                            console.log(result);
                                                            auth.currentUser
                                                              .getIdTokenResult(
                                                                true
                                                              )
                                                              .then(
                                                                (
                                                                  idTokenResult
                                                                ) => {
                                                                  console.log(
                                                                    "the result ",
                                                                    idTokenResult
                                                                  );
                                                                  console.log(
                                                                    "the result claims ",
                                                                    idTokenResult.claims
                                                                  );
                                                                  document.body.style.pointerEvents =
                                                                    "auto";
                                                                  document.body.style.opacity =
                                                                    "1";
                                                                }
                                                              );
                                                          })
                                                          .then(() => {
                                                            console.log(
                                                              "THIS IS THE THE THE THE THE LOGGG: ",
                                                              objectToUpdate
                                                            );
                                                            if (
                                                              !nameIsTheSame
                                                            ) {
                                                              // Changing the name of the query that shows up on the main dashboard to the updated one
                                                              document.getElementById(
                                                                `shownAppName${rawRandomID}`
                                                              ).value = document.getElementById(
                                                                `strongUpdateDisplayTextName${rawRandomID}`
                                                              ).value;

                                                              // Changing the name of the query that shows up in the update tab
                                                              document.getElementById(
                                                                `updateScreenQueryNameHeader${rawRandomID}`
                                                              ).textContent = document.getElementById(
                                                                `strongUpdateDisplayTextName${rawRandomID}`
                                                              ).value;
                                                            }
                                                            if (
                                                              !emailIsTheSame
                                                            ) {
                                                              // Changing the email of the query that shows up on the main dashboard to the updated one
                                                              document.getElementById(
                                                                `shownEmail${rawRandomID}`
                                                              ).value = document.getElementById(
                                                                `strongUpdateDisplayTextEmail${rawRandomID}`
                                                              ).value;
                                                            }

                                                            if (
                                                              !linkIsTheSame
                                                            ) {
                                                              console.log(
                                                                "LINK IS NOT THE SAME\nLINK IS NOT THE SAME\nLINK IS NOT THE SAME\nLINK IS NOT THE SAME\nLINK IS NOT THE SAME\n"
                                                              );
                                                              // Updating the icon being displayed
                                                              let newWebsiteLink =
                                                                document.getElementById(
                                                                  `strongUpdateDisplayTextURL${rawRandomID}`
                                                                ).value;
                                                              if (
                                                                newWebsiteLink.substring(
                                                                  0,
                                                                  5
                                                                ) == "http:" ||
                                                                newWebsiteLink.substring(
                                                                  0,
                                                                  6
                                                                ) == "https:" ||
                                                                newWebsiteLink.substring(
                                                                  0,
                                                                  7
                                                                ) ==
                                                                  "http://" ||
                                                                newWebsiteLink.substring(
                                                                  0,
                                                                  8
                                                                ) == "https://"
                                                              ) {
                                                                document.getElementById(
                                                                  `icon${rawRandomID}`
                                                                ).src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${newWebsiteLink.trim()}&size=96`;
                                                                document.getElementById(
                                                                  `updateScreenIcon${rawRandomID}`
                                                                ).src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${newWebsiteLink.trim()}&size=96`;
                                                              } else {
                                                                document.getElementById(
                                                                  `icon${rawRandomID}`
                                                                ).src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${newWebsiteLink.trim()}&size=96`;
                                                                document.getElementById(
                                                                  `updateScreenIcon${rawRandomID}`
                                                                ).src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${newWebsiteLink.trim()}&size=96`;
                                                              }

                                                              // Updating the link that gets opened when the user clicks on the icon
                                                              openUrlObject[
                                                                rawRandomID
                                                              ] =
                                                                newWebsiteLink.trim();
                                                              console.log(
                                                                "Updated object: ",
                                                                openUrlObject
                                                              );
                                                              console.log(
                                                                "Updated object for spec raw: ",
                                                                openUrlObject[
                                                                  rawRandomID
                                                                ]
                                                              );
                                                              console.log(
                                                                "ben: ",
                                                                openUrlObject[
                                                                  rawRandomID
                                                                ]
                                                              );
                                                            }
                                                            originalUpdateInputFields =
                                                              {
                                                                ogName:
                                                                  document.getElementById(
                                                                    `strongUpdateDisplayTextName${rawRandomID}`
                                                                  ).value,
                                                                ogEmail:
                                                                  document.getElementById(
                                                                    `strongUpdateDisplayTextEmail${rawRandomID}`
                                                                  ).value,
                                                                ogPass:
                                                                  document.getElementById(
                                                                    `strongUpdateDisplayTextPassword${rawRandomID}`
                                                                  ).value,
                                                                ogLink: document
                                                                  .getElementById(
                                                                    `strongUpdateDisplayTextURL${rawRandomID}`
                                                                  )
                                                                  .value.trim(),
                                                              };
                                                            // Moving query to the top of the screen
                                                            document.getElementById(
                                                              `mainDiv${rawRandomID}`
                                                            ).style.order =
                                                              orderNumber.toString();
                                                          });
                                                      }
                                                    );
                                                  }

                                                  // Reset visual properties
                                                  document.getElementById(
                                                    `updateQueryScreen${rawRandomID}`
                                                  ).style.animation =
                                                    "updateTabToNormal 0.4s ease";
                                                  updateInputFields.forEach(
                                                    (displayTextInputEle) => {
                                                      displayTextInputEle.style.animation =
                                                        "updateInputBoxesNormal 0.4s ease";
                                                    }
                                                  );
                                                  document.getElementById(
                                                    `saveButtonUpdate${rawRandomID}`
                                                  ).style.display = "none";
                                                  document.getElementById(
                                                    `cancelButtonUpdate${rawRandomID}`
                                                  ).style.display = "none";
                                                  document.getElementById(
                                                    `editButtonUpdate${rawRandomID}`
                                                  ).style.display = "initial";
                                                  // Reset visual properties

                                                  // }, 2000);
                                                }
                                              );
                                            }

                                            updateInputFields.forEach(
                                              (displayTextInputEle) => {
                                                displayTextInputEle.style.animation =
                                                  "updateInputBoxesGlow 0.4s ease";
                                              }
                                            );
                                            document.getElementById(
                                              `updateQueryScreen${rawRandomID}`
                                            ).style.animation =
                                              "updateTabToDark 0.4s ease";
                                            document
                                              .getElementById(
                                                `editButtonUpdate${rawRandomID}`
                                              )
                                              .classList.remove("prototype"); // Removing this class indicates that the edit button has been clicked before
                                          });
                                      }
                                      await listenForEditRequest();

                                      document.getElementById(
                                        `updateQueryScreen${rawRandomID}`
                                      ).style.display = "initial";
                                      document.body.style.overflow = "hidden";
                                      document
                                        .getElementById("scrollToTop")
                                        .click();
                                      document.getElementById(
                                        `updateQueryScreen${rawRandomID}`
                                      ).style.animation =
                                        "pushOutUpdateTab 0.3s ease";
                                      console.log("Down here");
                                      // Add listener to close update tab

                                      // THIS HAS BEEN MOVED OUT OF EDIT BUTTON LISTENER TO AVIOD LISTENER STACKING

                                      // document.body.addEventListener(
                                      //   "click",
                                      //   (updateClickEvt) => {
                                      //     if (
                                      //       updateClickEvt.target.className
                                      //         .split(" ")
                                      //         .includes("uce")
                                      //     ) {
                                      //       console.log("Contains uce");
                                      //     } else {
                                      //       console.log("no contain");
                                      //     }
                                      //   }
                                      // );
                                      // // Done with adding listener to close update tab
                                      const showUpdateScreenIcon = async () => {
                                        let websiteLinkForUpdateIcon =
                                          importedData.directLink;
                                        let updateScreenIcon =
                                          document.getElementById(
                                            `updateScreenIcon${rawRandomID}`
                                          );
                                        console.log(
                                          "websiteLinkForUpdateIcon issssssss ",
                                          websiteLinkForUpdateIcon
                                        );
                                        console.log(
                                          "icon element is... ",
                                          updateScreenIcon
                                        );
                                        if (
                                          websiteLinkForUpdateIcon.substring(
                                            0,
                                            5
                                          ) == "http:" ||
                                          websiteLinkForUpdateIcon.substring(
                                            0,
                                            6
                                          ) == "https:" ||
                                          websiteLinkForUpdateIcon.substring(
                                            0,
                                            7
                                          ) == "http://" ||
                                          websiteLinkForUpdateIcon.substring(
                                            0,
                                            8
                                          ) == "https://"
                                        ) {
                                          updateScreenIcon.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${websiteLinkForUpdateIcon.trim()}&size=96`; // Can change back to 96
                                        } else {
                                          updateScreenIcon.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${websiteLinkForUpdateIcon.trim()}&size=96`;
                                        }
                                      };
                                      await showUpdateScreenIcon();

                                      //
                                      // Array.from(
                                      //   document
                                      //     .getElementById("ableToDarken")
                                      //     .getElementsByTagName("div")
                                      // ).forEach((cv) => {
                                      //   cv.style.animation =
                                      //     "fadeSlight 0.25s ease";
                                      // });
                                      dimAbleToDarken();
                                      //
                                      const displayAllCurrentInfoUpdate =
                                        async () => {
                                          let displayNameForUpdateIcon =
                                            importedData.website;
                                          let displayEmailForUpdateIcon =
                                            importedData.email;
                                          let displayPasswordForUpdateIcon =
                                            importedData.pass;
                                          let displayURLForUpdateIcon =
                                            importedData.directLink;
                                          document.getElementById(
                                            `updateScreenQueryNameHeader${rawRandomID}`
                                          ).textContent =
                                            displayNameForUpdateIcon
                                              .substring(0, 1)
                                              .toUpperCase() +
                                            displayNameForUpdateIcon.substring(
                                              1,
                                              displayNameForUpdateIcon.length
                                            );
                                          console.log(
                                            "THE EMAILLLL: ",
                                            displayEmailForUpdateIcon
                                          );
                                          document.getElementById(
                                            `strongUpdateDisplayTextName${rawRandomID}`
                                          ).value =
                                            displayNameForUpdateIcon.trim();
                                          document.getElementById(
                                            `strongUpdateDisplayTextEmail${rawRandomID}`
                                          ).value =
                                            displayEmailForUpdateIcon.trim();
                                          document.getElementById(
                                            `strongUpdateDisplayTextPassword${rawRandomID}`
                                          ).value =
                                            displayPasswordForUpdateIcon.trim();
                                          document.getElementById(
                                            `strongUpdateDisplayTextURL${rawRandomID}`
                                          ).value =
                                            displayURLForUpdateIcon.trim();
                                        };
                                      await displayAllCurrentInfoUpdate();
                                    }
                                    //
                                  }
                                  showNewUpdateScreen();
                                }
                                // Other animation listeners
                              }); // End of event listener
                            document
                              .getElementById(`editContainer${rawRandomID}`)
                              .classList.add("toggler");
                          }
                          async function eyeToggleAddFunction() {
                            let eyeContainer = document.createElement("div");
                            eyeContainer.setAttribute(
                              "id",
                              `eyeContainer${rawRandomID}`
                            );
                            document
                              .getElementById(`threeToggles${rawRandomID}`)
                              .appendChild(eyeContainer);
                            document
                              .getElementById(`eyeContainer${rawRandomID}`)
                              .classList.add("eyeContainer");
                            let eye = document.createElement("i");
                            eye.setAttribute("id", `eye${rawRandomID}`);
                            document
                              .getElementById(`eyeContainer${rawRandomID}`)
                              .appendChild(eye);
                            document
                              .getElementById(`eye${rawRandomID}`)
                              .setAttribute("class", "far fa-eye");
                            document
                              .getElementById(`eye${rawRandomID}`)
                              .classList.add("eyeClass");
                            // Password Shower //

                            const togglePassword = document.getElementById(
                              `eyeContainer${rawRandomID}`
                            );
                            const password = document.getElementById(
                              `hiddenPasswordInputBox${rawRandomID}`
                            );
                            if (importedData.isLink == "true") {
                              document.getElementById(
                                `eyeContainer${rawRandomID}`
                              ).style.marginTop = "1.2%";
                            } else {
                              document.getElementById(
                                `eyeContainer${rawRandomID}`
                              ).style.marginTop = "0.9%";
                            }
                            togglePassword.addEventListener(
                              "click",
                              function (e) {
                                // toggle the type attribute
                                const type =
                                  password.getAttribute("type") === "password"
                                    ? "text"
                                    : "password";
                                password.setAttribute("type", type);
                                // toggle the eye slash icon
                                document
                                  .getElementById(`eye${rawRandomID}`)
                                  .classList.toggle("fa-eye-slash");
                              }
                            );
                            document
                              .getElementById(`eyeContainer${rawRandomID}`)
                              .classList.add("toggler");
                            // Password Shower //
                          }

                          async function websiteRedirectFunction() {
                            // Website Redirect //
                            let decryptedLink = importedData.directLink;
                            openUrlObject[rawRandomID] = decryptedLink;
                            let urlStringBool = importedData.isLink;
                            if (urlStringBool == "true") {
                              document
                                .getElementById(`icon${rawRandomID}`)
                                .addEventListener("click", () => {
                                  if (importedData.isLink == "true") {
                                    let linkFromObject =
                                      /* This value will change if the user
                                    updates the url*/
                                      openUrlObject[rawRandomID];
                                    if (linkFromObject.trim() != "") {
                                      /* This if statement checks
                                    if the user deleted the url in an update */
                                      /* If the query just didn't have a url by default, than importedData.isLink would equal false
                                    so this if statement wouldn't even be running */
                                      if (
                                        linkFromObject.includes("http") &&
                                        linkFromObject.includes("://")
                                      ) {
                                        nw.Shell.openExternal(linkFromObject);
                                      } else {
                                        nw.Shell.openExternal(
                                          "http://" + linkFromObject
                                        );
                                      }
                                    }
                                  }
                                });
                            }

                            // Website Redirect //
                          }

                          async function activate() {
                            await createThreeContainerHolder();
                            await showUserAndPass();
                            await websiteRedirectFunction();
                            await requestUpdateQueryFunction();
                            await eyeToggleAddFunction();
                          }
                          activate();
                        }

                        listOfDecryptedObjectsAndIDs.forEach(async (e) => {
                          // Going through dercypted documents and displaying them on the dashboard
                          let docToShow;
                          let docToShowID;
                          e.forEach((i) => {
                            if (typeof i == "object") {
                              docToShow = i;
                            } else if (typeof i == "string") {
                              docToShowID = i;
                            }
                          });
                          const docToShowRef = doc(
                            db,
                            "users",
                            "filler",
                            userUID,
                            "mpaps",
                            "ps",
                            docToShowID
                          );
                          await startUpShow(docToShow, docToShowRef);
                        });
                      } else {
                        // User entered an incorrect master password
                        document.getElementById(
                          "newAndEnterMasterPasswordField"
                        ).style.borderBottom = "1px solid rgb(132, 66, 66)";
                      }
                    }
                    //
                    setTimeout(() => {
                      // Focuses login or create master pass input field when page loads
                      document
                        .getElementById("newAndEnterMasterPasswordField")
                        .focus();
                    }, 500);

                    //
                    document
                      .getElementById("confirmMasterPasswordButton")
                      .addEventListener("click", () => {
                        checkRequestedMP();
                      });
                    document
                      .getElementById("newAndEnterMasterPasswordField")
                      .addEventListener("keyup", (evt) => {
                        if (evt.keyCode === 13) {
                          document
                            .getElementById("confirmMasterPasswordButton")
                            .click();
                        }
                      });
                  } else {
                    // User does NOT have a master password set up
                    document.getElementById("renterMP").style.display =
                      "initial";

                    // Making padding 2% for input boxes because we are adding the password strength meter
                    let enterMasterPassBox = document.getElementById(
                      "newMasterPasswordField"
                    );
                    let confirmMasterPassBox =
                      document.getElementById("renterMP");
                    enterMasterPassBox.style.paddingBottom = "2%";
                    confirmMasterPassBox.style.paddingBottom = "2%";
                    //
                    console.log(tempSnap.data(), " doesn't exist :(");
                    document.body.style.pointerEvents = "none";
                    document.getElementById(
                      "setupMasterPasswordScreen"
                    ).style.display = "initial";
                    document.getElementById(
                      "setupMasterPasswordScreen"
                    ).style.pointerEvents = "auto";
                    document.body.style.opacity = ".65";

                    //----------------------Creating master password----------------------//
                    document
                      .getElementById("confirmMasterPasswordButton")
                      .addEventListener("click", async () => {
                        let rawMPInput = document
                          .getElementById("newMasterPasswordField")
                          .value.trim();
                        let rawREMPInput = document
                          .getElementById("renterMP")
                          .value.trim();
                        if (rawMPInput == rawREMPInput) {
                          let correctPasswordHash = crypto
                            .createHash("sha512")
                            .update(rawMPInput)
                            .digest("hex");
                          if (
                            document.getElementById("passwordStrengthBar")
                              .value == 4 ||
                            document.getElementById("passwordStrengthBar")
                              .value == 3
                          ) {
                            // The strength of the password is determined by the "zxcvbn" library that I imported in the "mainPage.html" file
                            hashedSetMasterPassValue = correctPasswordHash; /* 
                            Just making a variable that has the correct hash of the
                            master password so we can reference it when we need to do things
                            like encrypt or decrypt passwords*/

                            let randomStringToBeEncrypted =
                              await generateRandomString(250); // See line 145 for details
                            currentEncryptedString = CryptoJS.AES.encrypt(
                              // Encrypting the random string with the master pass hash as the key
                              randomStringToBeEncrypted,
                              correctPasswordHash
                            ).toString();
                            randomStringToBeEncrypted = undefined;

                            const batch = writeBatch(db);
                            batch.set(doc(refForMSCheck), {
                              mph: currentEncryptedString, // See line 145 for details
                            });
                            batch.set(refForMainUID, {
                              fillData: "--",
                            });
                            await batch.commit();
                            await startUpSettingsListeners(); /* After user makes their
                              account, we start up the listeners for settings so the user can 
                              navigate the settings page */

                            document.getElementById(
                              "setupMasterPasswordScreen"
                            ).style.display = "none";
                            document.body.style.pointerEvents = "auto";
                            document.body.style.opacity = "1";
                          } else {
                            document.getElementById(
                              "newMasterPasswordField"
                            ).style.borderBottom = "2px solid #844242";
                            document.getElementById(
                              "renterMP"
                            ).style.borderBottom = "2px solid #844242";
                            document.getElementById(
                              "createMPError"
                            ).textContent = "Password is too weak";
                            document.getElementById(
                              "confirmMasterPasswordButton"
                            ).style.marginTop = "4%";
                          }
                        } else {
                          console.log("diff");
                          document.getElementById(
                            "newMasterPasswordField"
                          ).style.borderBottom = "2px solid #844242";

                          document.getElementById(
                            "renterMP"
                          ).style.borderBottom = "2px solid #844242";
                          document.getElementById("createMPError").textContent =
                            "Passwords do not match";
                          document.getElementById(
                            "confirmMasterPasswordButton"
                          ).style.marginTop = "4%";
                        }
                      });
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            };
            checkIfUIDExistsInFS();
            // auth.currentUser.getIdTokenResult(true)
            // auth.currentUser.getIdTokenResult(true).then((idTokenResult) => {
            //   console.log("the result ", idTokenResult);
            //   console.log("the result claims ", idTokenResult.claims);
            // });
            //----------------------Checking if master password exists----------------------//

            // Animation end listeners //
            Array.from(
              document
                .getElementById("ableToDarken")
                .getElementsByTagName("div")
            )[0].addEventListener("animationend", (anii) => {
              console.log("fade ani trig");
              if (anii.animationName == "fadeSlight") {
                Array.from(
                  document
                    .getElementById("ableToDarken")
                    .getElementsByTagName("div")
                ).forEach((cv) => {
                  cv.style.opacity = "0.7";
                });
                document.getElementById("ableToDarken").style.pointerEvents =
                  "none";
                document.getElementById("ableToDarken").style.userSelect =
                  "none";
              } else if (anii.animationName == "fadeBack") {
                console.log("ITS ELSE IF!!!!!!");
                Array.from(
                  document
                    .getElementById("ableToDarken")
                    .getElementsByTagName("div")
                ).forEach((cv) => {
                  cv.style.opacity = "1";
                });
                document.getElementById("ableToDarken").style.pointerEvents =
                  "auto";
                document.getElementById("ableToDarken").style.userSelect =
                  "auto";
              }
            });
          };
          init();
        } else {
          // Checks if user is signed out
          console.log("User is signed out");
          // User is signed out
          // ...
        }
      } else {
        console.log("Already initiated");
      }
    });
  }
  mainInit();
} catch (err) {
  console.log(err);
}
