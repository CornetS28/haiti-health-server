const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();
const config = {
  apiKey: "AIzaSyCluLOuLCYUPKh4xjJ5xURfe1P8sPfUzQI",
  authDomain: "haiti-heath-server-01.firebaseapp.com",
  databaseURL: "https://haiti-heath-server-01.firebaseio.com",
  projectId: "haiti-heath-server-01",
  storageBucket: "haiti-heath-server-01.appspot.com",
  messagingSenderId: "708118100034",
  appId: "1:708118100034:web:204d2ffd36848fc801d5db",
};

const firebase = require("firebase");
firebase.initializeApp(config);

app.get("/departments", (req, res) => {
  admin
    .firestore()
    .collection("departments")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let departments = [];
      data.forEach((doc) =>
        departments.push({
          departmentId: doc.id,
          ...doc.data(),
          createdAt: new Date().toISOString(),
          //OR
          // departmentName: doc.data().departmentName,
          // userHandle: doc.data().userHandle
        })
      );
      return res.json(departments);
    })
    .catch((err) => console.error(err));
});

app.post("/department", (req, res) => {
  const newDepartment = {
    departmentName: req.body.departmentName,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };
  admin
    .firestore()
    .collection("departments")
    .add(newDepartment)
    .then((doc) => {
      res.json({ message: `department ${doc.id} created successfully!` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong!!" });
      console.error(err);
    });
});

// Signup route
app.post("/signup", (req, res) => {
  const createNewUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  // TODO: valite user data

  firebase
    .auth()
    .createUserWithEmailAndPassword(createNewUser.email, createNewUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} created succesfully!` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    })
});

exports.api = functions.https.onRequest(app);