const express = require("express");
const Student = require("../Models/Student");
const Mentor = require("../Models/Mentor");
const router = express.Router();

//api to create Student
router.post("/create", async (req, res) => {
  try {
    const newStudent = await Student.create({ name: req.body.name });
    res.status(200).send(newStudent, { msg: "Student created successfully!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});
//api to get all students
router.get("/all-students", async (req, res) => {
  try {
    const student = await Student.find().populate("mentor");
    res.status(200).send(student);
  } catch (err) {
    res.status(500).send(err.message);
  }
});




module.exports = router;