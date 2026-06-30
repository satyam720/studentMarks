import Marks from "../models/marksModel.js";

const addMarks = async function (req, res) {
  try {
    const mark = await Marks.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        mark,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      data: {
        error: error.message,
      },
    });
  }
};

const getMarks = async function (req, res) {
  try {
    const marks = await Marks.find();
    res.status(200).json({
      status: "success",
      data: {
        length: marks.length,
        marks,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      data: {
        error: error.message,
      },
    });
  }
};

const getClassAverage = async function (req, res) {
  try {
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

    res.status(200).json({
      status: "success",
      data: {
        length: classAverage.length,
        classAverage,
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

const getHighestScoring = async function (req, res) {
  try {
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

    res.status(200).json({
      status: "success",
      data: {
        length: scoringSubjects.length,
        scoringSubjects,
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

export { addMarks, getClassAverage, getMarks, getHighestScoring };
