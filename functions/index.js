const functions = require("firebase-functions");
const admin = require("firebase-admin");
const CryptoJS = require("crypto-js");
const speakeasy = require("speakeasy");
admin.initializeApp();

exports.setAutolock = functions.https.onCall(async (data, context) => {
  const usersUID = context.auth.uid;
  const db = admin.firestore();
  const p1 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("al")
    .update({ autotime: data.time });
  return Promise.all([p1]);
});

exports.checkIfMFATokenIsCorrect = functions.https.onCall(
  async (data, context) => {
    const db = admin.firestore();
    // Getting secret key for user to add to the end of the decryption key
    let userSecret;
    const userSecretPath = db
      .collection("users")
      .doc("filler")
      .collection(context.auth.uid)
      .doc("secKey");
    let doc = await userSecretPath.get();
    userSecret = doc.data().secKeyStr;
    const decryptionKey = data.hashedSetMasterPassValue + userSecret;

    const usersUID = context.auth.uid;
    const enteredMFAToken = data.enteredMFAToken;

    const refForMFADoc = db
      .collection("users")
      .doc("filler")
      .collection(usersUID)
      .doc("mfa");
    const mfaDocData = await refForMFADoc.get();
    const mfaSecretHex = mfaDocData.data().hex;
    const decryptedMFASecretHex = CryptoJS.AES.decrypt(
      mfaSecretHex,
      decryptionKey
    ).toString(CryptoJS.enc.Utf8);

    const mfaIsCorrect = speakeasy.totp.verify({
      secret: decryptedMFASecretHex,
      encoding: "hex",
      token: enteredMFAToken,
    });
    if (mfaIsCorrect) {
      return { enteredMFAIsCorrect: true };
    } else {
      return { enteredMFAIsCorrect: false };
    }
  }
);

exports.checkIfCodeToEnableMFAIsCorrect = functions.https.onCall(
  async (data, context) => {
    // We are doing this with a cloud function because the library speakeasy is NOT compatible with reactjs frontend.
    const mfaIsCorrect = speakeasy.totp.verify({
      secret: data.decryptedMFASecretHex,
      encoding: "hex",
      token: data.enteredMFAToken,
    });
    if (mfaIsCorrect) {
      return { enteredMFAIsCorrect: true };
    } else {
      return { enteredMFAIsCorrect: false };
    }
  }
);

exports.disableMFA = functions.https.onCall(async (data, context) => {
  const usersUID = context.auth.uid;
  const db = admin.firestore();
  const p1 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("mfa")
    .update({ hex: "" });
  return Promise.all([p1]);
});

exports.enableMFA = functions.https.onCall(async (data, context) => {
  const db = admin.firestore();

  // Getting secret key for user to add to the end of the encryption key
  let userSecret;
  const userSecretPath = db
    .collection("users")
    .doc("filler")
    .collection(context.auth.uid)
    .doc("secKey");
  let doc = await userSecretPath.get();
  userSecret = doc.data().secKeyStr;
  const encryptionKey = data.hashedSetMasterPassValue + userSecret;

  const encryptedMFASecretHex = CryptoJS.AES.encrypt(
    data.mfaSecretHex,
    encryptionKey
  ).toString();

  const usersUID = context.auth.uid;
  const p1 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("mfa")
    .update({ hex: encryptedMFASecretHex });
  return Promise.all([p1]);
});

exports.generateMFA = functions.https.onCall(async (data, context) => {
  // We are doing this with a cloud function because the library speakeasy is NOT compatible with reactjs frontend.
  let mfaSecret = speakeasy.generateSecret({
    name: "Personal PM",
  });

  const mfaCode = mfaSecret.base32;
  const mfaSecretHex = mfaSecret.hex;
  return {
    mfaSecret: mfaSecret,
    mfaCode: mfaCode,
    mfaSecretHex: mfaSecretHex,
    otpauthURL: mfaSecret.otpauth_url,
  };
});

