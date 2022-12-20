import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  doc,
  getFirestore,
  getDoc,
  writeBatch,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { getFunctions, httpsCallable } from "firebase/functions";

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from "firebase/app-check";

const CryptoJS = require("crypto-js");

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
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6LciglofAAAAAD8hjB0f5kYV809r-t30PI8rYAQz"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });

const auth = getAuth(app);
const functions = getFunctions();
const db = getFirestore();

// Firebase functions

const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (err) {
    return `error: ${err.code}`;
  }
};

const signInToPersonalPMAccount = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    return `error: ${err.code}`;
  }
};

const createPersonalPMAccount = async (email, password) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredentials) => {
        const user = userCredentials.user;
        return await sendEmailVerification(user);
      }
    );
  } catch (err) {
    return `error: ${err.code}`;
  }
};

const forgotPassword = async (email) => {
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (err) {
    return `error: ${err.code}`;
  }
};

// Cloud functions

const setAutolock = async (time) => {
  const setAlCF = httpsCallable(functions, "setAutolock");
  const setAlCFReturn = await setAlCF({
    // userUID: auth.currentUser.uid,
    time: time,
  });
  return setAlCFReturn;
};

const checkIfMFATokenIsCorrect = async (
  hashedSetMasterPassValue,
  enteredMFAToken
) => {
  const checkMFACF = httpsCallable(functions, "checkIfMFATokenIsCorrect");
  const checkMFACFReturn = await checkMFACF({
    // userUID: auth.currentUser.uid,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    enteredMFAToken: enteredMFAToken,
  });
  const mfaIsCorrect = checkMFACFReturn.data.enteredMFAIsCorrect;
  return mfaIsCorrect;
};

const checkIfCodeToEnableMFAIsCorrect = async (
  enteredMFAToken,
  decryptedMFASecretHex
) => {
  const checkIfCodeToEnableMFAIsCorrect = httpsCallable(
    functions,
    "checkIfCodeToEnableMFAIsCorrect"
  );
  const checkIfCodeToEnableMFAIsCorrectCF =
    await checkIfCodeToEnableMFAIsCorrect({
      enteredMFAToken: enteredMFAToken,
      decryptedMFASecretHex: decryptedMFASecretHex,
    });
  return checkIfCodeToEnableMFAIsCorrectCF;
};

const disableMFA = async () => {
  const disableMFACF = httpsCallable(functions, "disableMFA");
  const disableMFAReturn = await disableMFACF();
  return disableMFAReturn;
};

const enableMFA = async (mfaSecretHex, hashedSetMasterPassValue) => {
  const enableMFA = httpsCallable(functions, "enableMFA");
  const enableMFACF = await enableMFA({
    mfaSecretHex: mfaSecretHex,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    // userUID: auth.currentUser.uid,
  });
  return enableMFACF;
};

const generateMFA = async () => {
  const generateMFA = httpsCallable(functions, "generateMFA");
  const generateMFACF = await generateMFA();
  return generateMFACF;
};

const updateMP = async (currentMasterPassword, newMasterPassword) => {
  const newRandomString = generateRandomString(250);

  const hashedCurrentMasterPassword = await hashString(currentMasterPassword);
  const hashedNewMasterPassword = await hashString(newMasterPassword);
  const newRandomStringEncrypted = CryptoJS.AES.encrypt(
    // Encrypting the random string with the master pass hash as the key
    newRandomString,
    hashedNewMasterPassword
  ).toString();
  const updateMasterPassword = httpsCallable(functions, "updateMasterPassword");
  const updateResult = await updateMasterPassword({
    // userUID: auth.currentUser.uid,
    currentMPH: hashedCurrentMasterPassword,
    newMPH: hashedNewMasterPassword,
    newRandomStringEncrypted: newRandomStringEncrypted,
  });
  return updateResult;
};

const decryptUserQueries = async (hashedSetMasterPassValue) => {
  const decryptUserQueriesCF = httpsCallable(functions, "decryptUserQueries");
  const finalDecryptedQueryReturn = await decryptUserQueriesCF({
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    // userUID: auth.currentUser.uid,
  });
  const listOfDecryptedObjectsAndIDs = finalDecryptedQueryReturn.data.finalList;
  return listOfDecryptedObjectsAndIDs;
};

const addUserQuery = async (
  objectToAdd,
  hashedSetMasterPassValue,
  linkIsThere
) => {
  const addUserQuery = httpsCallable(functions, "addUserQuery");
  const id = generateRandomString(250);
  const finalEncryptedAddedQueryReturn = await addUserQuery({
    objectToAdd: objectToAdd,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    // userUID: auth.currentUser.uid,
    isLink: linkIsThere,
    randomID: id,
  });
  return finalEncryptedAddedQueryReturn;
};

const updateUserQuery = async (
  objectToUpdate,
  hashedSetMasterPassValue,
  sourceRefID
) => {
  const updateUserQuery = httpsCallable(functions, "updateRawData");

  return await updateUserQuery({
    objectToUpdate: objectToUpdate,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    sourceRefID: sourceRefID,
    // userUID: auth.currentUser.uid,
    isLink: objectToUpdate.isLink,
    randomID: objectToUpdate.random,
  });
};

