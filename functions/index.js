const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.queryCounter = functions.firestore
  .document("/users/filler/{userId}/mpaps/ps/{passQuery}")
  .onCreate((snap, context) => {
    const db = admin.firestore();
    const userUID = context.params.uid;
    db.doc("/tempcol/tempcoldoc")
      .get()
      .then((gotten) => {
        db.doc(`/users/filler/${userUID}/mpaps/limits/numofq`)
          .set({
            qamount: gotten,
            ofwritten: userUID,
          })
          .then(() => {
            return {
              message: "Yep it works!",
            };
          })
          .catch((err) => {
            return {
              error: `Error is: ${err}`,
            };
          });
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
