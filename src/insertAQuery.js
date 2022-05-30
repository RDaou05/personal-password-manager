import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
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
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getFunctions,
  httpsCallable,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-functions.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-auth.js";

import { hashedSetMasterPassValue } from "./promptForMasterPasswordAndDisplay.js";
// Importing the hash of the master password

// const crypto = require("crypto");
// const CryptoJS = require("crypto-js");

// import * as CryptoJS from "crypto-js";
const CryptoJS = require("crypto-js");

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
  const app = initializeApp(firebaseConfig);
} catch (err) {
  console.log(err);
}

let mostRecentEnteredUsernameOfQuery;
let mostRecentEnteredPasswordOfQuery;
let mostRecentEnteredNameOfQuery;
let mostRecentLinkIsThere;
let mostRecentEnteredURLOfQuery;
let mostRecentID;

async function mainInit() {
  const db = getFirestore();

  const auth = await getAuth();
  const functions = await getFunctions();
  let initiated = false;
  onAuthStateChanged(auth, (mainUser) => {
    if (!initiated) {
      if (mainUser) {
        // Checks if user is signed in
        initiated = true; // Setting this to true makes it so this wont run again when the reauth happens
        let openUrlObject =
          {}; /* This is where we store the links that open when 
          the user clicks on the icon for a query. The reason this is being stored in an object is
          because if the user decides to update the link, we can just update the object. The
          object will contain the randomID of the query as the key, and the url as the value*/
        const init = async () => {
          let userUID = mainUser.uid;
          let originalMarginTop = 0.3;
          let refForMS = collection(
            db,
            "users",
            "filler",
            userUID,
            "mpaps",
            "ms"
          );
          let refForPS = collection(
            db,
            "users",
            "filler",
            userUID,
            "mpaps",
            "ps"
          );
          let refForSortPS = query(
            collection(db, "users", "filler", userUID, "mpaps", "ps"),
            orderBy("nummy", "desc")
          );

          async function makeid(length) {
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

          // const analytics = getAnalytics(app);
          document.getElementById("addButton").addEventListener("click", () => {
            // Dimming background and not allowing clicks outside the popup until it is closed
            document.body.style.pointerEvents = "none";
            document.body.style.opacity = ".5";
            document.getElementById("addPasswordScreen").style.display =
              "initial";
            document.getElementById("addPasswordScreen").style.pointerEvents =
              "auto";
            document.getElementById("addPasswordScreen").style.opacity = "1";
            document.body.style.userSelect = "none";
            document.getElementById("addPasswordScreen").style.userSelect =
              "auto";
            document.getElementById("addPasswordScreen").style.opacity = "1";
          });

          //   // Close Adder //
          document.getElementById("closeAdd").addEventListener("click", () => {
            // Setting opacity to normal values and allowing clicks again
            document.body.style.pointerEvents = "auto";
            document.body.style.opacity = "1";
            document.body.style.userSelect = "auto";
            document.getElementById("addPasswordScreen").style.display = "none";
            document.getElementById("addPasswordScreen").style.pointerEvents =
              "none";
            document.getElementById("addPasswordScreen").style.opacity = "0";
            document.getElementById("nameOfQuery").value = "";
            document.getElementById("usernameOfQuery").value = "";
            document.getElementById("passwordOfQuery").value = "";
            document.getElementById("URLOfQuery").value = "";
          });
          //   // Close Adder //

          // Password Shower //
          const togglePassword = document.querySelector("#eyeForAdd");
          const password = document.querySelector("#passwordOfQuery");

          togglePassword.addEventListener("click", function (e) {
            // toggle the type attribute
            const type =
              password.getAttribute("type") === "password"
                ? "text"
                : "password";
            password.setAttribute("type", type);
            // toggle the eye slash icon
            document
              .querySelector("#eyeForAdd")
              .classList.toggle("fa-eye-slash");
          });
          //

          document
            .getElementById("confirmQuery")
            .addEventListener("click", () => {
              let newQueryID; // Reference id of the path of the document the user will add
              async function confirmQueryButtonEventFuntion() {
                let enteredNameOfQuery = document
                  .getElementById("nameOfQuery")
                  .value.trim();
                let enteredUsernameOfQuery = document
                  .getElementById("usernameOfQuery")
                  .value.trim();
                let enteredPasswordOfQuery = document
                  .getElementById("passwordOfQuery")
                  .value.trim();
                let enteredURLOfQuery = document
                  .getElementById("URLOfQuery")
                  .value.trim();
                let linkIsThere;
                if (enteredURLOfQuery.length >= 4) {
                  linkIsThere = "true";
                } else {
                  linkIsThere = "false";
                }
                if (
                  enteredNameOfQuery != "" &&
                  enteredUsernameOfQuery != "" &&
                  enteredPasswordOfQuery != ""
                ) {
                  async function uploadQ() {
                    const objectToAdd = {
                      pass: enteredPasswordOfQuery,
                      email: enteredUsernameOfQuery,
                      website: enteredNameOfQuery,
                      directLink: enteredURLOfQuery,
                    };
                    let id = await makeid(250);
                    const addUserQuery = httpsCallable(
                      functions,
                      "addUserQuery"
                    );

                    const finalEncryptedAddedQueryReturn = await addUserQuery({
                      objectToAdd: objectToAdd,
                      hashedSetMasterPassValue: hashedSetMasterPassValue,
                      userUID: userUID,
                      isLink: linkIsThere,
                      randomID: id,
                    });
                    console.log(finalEncryptedAddedQueryReturn);

                    newQueryID = finalEncryptedAddedQueryReturn.data.IDOfNewDoc; // Setting the ID of the new doc that was created
                    mostRecentID = id; // The random ID
                  }
                  async function startUpShow(
                    suppliedEnteredUsernameOfQuery,
                    suppliedEnteredPasswordOfQuery,
                    suppliedEnteredNameOfQuery,
                    suppliedLinkIsThere,
                    suppliedEnteredURLOfQuery,
                    suppliedID
                  ) {
                    // Credentials to add to the screen
                    const importedData = {
                      directLink: suppliedEnteredURLOfQuery,
                      random: suppliedID,
                      isLink: suppliedLinkIsThere,
                      website: suppliedEnteredNameOfQuery,
                      pass: suppliedEnteredPasswordOfQuery,
                      email: suppliedEnteredUsernameOfQuery,
                    };
                    let rawRandomID;
                    function getDecryptedID() {
                      rawRandomID = importedData.random;
                    }
                    getDecryptedID(); // Setting the identifier for the added query

                    let mainDiv = document.createElement("div");
                    mainDiv.setAttribute("id", `mainDiv${rawRandomID}`);
                    mainDiv.style.marginTop = `${originalMarginTop}%`;
                    document
                      .getElementById("queryScreen")
                      .insertBefore(
                        mainDiv,
                        document.getElementsByClassName("mainDivClass")[0]
                      );
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
                    subInfoSpan.setAttribute("id", `subInfoSpan${rawRandomID}`);
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
                        console.log("First letter is ", firstLetterOfAppName);
                        let letterBox = document.createElement("div");
                        letterBox.style.backgroundColor =
                          listOfColors[
                            Math.floor(Math.random() * listOfColors.length)
                          ];
                        letterBox.setAttribute("id", `letterBox${rawRandomID}`);
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
                      let decryptedShownAppName = importedData.website;
                      shownAppName.value =
                        decryptedShownAppName.charAt(0).toUpperCase() +
                        decryptedShownAppName.slice(1);

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
                      shownEmail.setAttribute("id", `shownEmail${rawRandomID}`);
                      shownEmail.readOnly = true;
                      document
                        .getElementById(`subInfoSpan${rawRandomID}`)
                        .appendChild(shownEmail);
                      document
                        .getElementById(`shownEmail${rawRandomID}`)
                        .classList.add("shownEmail");
                    }
                    async function editButtonFunction() {
                      document
                        .getElementById(`mainDiv${rawRandomID}`)
                        .addEventListener("click", async (clickedEvt) => {
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
                              // This function checks if an update tab already exists for the query being clicked on
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
                                } else {
                                  return false;
                                }
                              }
                              await createAndAddUpdatesCheckList();
                              return await confirmUpdateList();
                            }
                            //
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
                                updateHolder.innerHTML = htmlOfNewUpdateScreen;
                                mcParent.appendChild(updateHolder);

                                /* We are putting in the class "uce" so 
                                the update tab wil not disapper when the popup gets clicked*/
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
                                updateHolder.appendChild(confirmDeletePopup);

                                document.getElementById(
                                  `delmessage${rawRandomID}`
                                ).textContent = `Are you sure you want to delete ${importedData.website}?`;

                                // Listener to delete query that was added
                                document
                                  .getElementById(`yesdel${rawRandomID}`) // Confirm delete button
                                  .addEventListener("click", async () => {
                                    console.log(
                                      "Delete button has been clicked"
                                    );
                                    await deleteDoc(
                                      doc(
                                        db,
                                        "users",
                                        "filler",
                                        userUID,
                                        "mpaps",
                                        "ps",
                                        newQueryID
                                      )
                                    ); // Deleting query

                                    // Animation to delete query from main page
                                    document.getElementById(
                                      `mainDiv${rawRandomID}`
                                    ).style.animation = "fadeAway 0.3s ease";
                                    document
                                      .getElementById(`mainDiv${rawRandomID}`)
                                      .addEventListener("animationend", () => {
                                        document.getElementById(
                                          `mainDiv${rawRandomID}`
                                        ).style.display = "none";
                                      });
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
                                  .getElementById(`canceldel${rawRandomID}`)
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
                                let deleteButton = document.getElementById(
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
                                  .addEventListener("animationend", (aniii) => {
                                    console.log(
                                      "the ani0 is ",
                                      aniii.animationName
                                    );
                                    if (
                                      aniii.animationName == "pushOutUpdateTab"
                                    ) {
                                      document.getElementById(
                                        `updateQueryScreen${rawRandomID}`
                                      ).style.width = "40%";
                                    }
                                    if (
                                      aniii.animationName == "pullInUpdateTab"
                                    ) {
                                      document.getElementById(
                                        `updateQueryScreen${rawRandomID}`
                                      ).style.width = "0%";
                                    }
                                    if (
                                      aniii.animationName == "updateTabToDark"
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
                                      aniii.animationName == "updateTabToNormal"
                                    ) {
                                      document.getElementById(
                                        `updateQueryScreen${rawRandomID}`
                                      ).style.backgroundColor = "#0c1213";
                                    }
                                  });
                                setTimeout(() => {
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
                                              ).style.display == "initial" &&
                                              document.getElementById(
                                                `saveButtonUpdate${rawRandomID}`
                                              ).style.display == "initial" &&
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
                                            newUpdateTab.style.animation = "";
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
                                }, 200);
                                async function listenForEditRequest() {
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
                                                let ogValue = Object.values(
                                                  originalUpdateInputFields
                                                )[queryFieldIndexIndentifer];
                                                if (
                                                  // Checking if value of query field input box has changed
                                                  ogValue.trim() !=
                                                  updateQueryField.value
                                                ) {
                                                  console.log("NOT EQUAL!!", {
                                                    og: ogValue,
                                                    current:
                                                      updateQueryField.value,
                                                  });
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
                                      let saveButton = document.getElementById(
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
                                              console.log("A normal object: ", {
                                                hey: "oh hey",
                                                bye: "oh ok bye",
                                              });
                                              let objectToUpdate = {}; // Contains all the values to be updated
                                              async function loadingQueryUpdate() {
                                                objectToUpdate = {};

                                                objectToUpdate.website =
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextName${rawRandomID}`
                                                  ).value;

                                                objectToUpdate.email =
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextEmail${rawRandomID}`
                                                  ).value;
                                                console.log(
                                                  "update doc line 1276"
                                                );

                                                objectToUpdate.pass =
                                                  document.getElementById(
                                                    `strongUpdateDisplayTextPassword${rawRandomID}`
                                                  ).value;
                                                console.log(
                                                  "update Doc line 1302"
                                                );

                                                async function toUpdatingLink() {
                                                  if (
                                                    document
                                                      .getElementById(
                                                        `strongUpdateDisplayTextURL${rawRandomID}`
                                                      )
                                                      .value.trim() != 0
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
                                                      .value.trim() == 0
                                                  ) {
                                                    objectToUpdate.isLink =
                                                      "false";
                                                    console.log(
                                                      "update doc line 1348"
                                                    );
                                                  }

                                                  objectToUpdate.directLink =
                                                    document.getElementById(
                                                      `strongUpdateDisplayTextURL${rawRandomID}`
                                                    ).value;
                                                  console.log(
                                                    "update doc line 1366"
                                                  );
                                                }
                                                await toUpdatingLink();
                                              }
                                              loadingQueryUpdate().then(() => {
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
                                                  "hereb: ",
                                                  newQueryID
                                                );
                                                console.log(
                                                  "AND: ",
                                                  doc(
                                                    db,
                                                    "users",
                                                    "filler",
                                                    userUID,
                                                    "mpaps",
                                                    "ps",
                                                    newQueryID
                                                  )
                                                );

                                                const updateUserQuery =
                                                  httpsCallable(
                                                    functions,
                                                    "updateRawData"
                                                  );

                                                updateUserQuery({
                                                  objectToUpdate:
                                                    objectToUpdate,
                                                  hashedSetMasterPassValue:
                                                    hashedSetMasterPassValue,
                                                  sourceRefID: newQueryID,
                                                  userUID: userUID,
                                                  isLink: objectToUpdate.isLink,
                                                  randomID: importedData.random,
                                                }).then(() => {
                                                  console.log(
                                                    "THIS IS THE THE THE THE THE LOGGG: ",
                                                    objectToUpdate
                                                  );
                                                  if (!nameIsTheSame) {
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
                                                  if (!emailIsTheSame) {
                                                    // Changing the email of the query that shows up on the main dashboard to the updated one
                                                    document.getElementById(
                                                      `shownEmail${rawRandomID}`
                                                    ).value = document.getElementById(
                                                      `strongUpdateDisplayTextEmail${rawRandomID}`
                                                    ).value;
                                                  }
                                                  if (!linkIsTheSame) {
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
                                                      ) == "http://" ||
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
                                                    openUrlObject[rawRandomID] =
                                                      newWebsiteLink.trim();
                                                    console.log(
                                                      "Updated object: ",
                                                      openUrlObject
                                                    );
                                                    console.log(
                                                      "Updated object for spec raw: ",
                                                      openUrlObject[rawRandomID]
                                                    );
                                                    console.log(
                                                      "ben: ",
                                                      openUrlObject[rawRandomID]
                                                    );

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
                                                  }
                                                });
                                              });
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

                                      Array.from(updateInputFields).forEach(
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
                                document.getElementById("scrollToTop").click();
                                document.getElementById(
                                  `updateQueryScreen${rawRandomID}`
                                ).style.animation =
                                  "pushOutUpdateTab 0.3s ease";
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
                                    websiteLinkForUpdateIcon.substring(0, 5) ==
                                      "http:" ||
                                    websiteLinkForUpdateIcon.substring(0, 6) ==
                                      "https:" ||
                                    websiteLinkForUpdateIcon.substring(0, 7) ==
                                      "http://" ||
                                    websiteLinkForUpdateIcon.substring(0, 8) ==
                                      "https://"
                                  ) {
                                    updateScreenIcon.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${websiteLinkForUpdateIcon.trim()}&size=96`; // Can change back to 96
                                  } else {
                                    updateScreenIcon.src = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${websiteLinkForUpdateIcon.trim()}&size=96`;
                                  }
                                };
                                await showUpdateScreenIcon();

                                //
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
                                    ).value = displayNameForUpdateIcon.trim();
                                    document.getElementById(
                                      `strongUpdateDisplayTextEmail${rawRandomID}`
                                    ).value = displayEmailForUpdateIcon.trim();
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
                            }
                            showNewUpdateScreen();
                          }
                        }); // End of event listener
                      document
                        .getElementById(`editContainer${rawRandomID}`)
                        .classList.add("toggler");
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
                                  // nw.Window.open(linkFromObject);
                                } else {
                                  nw.Shell.openExternal(
                                    "http://" + linkFromObject
                                  );
                                  // nw.Window.open(linkFromObject);
                                }
                              }
                            }
                          });
                      }
                    }

                    async function activate() {
                      await createThreeContainerHolder();
                      await showUserAndPass();
                      await websiteRedirectFunction();
                      await editButtonFunction();
                      await eyeToggleAddFunction();
                      await copyButtonFunction();
                      await trash();
                    }
                    activate();
                  }

                  await uploadQ();
                  mostRecentEnteredUsernameOfQuery = enteredUsernameOfQuery;
                  //
                  mostRecentEnteredPasswordOfQuery = enteredPasswordOfQuery;
                  //
                  mostRecentEnteredNameOfQuery = enteredNameOfQuery;
                  //
                  mostRecentEnteredURLOfQuery = enteredURLOfQuery;

                  // Boolean value (as a string) if a link is present
                  mostRecentLinkIsThere = linkIsThere;
                  //
                  await startUpShow(
                    // Starting process to display added values on the dashboard
                    mostRecentEnteredUsernameOfQuery,
                    mostRecentEnteredPasswordOfQuery,
                    mostRecentEnteredNameOfQuery,
                    mostRecentLinkIsThere,
                    mostRecentEnteredURLOfQuery,
                    mostRecentID
                  );
                } else {
                  console.log("UhOh");
                  if (enteredNameOfQuery != "") {
                    let nameB = document.getElementById("nameOfQuery");
                    nameB.style.backgroundColor = "#3d333c";
                    nameB.style.border = "2px solid #844242";
                    nameB.style.boxShadow = "none";
                  }
                  if (enteredUsernameOfQuery != "") {
                    let userB = document.getElementById("usernameOfQuery");
                    userB.style.backgroundColor = "#3d333c";
                    userB.style.border = "2px solid #844242";
                    userB.style.boxShadow = "none";
                  }
                  if (enteredPasswordOfQuery != "") {
                    let passB = document.getElementById("passwordOfQuery");
                    passB.style.backgroundColor = "#3d333c";
                    passB.style.border = "2px solid #844242";
                    passB.style.boxShadow = "none";
                  }
                }
              }
              confirmQueryButtonEventFuntion();
              document.getElementById("closeAdd").click();
            });
        };
        init();
      } else {
        console.log("User is just signing out");
      }
    } else {
      console.log("Already initiated");
    }
  });
}

mainInit();
