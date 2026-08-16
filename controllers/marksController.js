import Marks from "../models/marksModel.js";
import catchAsync from "../Utils/catchAsync.js";
import AppError from "../Utils/AppError.js";

const addMarks = catchAsync(async function (req, res) {
    const mark = await Marks.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        mark,
      },
    });
});

const getMarks = catchAsync(async function (req, res) {
    const marks = await Marks.find();
    if (marks.length === 0) {
      throw new AppError("No marks found", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        length: marks.length,
        marks,
      },
    });
});

const getClassAverage = catchAsync(async function (req, res) {
    const classAverage = await Marks.aggregate([
      { $match: { examType: req.query.examType } },
      {
        $lookup: {
          from: "students",
          localField: "Student",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "classes",
          localField: "student.class",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },
      {
        $group: {
          _id: {
            grade: "$class.grade",
            section: "$class.section",
            subjectId: "$Subject",
          },
          subjectName: { $first: "$subject.name" },
          markAverage: { $avg: "$marks" },
        },
      },
      {
        $group: {
          _id: {
            grade: "$_id.grade",
            section: "$_id.section",
          },
          subjects: {
            $push: { name: "$subjectName", average: "$markAverage" },
          },
        },
      },
      {
        $project: {
          _id: 0,
          grade: "$_id.grade",
          section: "$_id.section",
          subjects: 1,
        },
      },
      {
        $sort: {
          grade: 1,
          section: 1,
        },
      },
    ]);
    if (classAverage.length === 0) {
      throw new AppError("No class-average data found", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        length: classAverage.length,
        classAverage,
      },
    });
});

const getHighestScoring = catchAsync(async function (req, res) {
    const scoringSubjects = await Marks.aggregate([
      {
        $match: { examType: req.query.examType },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "Subject",
          foreignField: "_id",
          as: "subject",
        },
      },
      {
        $unwind: "$subject",
      },
      {
        $group: {
          _id: "$Subject",
          avgMarks: { $avg: "$marks" },
          name: { $first: "$subject.name" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          avgMarks: 1,
        },
      },
      {
        $sort: {
          avgMarks: -1,
        },
      },
      {
        $limit: 3
      }
    ]);
    if (scoringSubjects.length === 0) {
      throw new AppError("No scoring data found", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        length: scoringSubjects.length,
        scoringSubjects,
      },
    });
});

export { addMarks, getClassAverage, getMarks, getHighestScoring };