exports.checkIfMasterPasswordIsCorrect = functions.https.onCall(
  async (data, context) => {
    const db = admin.firestore();
    let receivedMPH;
    let randomDecryptedString;
    /* receivedMPH is a string stored in the database that has been encrypted
  with the hash of the master password. If the hash of the master password that the user is trying to login with
  is able to decrypt the string, that means the entered master password is correct */

    const refForMSCheck = db
      .collection("users")
      .doc("filler")
      .collection(context.auth.uid)
      .doc("mpaps")
      .collection(
        "ms"
      ); /* This collection stores a string that is encrypted with the
      master pass. When the user logs in, it checks to see if the hash of the master password
      the user entered can be used to decrypt the string that is stored here. If it can,
      that means the master pass they entered is correct. If the decryption returns
      a blank string or an error, that means it is the wrong master password */

    const docSnapGetEncryptedString = await refForMSCheck.get();
    docSnapGetEncryptedString.forEach((doc) => {
      receivedMPH = doc.data().mph;
    });
    const masterPasswordHash = data.requestedMasterPasswordHash;
    try {
      randomDecryptedString = CryptoJS.AES.decrypt(
        // Encrypting the random string with the master pass hash as the key
        receivedMPH,
        masterPasswordHash
      ).toString(CryptoJS.enc.Utf8);
    } catch (err) {
      return { masterPasswordIsCorrect: false };
    }
    if (randomDecryptedString.trim() == "") {
      return { masterPasswordIsCorrect: false };
    } else {
      return { masterPasswordIsCorrect: true };
    }
  }
);

