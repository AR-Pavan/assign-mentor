const express = require("express");
const Mentor = require("../Models/Mentor");
const Student = require("../Models/Student");

const router = express.Router();

//creating the mentor
router.post("/create-mentor", async (req, res) => {
  try {
    const newMentor = await Mentor.create({ name: req.body.name });
    res.status(200).send(newMentor);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//api to show all students under particaular mentor
router.get("/:mentorId", async (req, res) => {
  try {
    const studentList = await Student.find({ mentor: req.params.mentorId });
    res.status(200).send(studentList);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

//api to assign a student to mentor
router.put("/assign-student", async (req, res) => {
  try {
    const findMentor = await Mentor.findById(req.body.mentorId);
    const findStudent = await Student.findById(req.body.studentId);
    if (findMentor.students.includes(req.body.studentId)) {
      res.send("This student already assigned to currently selected Mentor");
    } else if (findStudent.mentor != null) {
      res.send("This student already has a mentor");
    } else {
      const newStudent = await findMentor.updateOne({
        $push: { students: req.body.studentId },
      });
      const assigning_mentor = await findStudent.updateOne({
        $set: { mentor: req.body.mentorId },
      });
      res.send(findMentor);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});
//api to assign multiple students to single mentor
router.put("/add-multiple-students", async (req, res) => {
  try {
    const findMentor = await Mentor.findById(req.body.mentorId);
    const studentList = req.body.students;

    for (let student of studentList) {
      const findStudent = await Student.findById(student);
      if (
        !findMentor.students.includes(findStudent._id) ||
        findStudent.mentor === null
      ) {
        try {
          const addStudent = await findMentor.updateOne({
            $push: { students: student },
          });
          const assigning_mentor = await findStudent.updateOne({
            $set: { mentor: req.body.mentorId },
          });
        } catch (err) {
          res.status(500).send(err.message);
        }
      }
    }

    const newMentorList = await Mentor.findById(req.body.mentorId);
    res.send(newMentorList);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// API to Assign or Change Mentor for particular Student
router.put("/assign-mentor", async function (req, res) {
  try {
    const foundMentor = await Mentor.findOne({ _id: req.body.mentorId });
    if (foundMentor.students.includes(req.body.studentId)) {
      res.send("this student already assigned to this mentor");
    } else {
      const foundStudent = await Student.findById(req.body.studentId);
      const remove_mentor = await foundStudent.updateOne(
        {},
        { $unset: { mentor: "" } }
      );

      // updating mentor value
      const mentorAssign = await foundStudent.updateOne({
        $set: { mentor: req.body.mentorId },
      });
      // adding student to mentor's students list

      const addStudentToMentorStudents = await foundMentor.updateOne({
        $push: { students: req.body.studentId },
      });
      res.send("Mentor Assigned!");
    }
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
