const functions = require("firebase-functions");
const admin = require("firebase-admin");
const CryptoJS = require("crypto-js");
admin.initializeApp();

exports.updateRawData = functions.https.onCall((data, context) => {
  const nummy = admin.firestore.FieldValue.serverTimestamp();
  const rawObjectToUpdate = data.objectToUpdate;
  const randomID = data.randomID;
  const isLink = data.isLink;
  let encryptedObjectToUpdate = {};
  const encryptionKey = data.hashedSetMasterPassValue;
  const db = admin.firestore();
  const updatePath = db
    .collection("users")
    .doc("filler")
    .collection(data.userUID)
    .doc("mpaps")
    .collection("ps")
    .doc(data.sourceRefID);

  let infoArray = [];

  for (const [key, value] of Object.entries(rawObjectToUpdate)) {
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

  return {
    data: data,
    encryptedObj: encryptedObjectToUpdate,
    strEncryptedObj: stringifiedEncryptedObject,
    updatePath: updatePath,
    infoArray: infoArray,
    rawObjectToUpdate: rawObjectToUpdate,
  };
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
