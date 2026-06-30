import mongoose from "mongoose";

const classSchema = mongoose.Schema({
  subjects: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject",
      },
    ],
    validate: {
      validator: function (subjects) {
        return subjects.length >= 3;
      },
      message: "A class must have at least 3 subjects",
    },
  },
  primaryTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: true,
  },
  section: {
    type: String,
    uppercase: true,
    enum: ["A", "B", "C"],
  },
  grade: {
    type: Number,
    min: 1,
    max: 12,
    required: true,
  },
  maxCapacity: {
    type: Number,
    max: [40, "A class does not have more than 40 seats."],
    min: [0, "A class cannont have negative seat value"],
  },
  stream: {
    type: String,
    enum: ["general", "science", "commerce"],
    default: "general",
  },
});

const Class = mongoose.model("Class", classSchema);

export default Class;
