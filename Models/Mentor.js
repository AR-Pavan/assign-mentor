const mongoose = require("mongoose");
const Student = require("./Student");

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Student",
      default: [],
    },
  ],
});

module.exports = mongoose.model("Mentor", mentorSchema);
