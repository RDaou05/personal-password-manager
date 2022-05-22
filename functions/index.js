const functions = require("firebase-functions");
const admin = require("firebase-admin");
const CryptoJS = require("crypto-js");
admin.initializeApp();

exports.updateMasterPassword = functions.https.onCall(async (data, context) => {
  const db = admin.firestore();
  // Getting secret key for user to add to the end of each encryption
  let userSecret;
  const userSecretPath = db
    .collection("users")
    .doc("filler")
    .collection(data.userUID)
    .doc("secKey");
  let docOfSecret = await userSecretPath.get();
  userSecret = docOfSecret.data().secKeyStr;

  // Defining encryption/decryption keys

  const currentKey = data.currentMPH + userSecret;
  const newKey = data.newMPH + userSecret;

  const refForUserQueries = db // Collection where encrypted user entries are stored
    .collection("users")
    .doc("filler")
    .collection(data.userUID)
    .doc("mpaps")
    .collection("ps")
    .orderBy("nummy", "desc");
  const allUserQueriesWithOldEncryption = await refForUserQueries.get();
  let listOfOldDe = [];
  let listOfNewEn = [];
  //
  const batch = db.batch();
  const passCollection = db
    .collection("users")
    .doc("filler")
    .collection(data.userUID)
    .doc("mpaps")
    .collection("ps");
  //
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
  const msCollection = db
    .collection("users")
    .doc("filler")
    .collection(data.userUID)
    .doc("mpaps")
    .collection("ms");

  const msDocs = msCollection.get(); // Should only be one
  // Updating the encrypted string that is used to test if the user is logging in with the correct master pass
  batch.set(msDocs[0].ref, { mph: data.newRandomStringEncrypted });
  await batch.commit();

  return {
    listOfOldDe: listOfOldDe,
    listOfNewEn: listOfNewEn,
    USERSEC: userSecret,
  };
});

exports.decryptUserQueries = functions.https.onCall(async (data, context) => {
  try {
    let listOfDecryptedObjects = [];
    const db = admin.firestore();
    const refForUserQueries = db // Collection where encrypted user entries are stored
      .collection("users")
      .doc("filler")
      .collection(data.userUID)
      .doc("mpaps")
      .collection("ps")
      .orderBy("nummy", "desc");

    // Getting secret key for user to add to the end of each encryption
    let userSecret;
    const userSecretPath = db // Document of user secret key
      .collection("users")
      .doc("filler")
      .collection(data.userUID)
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
      listOfDecryptedObjects.push([decryptedObjectToAppend, encUserDoc.id]);
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

    // Getting secret key for user to add to the end of each encryption
    let userSecret;
    const userSecretPath = db
      .collection("users")
      .doc("filler")
      .collection(data.userUID)
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
      .collection(data.userUID)
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
        rawObjectToAdd: rawObjectToAdd,
      };
    } catch (err) {
      return {
        ERROR: err,
        IDOfNewDoc: newQueryPath.id,
        data: data,
        encryptedObj: encryptedObjectToAdd,
        stringifiedEncryptedObject: stringifiedEncryptedObject,
        newQueryPath: newQueryPath,
        infoArray: infoArray,
        rawObjectToAdd: rawObjectToAdd,
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
    .collection(data.userUID)
    .doc("secKey");
  let doc = await userSecretPath.get();
  userSecret = doc.data().secKeyStr;

  const encryptionKey = data.hashedSetMasterPassValue + userSecret;

  const updatePath = db
    .collection("users")
    .doc("filler")
    .collection(data.userUID)
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
  const usersUID = data.uid;
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
  const p2 = admin
    .auth()
    .getUser(usersUID)
    .then(() => {
      return admin.auth().setCustomUserClaims(usersUID, {
        ft: true,
        p: false,
        a: false,
      });
    })
    .then(() => {
      return {
        message: `Success! ${user.email} has been registered with ft`,
      };
    })
    .catch((err) => {
      return err;
    });
  return Promise.all([p1, p2]);
});
