const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.giveFTRole = functions.https.onCall((data, context) => {
  // get user and add custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        ft: true,
        p: false,
        a: false,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been registered with ft`,
      };
    })
    .catch((err) => {
      return err;
    });
});

exports.signUpProperties = functions.https.onCall((data, context) => {
  return admin
    .auth()
    .setCustomUserClaims(data.uid, {
      ft: true,
      p: false,
      a: false,
    })
    .then(() => {
      return {
        message: `Success!`,
      };
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
});

exports.givePRole = functions.https.onCall((data, context) => {
  // get user and add custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        ft: false,
        p: true,
        a: false,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been registered with p`,
      };
    })
    .catch((err) => {
      return err;
    });
});

exports.giveRoleInFS = functions.auth.user().onCreate((user) => {
  const newUsersUID = user.uid;
  const db = admin.firestore();
  return db.collection("hey").doc("hello").set({ testMessage: "this is set" });
});
