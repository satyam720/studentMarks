import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 6,
    max: 19,
  },
  rollNumber: {
    type: Number,
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "class",
    required: true,
  },
  subjects: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "subject" }],
    required: true,
  },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