exports.updateMasterPassword = functions.https.onCall(async (data, context) => {
  const db = admin.firestore();

  const refForUserQueries = db // Collection where encrypted user entries are stored
    .collection("users")
    .doc("filler")
    .collection(context.auth.uid)
    .doc("mpaps")
    .collection("ps")
    .orderBy("nummy", "desc");
  const allUserQueriesWithOldEncryption = await refForUserQueries.get();
  let listOfOldDe = [];
  let listOfNewEn = [];

  const batch = db.batch();
  // Getting secret key for user to add to the end of each encryption
  const userSecretPath = db
    .collection("users")
    .doc("filler")
    .collection(context.auth.uid)
    .doc("secKey");
  let docOfSecret = await userSecretPath.get();
  const userSecret = docOfSecret.data().secKeyStr;

  // Defining encryption/decryption keys

  const currentKey = data.currentMPH + userSecret;
  const newKey = data.newMPH + userSecret;

  if (allUserQueriesWithOldEncryption.size > 0) {
    // This if statement converts all user passwords to be encrypted with the new master pass

    const passCollection = db
      .collection("users")
      .doc("filler")
      .collection(context.auth.uid)
      .doc("mpaps")
      .collection("ps");
    allUserQueriesWithOldEncryption.forEach((oldEncryptedUserDoc) => {
      let decryptedObjectToAppend = {};
      let newEncryptedObjectToAppend = {};
      let completeObjectToWrite = {};
      // Remeber that in all of the user objects the keys "isLink" and "random" are never encrypted
      const oldEncryptedObject = JSON.parse(
        oldEncryptedUserDoc.data().combinedQueryInfo
      );
      for (const [key, value] of Object.entries(oldEncryptedObject)) {
        // Decrypting values from object and putting it in a new decrypted object
        if (key != "random" && key != "isLink") {
          // "Random" and "isLink" are in the object, but aren't supposed to be encrypted
          decryptedObjectToAppend[key] = CryptoJS.AES.decrypt(
            value,
            currentKey
          ).toString(CryptoJS.enc.Utf8);
        } else if (key == "random" || key == "isLink") {
          // Add to object without decrypting
          decryptedObjectToAppend[key] = value;
        }
      }
      for (const [key, value] of Object.entries(decryptedObjectToAppend)) {
        // Decrypting values from object and putting it in a new decrypted object
        if (key != "random" && key != "isLink") {
          // "Random" and "isLink" are in the object, but aren't supposed to be encrypted
          newEncryptedObjectToAppend[key] = CryptoJS.AES.encrypt(
            value,
            newKey
          ).toString();
        } else if (key == "random" || key == "isLink") {
          // Add to object without encrypting
          newEncryptedObjectToAppend[key] = value;
        }
      }
      listOfOldDe.push(decryptedObjectToAppend);
      listOfNewEn.push(newEncryptedObjectToAppend);
      completeObjectToWrite = {
        combinedQueryInfo: JSON.stringify(newEncryptedObjectToAppend),
        nummy: oldEncryptedUserDoc.data().nummy, // The timestamp does not change
      };
      let newDocRef = passCollection.doc();
      batch.set(newDocRef, completeObjectToWrite);
      batch.delete(
        oldEncryptedUserDoc.ref
      ); /* We have to delete the doc that was encrypted with the 
    old master password since we are replacing it */
    });
  }

  // If user has MFA enabled, we have to make sure that we re-encrypt the hex key as well
  const refForMFADoc = db
    .collection("users")
    .doc("filler")
    .collection(context.auth.uid)
    .doc("mfa");
  const mfaDoc = await refForMFADoc.get();
  if (mfaDoc.data().hex.trim() != "") {
    // Check if mfa is enabled with this if statement
    const currentEncryptedHex = mfaDoc.data().hex;
    const currentDecryptedHex = CryptoJS.AES.decrypt(
      currentEncryptedHex,
      currentKey
    ).toString(CryptoJS.enc.Utf8);

    // Encrypt decrypted hex with new master pass key

    const newEncryptedHex = CryptoJS.AES.encrypt(
      currentDecryptedHex,
      newKey
    ).toString();

    batch.update(refForMFADoc, { hex: newEncryptedHex });
  }

  const msCollection = db
    .collection("users")
    .doc("filler")
    .collection(context.auth.uid)
    .doc("mpaps")
    .collection("ms");

  const msDocs = await msCollection.get(); // Should only be one
  // Updating the encrypted string that is used to test if the user is logging in with the correct master pass
  msDocs.forEach((e) => {
    batch.update(e.ref, { mph: data.newRandomStringEncrypted });
  });

  await batch.commit();
  return {
    listOfOldDe: listOfOldDe,
    listOfNewEn: listOfNewEn,
    USERSEC: userSecret,
    msRef: msDocs[0],
    newMPH: data.newMPH,
  };
});

exports.decryptUserQueries = functions.https.onCall(async (data, context) => {
  try {
    let listOfDecryptedObjects = [];
    const db = admin.firestore();
    const refForUserQueries = db // Collection where encrypted user entries are stored
      .collection("users")
      .doc("filler")
      .collection(context.auth.uid)
      .doc("mpaps")
      .collection("ps")
      .orderBy("nummy", "desc");

    // Getting secret key for user to add to the end of the encryption key
    let userSecret;
    const userSecretPath = db // Document of user secret key
      .collection("users")
      .doc("filler")
      .collection(context.auth.uid)
      .doc("secKey");
    let doc = await userSecretPath.get();
    userSecret = doc.data().secKeyStr;
    const decryptionKey = data.hashedSetMasterPassValue + userSecret;

    const encryptedUserDocs = await refForUserQueries.get();
    encryptedUserDocs.forEach((encUserDoc) => {
      const encUserDocData = JSON.parse(encUserDoc.data().combinedQueryInfo);
      let decryptedObjectToAppend = {};
      for (const [key, value] of Object.entries(encUserDocData)) {
        // Decrypting values from object and putting it in a new decrypted object
        if (key != "random" && key != "isLink") {
          // "Random" and "isLink" are in the object, but aren't encrypted
          decryptedObjectToAppend[key] = CryptoJS.AES.decrypt(
            value,
            decryptionKey
          ).toString(CryptoJS.enc.Utf8);
        } else if (key == "random" || key == "isLink") {
          decryptedObjectToAppend[key] = value;
        }
      }
      // Adding the decrypted doc and the ID to the final array of decrypted objects
      listOfDecryptedObjects.push([
        decryptedObjectToAppend,
        encUserDoc.id,
        encUserDoc.data().nummy,
      ]);
    });
    return {
      ERROR: "None",
      finalList: listOfDecryptedObjects,
    };
  } catch (err) {
    return {
      ERROR: err,
    };
  }
});

