import Class from "../models/classModel.js";
import Subject from "../models/subjectModel.js";
import Teacher from "../models/teacherModel.js";

const createClass = async function (req, res) {
  try {
    const subjects = await Subject.find({
      _id: { $in: req.body.subjects },
    });
    if (req.body.subjects.length != subjects.length) {
      throw new Error("One or more subject is an invalid subject");
    }

    const teacher = await Teacher.findById(req.body.primaryTeacher);
    if (!teacher) {
      throw new Error("Assigned Teacher is not a valid teacher");
    }

    if (teacher.assignedClasses.length >= 3) {
      throw new Error("Teacher already is a class teacher for 3 classes");
    }

    let className = req.body.grade + req.body.section;
    const existingClasses = await Class.find({
      grade: { $in: req.body.grade },
    });

    const classNames = existingClasses.map((c) => c.grade + c.section);
    if (classNames.includes(className)) {
      throw new Error(
        "This class already exists, and duplicate cannot be created",
      );
    }

    const classes = await Class.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        classes,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      data: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};

const getClass = async function (req, res) {
  try {
    const classes = await Class.find();

    res.status(200).json({
      status: "success",
      data: {
        length: classes.length,
        classes,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      data: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};

export { createClass, getClass };
