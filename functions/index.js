const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

admin.initializeApp();

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

exports.api = functions.https.onRequest(app);