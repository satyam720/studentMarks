import mongoose from "mongoose";
import Class from "../models/classModel.js";
import Student from "../models/studentModel.js";
import catchAsync from "../Utils/catchAsync.js";
import AppError from "../Utils/AppError.js";

const createStudent = catchAsync(async function (req, res) {
    const standard = await Class.findById(req.body.class);
    if (!standard) {
      throw new Error("Student assigned to invalid class");
    }

    const subjectSet = new Set(standard.subjects.map((sub) => sub.toString()));
    for (const sub of req.body.subjects) {
      if (!subjectSet.has(sub.toString())) {
        throw new Error(`${sub} is not taught in class`);
      }
    }

    const selectedSub = req.body.subjects;
    if (new Set(selectedSub).size != selectedSub.length) {
      throw new Error("Duplicate subjects selected");
    }
    const student = await Student.create(req.body);
    res.status(200).json({
      message: "success",
      data: {
        student,
      },
    });
});

const getStudents = catchAsync(async function (req, res) {
    const student = await Student.find();
    if (student.length === 0) {
      throw new AppError("No students found", 404);
    }

    res.status(200).json({
      message: "success",
      data: {
        length: student.length,
        student,
      },
    });
});

const getStudent = catchAsync(async function (req, res) {
    const student = await Student.findById(req.params.id);
    if (!student) {
      throw new AppError("Student not found", 404);
    }

    res.status(200).json({
      message: "success",
      data: {
        student,
      },
    });
});

const getClassStudents = catchAsync(async function (req, res) {
    const match = {};

    if (req.query.grade && req.query.section) {
      const classDoc = await Class.findOne({
        grade: req.query.grade,
        section: req.query.section,
      });

      if (!classDoc) {
        throw new AppError("Class not found", 404);
      }

      match.class = classDoc._id;
    }

    if (req.query.classId) {
      match.class = new mongoose.Types.ObjectId(req.query.classId);
    }

    const classStudents = await Student.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "classes",
          localField: "class",
          foreignField: "_id",
          as: "standard",
        },
      },
      { $unwind: "$standard" },
      {
        $group: {
          _id: "$class",
          students: {
            $push: {
              name: "$name",
              rollNumber: "$rollNumber",
            },
          },
          grade: { $first: "$standard.grade" },
          section: { $first: "$standard.section" },
        },
      },
      {
        $sort: {
          grade: 1,
        },
      },
      {
        $project: {
          _id: 0,
          students: 1,
          std: { $concat: [{ $toString: "$grade" }, "$section"] },
        },
      },
    ]);
    if (classStudents.length === 0) {
      throw new AppError("No students found for this class", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        length: classStudents.length,
        classStudents,
      },
    });
});

export { createStudent, getStudents, getStudent, getClassStudents };