exports.addUserQuery = functions.https.onCall(async (data, context) => {
  try {
    const nummy = admin.firestore.FieldValue.serverTimestamp();
    const db = admin.firestore();

    // Getting secret key for user to add to the end of the encryption key
    let userSecret;
    const userSecretPath = db
      .collection("users")
      .doc("filler")
      .collection(context.auth.uid)
      .doc("secKey");
    let doc = await userSecretPath.get();
    userSecret = doc.data().secKeyStr;
    const rawObjectToAdd = data.objectToAdd;
    const randomID = data.randomID;
    const isLink = data.isLink;
    let encryptedObjectToAdd = {};
    const encryptionKey = data.hashedSetMasterPassValue + userSecret;

    const newQueryPath = db
      .collection("users")
      .doc("filler")
      .collection(context.auth.uid)
      .doc("mpaps")
      .collection("ps")
      .doc();

    let infoArray = [];

    for (const [key, value] of Object.entries(rawObjectToAdd)) {
      // Encrypting values from object and putting it in a new encrypted object
      infoArray.push(`${key}: ${value}`);

      encryptedObjectToAdd[key] = CryptoJS.AES.encrypt(
        value,
        encryptionKey
      ).toString();
    }

    encryptedObjectToAdd.isLink = isLink;
    encryptedObjectToAdd.random = randomID;
    const stringifiedEncryptedObject = JSON.stringify(encryptedObjectToAdd);

    const batch = db.batch();
    batch.create(newQueryPath, {
      combinedQueryInfo: stringifiedEncryptedObject,
      nummy: nummy,
    });
    try {
      await batch.commit();
      return {
        ERROR: "None",
        IDOfNewDoc: newQueryPath.id,
        data: data,
        encryptedObj: encryptedObjectToAdd,
        stringifiedEncryptedObject: stringifiedEncryptedObject,
        newQueryPath: newQueryPath,
        infoArray: infoArray,
        nummy: nummy,
        rawObjectToAdd: rawObjectToAdd,
        random: randomID,
        isLink: isLink,
      };
    } catch (err) {
      return {
        ERROR: "Something went wrong",
        IDOfNewDoc: newQueryPath.id,
        data: data,
        encryptedObj: encryptedObjectToAdd,
        stringifiedEncryptedObject: stringifiedEncryptedObject,
        newQueryPath: newQueryPath,
        infoArray: infoArray,
        rawObjectToAdd: rawObjectToAdd,
        nummy: nummy,
        random: randomID,
        isLink: isLink,
      };
    }
  } catch (err) {
    return { ERROR: err };
  }
});

