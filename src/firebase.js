import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { doc, getFirestore, getDoc } from "firebase/firestore";

import { getFunctions, httpsCallable } from "firebase/functions";

// import {
//   initializeAppCheck,
//   ReCaptchaV3Provider,
//   getToken,
// } from "firebase/app-check";

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
const auth = getAuth();
const functions = getFunctions();
const db = getFirestore();

// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6LciglofAAAAAD8hjB0f5kYV809r-t30PI8rYAQz"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true,
// });
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
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    return `error: ${err.code}`;
  }
};

// Cloud functions
const checkIfMFATokenIsCorrect = async (
  hashedSetMasterPassValue,
  enteredMFAToken
) => {
  const checkMFACF = httpsCallable(functions, "checkIfMFATokenIsCorrect");
  const checkMFACFReturn = await checkMFACF({
    userUID: auth.currentUser.uid,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    enteredMFAToken: enteredMFAToken,
  });
  const mfaIsCorrect = checkMFACFReturn.data.enteredMFAIsCorrect;
  return mfaIsCorrect;
};

const disableMFA = async () => {
  const disableMFACF = httpsCallable(functions, "disableMFA");
  const disableMFAReturn = await disableMFACF({
    userUID: auth.currentUser.uid,
  });
  return disableMFAReturn;
};

const enableMFA = async (mfaSecretHex, hashedSetMasterPassValue) => {
  const enableMFA = httpsCallable(functions, "enableMFA");
  const enableMFACF = await enableMFA({
    mfaSecretHex: mfaSecretHex,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    userUID: auth.currentUser.uid,
  });
  return enableMFACF;
};

const updateMasterPassword = async (
  hashedCurrentMasterPassword,
  hashedNewMasterPassword,
  newRandomStringEncrypted
) => {
  const updateMasterPassword = httpsCallable(functions, "updateMasterPassword");
  const updateResult = await updateMasterPassword({
    userUID: auth.currentUser.uid,
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
    userUID: auth.currentUser.uid,
  });
  console.log(finalDecryptedQueryReturn);
  const listOfDecryptedObjectsAndIDs = finalDecryptedQueryReturn.data.finalList;
  return listOfDecryptedObjectsAndIDs;
};

const addUserQuery = async (
  objectToAdd,
  hashedSetMasterPassValue,
  linkIsThere,
  id
) => {
  const addUserQuery = httpsCallable(functions, "addUserQuery");

  const finalEncryptedAddedQueryReturn = await addUserQuery({
    objectToAdd: objectToAdd,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    userUID: auth.currentUser.uid,
    isLink: linkIsThere,
    randomID: id,
  });
  return finalEncryptedAddedQueryReturn;
};

const updateUserQuery = async (
  objectToUpdate,
  hashedSetMasterPassValue,
  sourceRefID,
  importedData
) => {
  const updateUserQuery = httpsCallable(functions, "updateRawData");

  return await updateUserQuery({
    objectToUpdate: objectToUpdate,
    hashedSetMasterPassValue: hashedSetMasterPassValue,
    sourceRefID: sourceRefID,
    userUID: auth.currentUser.uid,
    isLink: objectToUpdate.isLink,
    randomID: importedData.random,
  });
};

const givePRole = async () => {
  const givePRole = httpsCallable(functions, "givePRole");
  return await givePRole({ uid: auth.currentUser.uid });
};
// End of cloud functions

const signOutUser = async () => {
  return await signOut(auth);
};

const checkForMFA = async () => {
  const mfaDoc = await getDoc(
    doc(db, "users", "filler", auth.currentUser.uid, "mfa")
  );

  const mfaSecretHex = mfaDoc.data().hex;
  console.log("SEHE: ", mfaSecretHex);

  if (mfaSecretHex.trim() == "") {
    return false;
  } else if (mfaSecretHex.trim() != "") {
    return true;
  }
};

export {
  signInToPersonalPMAccount,
  createPersonalPMAccount,
  googleSignIn,
  signOutUser,
  checkForMFA,
};

export {
  // Cloud functions
  checkIfMFATokenIsCorrect,
  disableMFA,
  enableMFA,
  updateMasterPassword,
  decryptUserQueries,
  addUserQuery,
  updateUserQuery,
  givePRole,
};
export const firebaseAuth = auth;
export const FSDB = db;
export default app;
