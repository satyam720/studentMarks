import Teacher from "../models/teacherModel.js";
import Subject from "../models/subjectModel.js";
import catchAsync from "../Utils/catchAsync.js";
import AppError from "../Utils/AppError.js";

const createTeacher = catchAsync(async function (req, res) {
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
});

const getTeachers = catchAsync(async function (req, res) {
    const teachers = await Teacher.find();
    if (teachers.length === 0) {
      throw new AppError("No teachers found", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        length: teachers.length,
        teachers,
      },
    });
});

export { createTeacher, getTeachers };