const givePRole = async () => {
  const givePRole = httpsCallable(functions, "givePRole");
  return await givePRole();
};

const giveFTRole = async () => {
  const giveFTRole = httpsCallable(functions, "giveFTRole");
  return await giveFTRole();
};

const deleteUser = async () => {
  const roleDoc = await getDoc(
    doc(db, "users", "filler", auth.currentUser.uid, "r")
  );
  const role = roleDoc.data().memb;
  if (role == "p") {
    return { status: "pError" }; // This will not delete the account and let the user know that they have to unsubscribe from premium to delete it
  } else if (role == "a" || role == "ft") {
    const deleteUser = httpsCallable(functions, "deleteUser");
    const returnVal = await deleteUser();
    if (returnVal.data.status == "support") {
      return { status: "support" };
    } else if (returnVal.data.status == "done") {
      return { status: "done" };
    } else if (returnVal.data.status == "pError") {
      return { status: "pError" };
    }
  } else {
    return { status: "support" };
    // Tells the user to email support
  }
};
// End of cloud functions

const signOutUser = async () => {
  return await signOut(auth);
};

const checkForMFA = async () => {
  try {
    const mfaDoc = await getDoc(
      doc(db, "users", "filler", auth.currentUser.uid, "mfa")
    );

    const mfaSecretHex = mfaDoc.data().hex;

    if (mfaSecretHex.trim() == "") {
      return false;
    } else if (mfaSecretHex.trim() != "") {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};

const checkIfMasterPasswordExists = async () => {
  let refForMainUID = doc(db, "users", "filler", auth.currentUser.uid, "mpaps");
  const tempSnap = await getDoc(refForMainUID);
  const tempSnapExists = tempSnap.exists();
  if (tempSnapExists) {
    return true;
  } else if (!tempSnapExists) {
    return false;
  }
};

const generateRandomString = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result; // Returns a VERY long random id
};

const hashString = async (str) => {
  // Couldn't resolve a polyfill error with the CryptoJS module so I used this instead
  // Hashes string with sha-512
  // From stackoverflow: https://stackoverflow.com/questions/55926281/how-do-i-hash-a-string-using-javascript-with-sha512-algorithm
  const buf = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder("utf-8").encode(str)
  );
  return Array.prototype.map
    .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
};

const uploadMasterPassword = async (requestedMasterPassword) => {
  const refForMSCheck = collection(
    /* This collection stores a string that is encrypted with the
  master pass. When the user logs in, it checks to see if the hash of the master password
  the user entered can be used to decrypt the string that is stored here. If it can,
  that means the master pass they entered is correct. If the decryption returns
  a blank string or an error, that means it is the wrong master password */
    db,
    "users",
    "filler",
    auth.currentUser.uid,
    "mpaps",
    "ms"
  );
  const refForMainUID = doc(
    db,
    "users",
    "filler",
    auth.currentUser.uid,
    "mpaps"
  );

  const masterPassHash = await hashString(requestedMasterPassword);

  const randomStringToBeEncrypted = generateRandomString(250); // See line 220 for details
  const randomEncryptedString = CryptoJS.AES.encrypt(
    // Encrypting the random string with the master pass hash as the key
    randomStringToBeEncrypted,
    masterPassHash
  ).toString();

  const batch = writeBatch(db);
  batch.set(doc(refForMSCheck), {
    mph: randomEncryptedString, // See line 220 for details
  });

  batch.set(refForMainUID, {
    // We are using the .exists() method to check if the user already has a master pass setup or not. Adding this will make the .exists() method return true
    fillData: "--",
  });
  await batch.commit();
  return { masterPasswordHash: masterPassHash };
};

const checkifMasterPasswordIsCorrect = async (requestedMasterPassword) => {
  const checkIfMasterPasswordIsCorrect = httpsCallable(
    functions,
    "checkIfMasterPasswordIsCorrect"
  );

  const response = await checkIfMasterPasswordIsCorrect({
    requestedMasterPasswordHash: await hashString(requestedMasterPassword),
    // userUID: auth.currentUser.uid,
  });

  if (response.data.masterPasswordIsCorrect) {
    return true;
  } else {
    return false;
  }
};

const deleteUserQuery = async (id) => {
  const ref = doc(
    db,
    "users",
    "filler",
    auth.currentUser.uid,
    "mpaps",
    "ps",
    id
  );
  await deleteDoc(ref);
};

export {
  signInToPersonalPMAccount,
  createPersonalPMAccount,
  googleSignIn,
  signOutUser,
  checkForMFA,
  checkIfMasterPasswordExists,
  uploadMasterPassword,
  generateRandomString,
  hashString,
  checkifMasterPasswordIsCorrect,
  deleteUserQuery,
  forgotPassword,
};

export {
  // Cloud functions
  checkIfMFATokenIsCorrect,
  checkIfCodeToEnableMFAIsCorrect,
  disableMFA,
  enableMFA,
  generateMFA,
  updateMP,
  decryptUserQueries,
  addUserQuery,
  updateUserQuery,
  givePRole,
  giveFTRole,
  setAutolock,
  deleteUser,
};
export const firebaseAuth = auth;
export const FSDB = db;
export default app;
