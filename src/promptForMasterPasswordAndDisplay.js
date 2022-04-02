// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
// import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js";

import {
  getAuth,
  onAuthStateChanged,
  getIdTokenResult,
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
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";

// import {} from "nw.js";

const crypto = require("crypto");
const CryptoJS = require("crypto-js");

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
try {
  try {
    const app = initializeApp(firebaseConfig);
  } catch (err) {
    console.log(err);
  }
  const db = getFirestore(); // Changed from getDatabase() to getFirestore()
  async function mainInit() {
    // async function waitForAuth() {
    //   return getAuth();
    // }
    const auth = getAuth();
    setTimeout(() => {
      const mainUser = auth.currentUser;
      const init = async () => {
        let userUID = mainUser.uid;
        // try {
        //   console.log("1 TOKEN ", mainUser.token);
        // } catch (err) {
        //   console.log(err);
        // }
        // try {
        //   console.log("2 TOKEN ", userUID.token);
        // } catch (err) {
        //   console.log(err);
        // }
        // try {
        //   console.log("3 TOKEN ", userUID.uid.token);
        // } catch (err) {
        //   console.log(err);
        // }
        // try {
        //   console.log("4 TOKEN ", auth.user.refreshToken);
        // } catch (err) {
        //   console.log(err);
        // }
        // try {
        //   console.log("5 TOKEN ", auth.user);
        // } catch (err) {
        //   console.log(err);
        // }

        console.log(userUID);
        // let originalMarginTop = 0.3;
        let originalMarginTop = 0.0;
        let refForMainUID = doc(db, "users", "filler", userUID, "mpaps");
        let refForMS = collection(
          db,
          "users",
          "filler",
          userUID,
          "mpaps",
          "ms"
        );
        let refForPS = query(
          collection(db, "users", "filler", userUID, "mpaps", "ps"),
          orderBy("nummy", "desc")
        );
        function encryptFunction(textToBeEncrypted, finalKey) {
          let key = finalKey;
          let data = CryptoJS.AES.encrypt(textToBeEncrypted, key);
          data = data.toString();
          return data;
        }

        const encryptWithMP = async (unencryptedText) => {
          let receivedMPH;
          const docSnap = await getDocs(refForMS);
          // console.log("Main docSnap ", docSnap);
          // console.log("LENGTH IS ", docSnap.size);
          docSnap.forEach((doc) => {
            receivedMPH = doc.data().mph;
          });
          return encryptFunction(unencryptedText, receivedMPH);
        };
        function decryptFunction(textToBeDecrypted, finalKey) {
          let key = finalKey;
          let decr = CryptoJS.AES.decrypt(textToBeDecrypted, key);
          decr = decr.toString(CryptoJS.enc.Utf8);

          return decr;
        }
        const decryptWithMP = async (encryptedText) => {
          let receivedMPH;
          const docSnap = await getDocs(refForMS);
          // console.log("Main docSnap ", docSnap);
          // console.log("LENGTH IS ", docSnap.size);
          docSnap.forEach((doc) => {
            receivedMPH = doc.data().mph;
          });
          return decryptFunction(encryptedText, receivedMPH);
        };
        async function getCorrectHash() {
          let receivedMPH;
          const docSnapGetHash = await getDocs(refForMS);
          // console.log("Main docSnap ", docSnap);
          // console.log("LENGTH IS ", docSnap.size);
          docSnapGetHash.forEach((doc) => {
            receivedMPH = doc.data().mph;
          });
          return receivedMPH;
        }

        const writeBlankDataToFS = async () => {
          // WRITE
          //.
          //This is for the exists method to work
          const docRefForUID = await setDoc(refForMainUID, {
            fillData: "--",
          })
            .then(() => {
              alert("Data added successfully");
            })
            .catch((err) => {
              alert("Error has been logged");
              console.log(err);
            });
          ////.
          //
          // WRITE
        };
        const writeMPToFS = async (hashedMP) => {
          // WRITE
          //.
          const docRefForUID = await addDoc(refForMS, {
            mph: hashedMP,
          })
            .then(() => {
              alert("Data added successfully");
            })
            .catch((err) => {
              alert("Error has been logged");
              console.log(err);
            });
          ////.
          //
          // WRITE
        };
        // const writeQueryToFS = async () => {
        //   const docRefForMP = await addDoc(refForPSAdder, {
        //     user: "Supposed username encrpted my hashed masspass",
        //     pass: "Supposed password encrpted my hashed masspass",
        //     website: "Supposed website encrpted my hashed masspass",
        //     isLink: "Supposed isLink encrpted my hashed masspass",
        //     decidedKey: "Supposed decidedKey encrpted my hashed masspass",
        //     directLink: "Supposed directLink encrpted my hashed masspass",
        //   })
        //     .then(() => {
        //       alert("Data added successfully");
        //     })
        //     .catch((err) => {
        //       alert("Error has been logged");
        //       console.log(err);
        //     });
        // };
        // const docSnap = await getDocs(refForPS);
        // console.log("Main docSnap ", docSnap);
        // console.log("LENGTH IS ", docSnap.size);
        // docSnap.forEach((doc) => {
        //   console.log("This is docSnap data in for loop ", doc.data());
        // });
        //----------------------Checking if master password exists----------------------//
        // getDoc(refForMainUID).then((tempSnap) => {
        //   console.log("temp issssssssss ", tempSnap);
        //   console.log("If snap exists or not isssssssss ", tempSnap.exists());
        // });
        ///////
        const checkIfUIDExistsInFS = async () => {
          getDoc(refForMainUID)
            .then((tempSnap) => {
              console.log("temp is ", tempSnap);
              console.log("If snap exists or not is ", tempSnap.exists());
              if (tempSnap.exists()) {
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
                // document.getElementById("timeToCrack").id = "timeToCrackEnter";
                // document.getElementById("timeToCrackEnter").textContent =
                //   "Enter your master password in the field above";
                document.getElementById("passwordStrengthBar").style.display =
                  "none";
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
                document.getElementById("renterMP").style.display = "none";

                //----------------------Check if master password is correct----------------------//
                async function checkRequestedMP() {
                  let correctH = await getCorrectHash();
                  let rawRequest = document.getElementById(
                    "newAndEnterMasterPasswordField"
                  ).value;
                  let hashedRequest = crypto
                    .createHash("sha512")
                    .update(rawRequest)
                    .digest("hex");
                  if (correctH == hashedRequest) {
                    document.getElementById(
                      "setupMasterPasswordScreen"
                    ).style.display = "none";
                    document.body.style.pointerEvents = "auto";
                    document.body.style.opacity = "1";
                    // Add settings option
                    function ieSettingsFunction() {
                      document
                        .getElementById("settingsButton")
                        .addEventListener("click", () => {
                          document.body.style.userSelect = "none";
                          document.getElementById(
                            "settingsScreen"
                          ).style.userSelect = "auto";
                          document.body.style.pointerEvents = "none";
                          document.body.style.opacity = ".5";
                          document.getElementById(
                            "settingsScreen"
                          ).style.display = "initial";
                          document.getElementById(
                            "settingsScreen"
                          ).style.pointerEvents = "auto";
                          document.getElementById(
                            "settingsScreen"
                          ).style.opacity = "1";
                        });
                      document
                        .getElementById("closeSettings")
                        .addEventListener("click", () => {
                          document.body.style.userSelect = "auto";
                          document.getElementById(
                            "settingsScreen"
                          ).style.userSelect = "none";
                          document.body.style.pointerEvents = "auto";
                          document.body.style.opacity = "1";
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
                      // Add all setting buttton listeners under this line
                      document
                        .getElementById("SAinfoSettingsButton")
                        .addEventListener("click", () => {
                          document.getElementById("fromMainToAccount").click();
                        });
                    }
                    ieSettingsFunction();
                    // Add settings option (end)
                    const docSnapp = await getDocs(refForPS);
                    console.log("DADOC ", docSnapp);
                    async function startListenerToCloseUpdateTab() {
                      document // Referencing html instead of body because the body has large margins around it (clicks won't register there)
                        .getElementById("htmlMain")
                        .addEventListener("click", (updateClickEvt) => {
                          if (
                            updateClickEvt.target.className
                              .split(" ")
                              .includes("uce")
                          ) {
                            console.log("Contains uce");
                          } else {
                            console.log("no contain");
                          }
                        });
                      // Done with adding listener to close update tab
                    }
                    await startListenerToCloseUpdateTab();
                    async function startUpShow(sourceDoc) {
                      const importedData = sourceDoc.data();
                      console.log("Secondary ", sourceDoc.data());
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
                          let websiteLink = await decryptWithMP(
                            importedData.directLink
                          );
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
                          let firstLetterOfAppName = await decryptWithMP(
                            importedData.website
                          );
                          firstLetterOfAppName =
                            firstLetterOfAppName[0].toUpperCase();
                          console.log("First letter is ", firstLetterOfAppName);
                          let letterBox = document.createElement("div");
                          letterBox.style.backgroundColor =
                            listOfColors[
                              Math.floor(Math.random() * listOfColors.length)
                            ];
                          letterBox.setAttribute(
                            "id",
                            `letterBox${rawRandomID}`
                          );
                          let letterBoxLetter = document.createElement("h4");
                          letterBoxLetter.textContent = firstLetterOfAppName;
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
                        let decryptedShownAppName = await decryptWithMP(
                          importedData.website
                        );
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
                        shownEmail.value = await decryptWithMP(
                          importedData.user
                        );
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
                        //   let hiddenPasswordInputBox =
                        //     document.createElement("input");
                        //   hiddenPasswordInputBox.value = await decryptWithMP(
                        //     importedData.pass
                        //   );
                        //   hiddenPasswordInputBox.type = "password";
                        //   hiddenPasswordInputBox.setAttribute(
                        //     "id",
                        //     `hiddenPasswordInputBox${rawRandomID}`
                        //   );
                        //   hiddenPasswordInputBox.readOnly = true;
                        //   document
                        //     .getElementById(`subInfoSpan${rawRandomID}`)
                        //     .appendChild(hiddenPasswordInputBox);
                        //   document
                        //     .getElementById(
                        //       `hiddenPasswordInputBox${rawRandomID}`
                        //     )
                        //     .classList.add("hiddenPasswordInputBox");
                      }
                      async function requestUpdateQueryFunction() {
                        // let editContainer = document.createElement("div");
                        // editContainer.setAttribute(
                        //   "id",
                        //   `editContainer${rawRandomID}`
                        // );
                        // document
                        //   .getElementById(`threeToggles${rawRandomID}`)
                        //   .appendChild(editContainer);
                        // document
                        //   .getElementById(`editContainer${rawRandomID}`)
                        //   .classList.add("editContainer");
                        // let edit = document.createElement("i");
                        // edit.setAttribute("id", `edit${rawRandomID}`);
                        // document
                        //   .getElementById(`editContainer${rawRandomID}`)
                        //   .appendChild(edit);
                        // document
                        //   .getElementById(`edit${rawRandomID}`)
                        //   .setAttribute("class", "fas fa-pen");
                        // document
                        //   .getElementById(`edit${rawRandomID}`)
                        //   .classList.add("editClass");
                        // if (importedData.isLink == "true") {
                        //   document.getElementById(
                        //     `editContainer${rawRandomID}`
                        //   ).style.marginTop = "1.2%";
                        // } else {
                        //   document.getElementById(
                        //     `editContainer${rawRandomID}`
                        //   ).style.marginTop = "0.9%";
                        // }
                        // let refForPS = collection(
                        //   db,
                        //   "users",
                        //   "filler",
                        //   userUID,
                        //   "mpaps",
                        //   "ps"
                        // );

                        document
                          .getElementById(`mainDiv${rawRandomID}`)
                          .addEventListener("click", async (clickedEvt) => {
                            // document.getElementById(
                            //   "editButtonUpdate"
                            // ).id = `editButtonUpdate${rawRandomID}`;

                            //
                            if (
                              clickedEvt.target.className.includes("infoDiv") ||
                              clickedEvt.target.className.includes(
                                "mainDivClass"
                              ) ||
                              clickedEvt.target.className.includes(
                                "shownAppName"
                              ) ||
                              clickedEvt.target.className.includes("shownEmail")
                            ) {
                              //
                              async function checkIfUpdateScreenExists() {
                                let arrayOfExistingUpdateScreens = [];
                                async function createAndAddUpdatesCheckList() {
                                  Array.from(
                                    Array.from(
                                      document.getElementsByClassName("mc")
                                    )[0].children
                                  ).forEach((eleS) => {
                                    if (eleS.tagName == "SPAN") {
                                      if (eleS.id != "ableToDarken") {
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
                                  }
                                }
                                await createAndAddUpdatesCheckList();
                                return await confirmUpdateList();
                              }
                              async function showNewUpdateScreen() {
                                let updateExists =
                                  await checkIfUpdateScreenExists();
                                if (updateExists == true) {
                                  console.log("true");
                                } else if (updateExists == undefined) {
                                  console.log("false");
                                  const mcParent = Array.from(
                                    document.getElementsByClassName("mc")
                                  )[0];
                                  let htmlOfNewUpdateScreen = `
                                <div id="updateQueryScreen${rawRandomID}" class="updateQueryScreen uce">
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
                                          <button id="editButtonUpdate${rawRandomID}" class="editButtonUpdate uce">Edit</button>
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
                                    </tfoot>
                                  </table>
                                </div>
                                `;
                                  let updateHolder =
                                    document.createElement("span");
                                  updateHolder.innerHTML =
                                    htmlOfNewUpdateScreen;
                                  mcParent.appendChild(updateHolder);
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
                                          // console.log(
                                          //   "ANIIIEND BOXSHADOW: ",
                                          //   eleani
                                          // );
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
                                          ).style.backgroundColor = "#0b0b0b";
                                        }
                                        if (
                                          aniii.animationName ==
                                          "updateTabToNormal"
                                        ) {
                                          document.getElementById(
                                            `updateQueryScreen${rawRandomID}`
                                          ).style.backgroundColor = "#0c1213";
                                        }
                                      }
                                    );

                                  // let newUpdateChart = document.createElement("div");
                                  // newUpdateChart.id = `updateQueryScreen${rawRandomID}`;
                                  // newUpdateChart.className = "updateQueryScreen";
                                  // newUpdateChart.style.display = "none";
                                  // //
                                  // let queryInfoTable =
                                  //   document.createElement("table");
                                  // queryInfoTable.id = `queryInfoTable${rawRandomID}`;
                                  // queryInfoTable.className = "queryInfoTable";
                                  // queryInfoTable.style.display = "none";
                                  // //
                                  // newUpdateChart.appendChild(queryInfoTable);
                                  // mcParent.appendChild(newUpdateChart);
                                  const cloneEditButtons = async () => {
                                    let editClone = Array.from(
                                      document.getElementsByClassName(
                                        "editButtonUpdate"
                                      )
                                    )[0].cloneNode(true);

                                    editClone.id = `editButtonUpdate${rawRandomID}`;

                                    Array.from(
                                      document.getElementsByClassName(
                                        "editButtonUpdate"
                                      )
                                    )[0].replaceWith(editClone);
                                    //

                                    let saveClone = Array.from(
                                      document.getElementsByClassName(
                                        "saveButtonUpdate"
                                      )
                                    )[0].cloneNode(true);

                                    saveClone.id = `saveButtonUpdate${rawRandomID}`;

                                    Array.from(
                                      document.getElementsByClassName(
                                        "saveButtonUpdate"
                                      )
                                    )[0].replaceWith(saveClone);
                                    //

                                    let cancelClone = Array.from(
                                      document.getElementsByClassName(
                                        "cancelButtonUpdate"
                                      )
                                    )[0].cloneNode();

                                    cancelClone.id = `cancelButtonUpdate${rawRandomID}`;

                                    Array.from(
                                      document.getElementsByClassName(
                                        "cancelButtonUpdate"
                                      )
                                    )[0].replaceWith(cancelClone);

                                    // document.getElementById(
                                    //   "cancelButtonUpdate"
                                    // ).id = `cancelButtonUpdate${rawRandomID}`;
                                    //
                                    // Update Listeners // (Putting here to aviod listener stacking)
                                    console.log("Just up here");
                                  };
                                  // await cloneEditButtons();
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
                                        //
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
                                        editButtonUpdate.style.display = "none";
                                        cancelButton.style.display = "initial";
                                        // Bug fix //
                                        Array.from(
                                          document.getElementsByClassName(
                                            "cancelButtonUpdate"
                                          )
                                        ).forEach((ele) => {
                                          ele.textContent = "Cancel";
                                        });
                                        // Bug fix //
                                        saveButton.style.display = "initial";
                                        cancelButton.addEventListener(
                                          "click",
                                          () => {
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
                                            console.log("hh has happened save");
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
                                              console.log("will update query");
                                              async function toUpdatingTimestamp() {
                                                updateDoc(sourceDoc.ref, {
                                                  nummy: serverTimestamp(),
                                                });
                                                console.log(
                                                  "nummy has been updated"
                                                );
                                              }
                                              toUpdatingTimestamp();
                                              if (nameIsTheSame == false) {
                                                async function toUpdatingName() {
                                                  let newName =
                                                    await encryptWithMP(
                                                      document.getElementById(
                                                        `strongUpdateDisplayTextName${rawRandomID}`
                                                      ).value
                                                    );
                                                  // docSnapToUpdate.forEach((docToUD) => {
                                                  updateDoc(sourceDoc.ref, {
                                                    website: newName,
                                                  });
                                                  console.log(
                                                    "website/name has been updated"
                                                  );
                                                }
                                                toUpdatingName();
                                              }
                                              if (emailIsTheSame == false) {
                                                async function toUpdatingEmail() {
                                                  let newEmail =
                                                    await encryptWithMP(
                                                      document.getElementById(
                                                        `strongUpdateDisplayTextEmail${rawRandomID}`
                                                      ).value
                                                    );
                                                  // docSnapToUpdate.forEach((docToUD) => {
                                                  updateDoc(sourceDoc.ref, {
                                                    user: newEmail,
                                                  });
                                                  console.log(
                                                    "email has been updated"
                                                  );
                                                }
                                                toUpdatingEmail();
                                              }
                                              if (passIsTheSame == false) {
                                                async function toUpdatingPass() {
                                                  let newPass =
                                                    await encryptWithMP(
                                                      document.getElementById(
                                                        `strongUpdateDisplayTextPassword${rawRandomID}`
                                                      ).value
                                                    );
                                                  updateDoc(sourceDoc.ref, {
                                                    pass: newPass,
                                                  });
                                                  console.log(
                                                    "pass has been updated"
                                                  );
                                                }
                                                toUpdatingPass();
                                              }
                                              if (linkIsTheSame == false) {
                                                async function toUpdatingLink() {
                                                  if (
                                                    originalUpdateInputFields.ogLink.trim()
                                                      .length == 0 &&
                                                    document
                                                      .getElementById(
                                                        `strongUpdateDisplayTextURL${rawRandomID}`
                                                      )
                                                      .value.trim() != 0
                                                  ) {
                                                    updateDoc(sourceDoc.ref, {
                                                      isLink: "true",
                                                    });
                                                  } else if (
                                                    originalUpdateInputFields.ogLink.trim()
                                                      .length != 0 &&
                                                    document
                                                      .getElementById(
                                                        `strongUpdateDisplayTextURL${rawRandomID}`
                                                      )
                                                      .value.trim() == 0
                                                  ) {
                                                    updateDoc(sourceDoc.ref, {
                                                      isLink: "false",
                                                    });
                                                  }

                                                  let newLink =
                                                    await encryptWithMP(
                                                      document.getElementById(
                                                        `strongUpdateDisplayTextURL${rawRandomID}`
                                                      ).value
                                                    );
                                                  updateDoc(sourceDoc.ref, {
                                                    directLink: newLink,
                                                  });
                                                  console.log(
                                                    "direct link has been updated"
                                                  );
                                                }
                                                toUpdatingLink();
                                              }
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
                                      await decryptWithMP(
                                        importedData.directLink
                                      );
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
                                  Array.from(
                                    document
                                      .getElementById("ableToDarken")
                                      .getElementsByTagName("div")
                                  ).forEach((cv) => {
                                    cv.style.animation =
                                      "fadeSlight 0.25s ease";
                                  });
                                  //
                                  const displayAllCurrentInfoUpdate =
                                    async () => {
                                      let displayNameForUpdateIcon =
                                        await decryptWithMP(
                                          importedData.website
                                        );
                                      let displayEmailForUpdateIcon =
                                        await decryptWithMP(importedData.user);
                                      let displayPasswordForUpdateIcon =
                                        await decryptWithMP(importedData.pass);
                                      let displayURLForUpdateIcon =
                                        await decryptWithMP(
                                          importedData.directLink
                                        );
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
                                      ).value = displayNameForUpdateIcon.trim();
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
                                      ).value = displayURLForUpdateIcon.trim();
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
                        togglePassword.addEventListener("click", function (e) {
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
                        });
                        document
                          .getElementById(`eyeContainer${rawRandomID}`)
                          .classList.add("toggler");
                        // Password Shower //
                      }
                      async function trash() {
                        // Trash Icon //
                        let trashContainer = document.createElement("div");
                        trashContainer.setAttribute(
                          "id",
                          `trashContainer${rawRandomID}`
                        );
                        document
                          .getElementById(`threeToggles${rawRandomID}`)
                          .appendChild(trashContainer);
                        document
                          .getElementById(`trashContainer${rawRandomID}`)
                          .classList.add("trashContainer");
                        let trash = document.createElement("i");
                        trash.setAttribute("id", `trash${rawRandomID}`);
                        document
                          .getElementById(`trashContainer${rawRandomID}`)
                          .appendChild(trash);
                        document
                          .getElementById(`trash${rawRandomID}`)
                          .setAttribute("class", "far fa-trash-alt");
                        document
                          .getElementById(`trash${rawRandomID}`)
                          .classList.add("trashClass");
                        if (importedData.isLink == "true") {
                          document.getElementById(
                            `trashContainer${rawRandomID}`
                          ).style.marginTop = "1.2%";
                        } else {
                          document.getElementById(
                            `trashContainer${rawRandomID}`
                          ).style.marginTop = "0.9%";
                        }
                        document
                          .getElementById(`trashContainer${rawRandomID}`)
                          .addEventListener("click", () => {
                            async function deleteOne() {
                              // const docRefToDelete = query(
                              //   collection(db, userUID, "mpaps", "ps"),
                              //   where("random", "==", rawRandomID)
                              // );
                              const docSnapToDelete = await getDocs(
                                query(
                                  collection(
                                    db,
                                    "users",
                                    "filler",
                                    userUID,
                                    "mpaps",
                                    "ps"
                                  ),
                                  where("random", "==", rawRandomID)
                                )
                              );
                              // console.log("snap is ", docSnapToDelete);
                              // );
                              docSnapToDelete.forEach((doc) => {
                                console.log(sourceDoc.data());
                                console.log("The ref ", sourceDoc.ref);
                                deleteDoc(sourceDoc.ref);
                              });
                              // console.log("plain ", docRefToDelete);
                              // console.log("plainData ", docRefToDelete.data());
                              // deleteDoc(docRefToDelete);
                            }
                            deleteOne();
                            document.getElementById(
                              `mainDiv${rawRandomID}`
                            ).style.animation = "fadeAway 0.3s ease";
                            document
                              .getElementById(`mainDiv${rawRandomID}`)
                              .addEventListener("animationend", (mid) => {
                                console.log(mid);
                                document.getElementById(
                                  `mainDiv${rawRandomID}`
                                ).style.display = "none";
                              });
                          });
                        document
                          .getElementById(`trashContainer${rawRandomID}`)
                          .classList.add("toggler");
                        // Trash Icon //
                      }
                      async function copyButtonFunction() {
                        let copyContainer = document.createElement("div");
                        copyContainer.setAttribute(
                          "id",
                          `copyContainer${rawRandomID}`
                        );
                        document
                          .getElementById(`threeToggles${rawRandomID}`)
                          .appendChild(copyContainer);
                        document
                          .getElementById(`copyContainer${rawRandomID}`)
                          .classList.add("copyContainer");
                        let copy = document.createElement("i");
                        copy.setAttribute("id", `copy${rawRandomID}`);
                        document
                          .getElementById(`copyContainer${rawRandomID}`)
                          .appendChild(copy);
                        document
                          .getElementById(`copy${rawRandomID}`)
                          .setAttribute("class", "far fa-copy");
                        document
                          .getElementById(`copy${rawRandomID}`)
                          .classList.add("copyClass");
                        if (importedData.isLink == "true") {
                          document.getElementById(
                            `copyContainer${rawRandomID}`
                          ).style.marginTop = "1.2%";
                        } else {
                          document.getElementById(
                            `copyContainer${rawRandomID}`
                          ).style.marginTop = "0.9%";
                        }
                        document
                          .getElementById(`copyContainer${rawRandomID}`)
                          .addEventListener("click", () => {
                            navigator.clipboard.writeText(
                              document.getElementById(
                                `hiddenPasswordInputBox${rawRandomID}`
                              ).value
                            );
                          });
                        document
                          .getElementById(`copyContainer${rawRandomID}`)
                          .classList.add("toggler");
                      }

                      async function websiteRedirectFunction() {
                        // Website Redirect //
                        let decryptedLink = await decryptWithMP(
                          importedData.directLink
                        );
                        let urlStringBool = importedData.isLink;
                        if (urlStringBool == "true") {
                          document
                            .getElementById(`icon${rawRandomID}`)
                            .addEventListener("click", () => {
                              if (importedData.isLink == "true") {
                                if (
                                  decryptedLink.includes("http") &&
                                  decryptedLink.includes("://")
                                ) {
                                  nw.Shell.openExternal(decryptedLink);
                                } else {
                                  nw.Shell.openExternal(
                                    "http://" + decryptedLink
                                  );
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
                        await copyButtonFunction();
                        await trash();
                      }
                      activate();
                    }
                    docSnapp.forEach((doc) => {
                      async function runShow(docToRun) {
                        await startUpShow(docToRun);
                      }
                      runShow(doc);
                    });
                  } else {
                    document.getElementById(
                      "newAndEnterMasterPasswordField"
                    ).style.backgroundColor = "#3d333c";
                    document.getElementById(
                      "newAndEnterMasterPasswordField"
                    ).style.border = "2px solid #844242";
                    console.log(
                      "NOPE, correct hash is, ",
                      await getCorrectHash()
                    );
                  }
                }
                //
                setTimeout(() => {
                  document
                    .getElementById("newAndEnterMasterPasswordField")
                    .focus();
                  // document.getElementById(
                  //   "newAndEnterMasterPasswordField"
                  // ).style.boxShadow = "0 20px 20px rgb(0 0 0 / 80%)";
                  // document.getElementById(
                  //   "newAndEnterMasterPasswordField"
                  // ).style.border = "3px solid rgb(1 255 242)";
                  // document.getElementById(
                  //   "newAndEnterMasterPasswordField"
                  // ).style.boxShadow = "none";
                  // document.getElementById(
                  //   "newAndEnterMasterPasswordField"
                  // ).style.border = "none";
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

                //----------------------Check if master password is correct----------------------//
              } else {
                document.getElementById(
                  "setupMasterPasswordScreen"
                ).style.width = "378px";
                document.getElementById(
                  "setupMasterPasswordScreen"
                ).style.height = "415px";
                document.getElementById("renterMP").style.display = "initial";
                console.log(tempSnap.data(), " doesn't exist :(");
                document.body.style.pointerEvents = "none";
                document.getElementById(
                  "setupMasterPasswordScreen"
                ).style.display = "initial";
                document.getElementById(
                  "setupMasterPasswordScreen"
                ).style.pointerEvents = "auto";
                document.body.style.opacity = ".65";
                //----------------------Adding master password----------------------//
                document
                  .getElementById("confirmMasterPasswordButton")
                  .addEventListener("click", () => {
                    let rawMPInput = document
                      .getElementById("newMasterPasswordField")
                      .value.trim();
                    let rawREMPInput = document
                      .getElementById("renterMP")
                      .value.trim();
                    if (rawMPInput == rawREMPInput) {
                      let encryptedPassword = crypto
                        .createHash("sha512")
                        .update(rawMPInput)
                        .digest("hex");
                      if (
                        document.getElementById("passwordStrengthBar").value ==
                          4 ||
                        document.getElementById("passwordStrengthBar").value ==
                          3
                      ) {
                        writeMPToFS(encryptedPassword);
                        writeBlankDataToFS();
                        document.getElementById(
                          "setupMasterPasswordScreen"
                        ).style.display = "none";
                        document.body.style.pointerEvents = "auto";
                        document.body.style.opacity = "1";
                      } else {
                        document.getElementById(
                          "newMasterPasswordField"
                        ).style.backgroundColor = "#3d333c";
                        document.getElementById(
                          "newMasterPasswordField"
                        ).style.border = "2px solid #844242";
                        document.getElementById(
                          "renterMP"
                        ).style.backgroundColor = "#3d333c";
                        document.getElementById("renterMP").style.border =
                          "2px solid #844242";
                        // document.getElementById("timeToCrack").style.color =
                        //   "#ff0000";
                        // document.getElementById("timeToCrack").textContent =
                        //   "Password is too weak";
                        document.getElementById(
                          "confirmMasterPasswordButton"
                        ).style.marginTop = "4%";
                      }
                    } else {
                      console.log("diff");
                      document.getElementById(
                        "newMasterPasswordField"
                      ).style.backgroundColor = "#3d333c";
                      document.getElementById(
                        "newMasterPasswordField"
                      ).style.border = "2px solid #844242";
                      document.getElementById(
                        "renterMP"
                      ).style.backgroundColor = "#3d333c";
                      document.getElementById("renterMP").style.border =
                        "2px solid #844242";
                      // document.getElementById("timeToCrack").style.color =
                      //   "#ff0000";
                      // document.getElementById("timeToCrack").textContent =
                      //   "Passwords do not match";
                      document.getElementById(
                        "confirmMasterPasswordButton"
                      ).style.marginTop = "4%";
                    }
                  });
                //----------------------Adding master password----------------------//
              }
            })
            .catch((err) => {
              console.log(err);
            });
        };
        checkIfUIDExistsInFS();
        // auth.currentUser.getIdTokenResult(true)
        auth.currentUser.getIdTokenResult(true).then((idTokenResult) => {
          console.log("the result ", idTokenResult);
          console.log("the result claims ", idTokenResult.claims);
        });
        //----------------------Checking if master password exists----------------------//

        // Animation end listeners //
        Array.from(
          document.getElementById("ableToDarken").getElementsByTagName("div")
        )[0].addEventListener("animationend", (anii) => {
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
            document.getElementById("ableToDarken").style.userSelect = "none";
          }
        });
        // Array.from(
        //   document.getElementsByClassName("updateQueryScreen")
        // ).forEach((ele) => {
        //   ele.addEventListener("animationend", (anii) => {
        //     console.log("is NOT ididididid ", anii.target.style.id);
        //     if (anii.animationName == "pushOutUpdateTab") {
        //       console.log("is idididid ", anii.target.style.id);
        //       document.getElementById(
        //         `updateQueryScreen${anii.target.style.id}`
        //       ).style.width = "40%";
        //     }
        //   });
        // });

        // Array.from(
        //   document.getElementsByClassName("updateQueryScreen")
        // ).forEach((ele) => {
        //   ele.addEventListener("animationend", (op) => {
        //     console.log("anii was ", op);
        //     if (op.animationName == "updateTabToDark") {
        //       updateQueryScreen.style.backgroundColor = "#0b0b0b";
        //     }
        //   });
        // });
        // Array.from(
        //   document.getElementsByClassName("updateQueryScreen")
        // ).forEach((ele) => {
        //   ele.addEventListener("animationend", (op) => {
        //     console.log("anii was ", op);
        //     if (op.animationName == "updateTabToNormal") {
        //       document.getElementById(
        //         "updateQueryScreen"
        //       ).style.backgroundColor = "#0c1213";
        //     }
        //   });
        // });

        // Array.from(
        //   document.getElementsByClassName("strongUpdateDisplayText")
        // ).forEach((displayTextInputEle) => {
        //   displayTextInputEle.addEventListener("animationend", (op) => {
        //     if (op.animationName == "updateInputBoxesNormal") {
        //       displayTextInputEle.style.boxShadow =
        //         "0px 10px 30px 5px rgba(0, 0, 0.15)";
        //     }
        //   });
        // });
        // Array.from(
        //   document.getElementsByClassName("strongUpdateDisplayText")
        // ).forEach((displayTextInputEle) => {
        //   displayTextInputEle.addEventListener("animationend", (op) => {
        //     if (op.animationName == "updateInputBoxesGlow") {
        //       displayTextInputEle.style.boxShadow =
        //         "0px 0px 12px 1px rgb(255, 255, 255)";
        //     }
        //   });
        // });
        // document
        //   .getElementById("updateQueryScreen")
        //   .addEventListener("animationend", (anii) => {
        //     if (anii.animationName == "pushOutUpdateTab") {
        //       document.getElementById("updateQueryScreen").style.width = "40%";
        //     }
        //   });
        // Animation end listeners //
      };
      init();
      // console.log(auth);
      //
      // auth.currentUser.getIdTokenResult().then((idTokenResult) => {
      //   console.log("the result ", idTokenResult);
      //   console.log("the result claims ", idTokenResult.claims);
      // });
    }, 1500);
  }
  mainInit();
} catch (err) {
  console.log(err);
}