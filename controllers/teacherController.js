import Teacher from "../models/teacherModel.js";
import Subject from "../models/subjectModel.js";

const createTeacher = async function (req, res) {
  try {
    const subject = await Subject.findOne({
      name: req.body.subject,
    });

    if (!subject) {
      throw new Error("Subject does not exist");
    }

    const teacher = await Teacher.create({
      ...req.body,
      subject: subject._id,
    });

    res.status(201).json({
      status: "success",
      data: {
        teacher,
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

const getTeachers = async function (req, res) {
  try {
    const teachers = await Teacher.find();

    res.status(200).json({
      status: "success",
      data: {
        length: teachers.length,
        teachers,
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

export { createTeacher, getTeachers };