exports.updateRawData = functions.https.onCall(async (data, context) => {
  const nummy = admin.firestore.FieldValue.serverTimestamp();
  const db = admin.firestore();
  const rawObjectToUpdate = data.objectToUpdate;
  const randomID = data.randomID;
  const isLink = data.isLink;
  let encryptedObjectToUpdate = {};

  // Getting secret key for user to add to the end of each encryption
  let userSecret;
  const userSecretPath = db
    .collection("users")
    .doc("filler")
    .collection(context.auth.uid)
    .doc("secKey");
  let doc = await userSecretPath.get();
  userSecret = doc.data().secKeyStr;

  const encryptionKey = data.hashedSetMasterPassValue + userSecret;

  const updatePath = db
    .collection("users")
    .doc("filler")
    .collection(context.auth.uid)
    .doc("mpaps")
    .collection("ps")
    .doc(data.sourceRefID);

  let infoArray = [];

  for (const [key, value] of Object.entries(rawObjectToUpdate)) {
    // Encrypting values from object and putting it in a new encrypted object
    infoArray.push(`${key}: ${value}`);
    encryptedObjectToUpdate[key] = CryptoJS.AES.encrypt(
      value,
      encryptionKey
    ).toString();
  }

  encryptedObjectToUpdate.isLink = isLink;
  encryptedObjectToUpdate.random = randomID;

  const batch = db.batch();
  const stringifiedEncryptedObject = JSON.stringify(encryptedObjectToUpdate);
  batch.update(updatePath, {
    combinedQueryInfo: stringifiedEncryptedObject,
    nummy: nummy,
  });
  batch
    .commit()
    .then(() => {
      return {
        data: data,
        encryptedObj: encryptedObjectToUpdate,
        strEncryptedObj: stringifiedEncryptedObject,
        updatePath: updatePath,
        infoArray: infoArray,
        rawObjectToUpdate: rawObjectToUpdate,
      };
    })
    .catch((err) => {
      return {
        ERROR: err,
        data: data,
        encryptedObj: encryptedObjectToUpdate,
        strEncryptedObj: stringifiedEncryptedObject,
        updatePath: updatePath,
        infoArray: infoArray,
        rawObjectToUpdate: rawObjectToUpdate,
      };
    });
});

exports.givePRole = functions.https.onCall((data, context) => {
  const usersUID = context.auth.uid;
  const db = admin.firestore();
  const p1 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("r")
    .set({ memb: "p" });
  const p2 = admin
    .auth()
    .getUser(usersUID)
    .then(() => {
      return admin.auth().setCustomUserClaims(usersUID, {
        ft: false,
        p: true,
        a: false,
      });
    })
    .then(() => {
      return {
        message: `Success! User with UID: ${usersUID}, has been registered with p`,
      };
    })
    .catch((err) => {
      return err;
    });
  return Promise.all([p1, p2]);
});

exports.giveSignUpSecret = functions.auth.user().onCreate((user) => {
  const usersUID = user.uid;
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result; // Returns a VERY long unique random id
  }
  const db = admin.firestore();
  const randomSecretStr = makeid(100); /* The secret random string that is added
  to the end of user encryptions. Right now, we are creating and saving that string to be used later*/
  const p1 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("secKey")
    .set({ secKeyStr: randomSecretStr });
  return Promise.all([p1]);
});

exports.giveSignUpRoles = functions.auth.user().onCreate((user) => {
  const usersUID = user.uid;
  const db = admin.firestore();
  const p1 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("r")
    .set({ memb: "ft" });
  const p2 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("disableAccount")
    .set({ disabled: false }); // If we change this to true, anyone logged in will be logged out and the account will be disabled
  const p3 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("mfa")
    .set({ hex: "" });
  const p4 = db
    .collection("users")
    .doc("filler")
    .collection(usersUID)
    .doc("al")
    .set({ autotime: "" });
  return Promise.all([p1, p2, p3, p4]);
});

exports.onAccountDisabled = functions.firestore
  .document("/users/filler/{userUID}/disableAccount")
  .onUpdate((change, context) => {
    if (change.after.data().disabled == true) {
      // The context.params.userUID gets the "userUID" variable from the document path (line 505)
      admin.auth().updateUser(context.params.userUID, {
        disabled: true,
      });
    } else if (change.after.data().disabled == false) {
      admin.auth().updateUser(context.params.userUID, {
        disabled: false,
      });
    }
    return {
      change: change,
    };
  });
