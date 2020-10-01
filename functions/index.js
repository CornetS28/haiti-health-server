const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();

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
