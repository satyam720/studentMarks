import mongoose from "mongoose";
import Class from "../models/classModel.js";
import Student from "../models/studentModel.js";

const createStudent = async function (req, res) {
  try {
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

const getStudents = async function (req, res) {
  try {
    const student = await Student.find();

    res.status(200).json({
      message: "success",
      data: {
        length: student.length,
        student,
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

const getStudent = async function (req, res) {
  try {
    const student = await Student.findById(req.params.id);

    res.status(200).json({
      message: "success",
      data: {
        student,
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

const getClassStudents = async function (req, res) {
  try {
    const match = {};

    if (req.query.grade && req.query.section) {
      const classDoc = await Class.findOne({
        grade: req.query.grade,
        section: req.query.section,
      });

      if (!classDoc) {
        return res.status(404).json({
          status: "fail",
          message: "Class not found",
        });
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

    res.status(200).json({
      status: "success",
      data: {
        length: classStudents.length,
        classStudents,
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

export { createStudent, getStudents, getStudent, getClassStudents };
