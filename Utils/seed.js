import randomName from "random-indian-name";
import Subject from "../models/subjectModel.js";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import Teacher from "../models/teacherModel.js";
import Class from "../models/classModel.js";
import Student from "../models/studentModel.js";
import Marks from "../models/marksModel.js";

configDotenv({ path: "./config.env", debug: true, encoding: "UTF-8" });

const DB = mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("connected to DB"));
const subData = [
  {
    name: "mathematics",
  },
  {
    name: "english",
  },
  {
    name: "science",
  },
  {
    name: "social studies",
  },
  {
    name: "hindi",
  },
  {
    name: "general knowledge",
  },
  {
    name: "computer science",
    optional: true,
  },
  {
    name: "physical education",
    optional: true,
  },
  {
    name: "art",
    optional: true,
  },
  {
    name: "music",
    optional: true,
  },
  {
    name: "economics",
    optional: true,
  },
  {
    name: "business studies",
    optional: true,
  },
];

const teacherData = [
  {
    name: "lata sharma",
    subject: "mathematics",
  },
  {
    name: "rahul verma",
    subject: "science",
  },
  {
    name: "priya singh",
    subject: "english",
  },
  {
    name: "amit kumar",
    subject: "computer science",
  },
  {
    name: "neha gupta",
    subject: "social studies",
  },
  {
    name: "anita joshi",
    subject: "hindi",
  },
  {
    name: "vikas mehta",
    subject: "physical education",
  },
  {
    name: "kavita reddy",
    subject: "general knowledge",
  },
  {
    name: "suresh nair",
    subject: "economics",
  },
  {
    name: "meena patel",
    subject: "business studies",
  },
  {
    name: "rohit agarwal",
    subject: "art",
  },
  {
    name: "deepa menon",
    subject: "music",
  },
];

const tillFive = [
  "6a36708dc1bb5d15a66b6b86",
  "6a36708dc1bb5d15a66b6b87",
  "6a36708dc1bb5d15a66b6b88",
  "6a36708dc1bb5d15a66b6b8a",
  "6a36708dc1bb5d15a66b6b8b",
  "6a36708dc1bb5d15a66b6b8e",
  "6a36708dc1bb5d15a66b6b8f",
];
const tillEight = [
  "6a36708dc1bb5d15a66b6b86",
  "6a36708dc1bb5d15a66b6b87",
  "6a36708dc1bb5d15a66b6b88",
  "6a36708dc1bb5d15a66b6b89",
  "6a36708dc1bb5d15a66b6b8a",
  "6a36708dc1bb5d15a66b6b8c",
  "6a36708dc1bb5d15a66b6b8d",
];

const tillTenth = [
  "6a36708dc1bb5d15a66b6b86",
  "6a36708dc1bb5d15a66b6b87",
  "6a36708dc1bb5d15a66b6b88",
  "6a36708dc1bb5d15a66b6b89",
  "6a36708dc1bb5d15a66b6b8a",
  "6a36708dc1bb5d15a66b6b8c",
];
const Science = [
  "6a36708dc1bb5d15a66b6b86",
  "6a36708dc1bb5d15a66b6b87",
  "6a36708dc1bb5d15a66b6b88",
  "6a36708dc1bb5d15a66b6b8c",
];
const Commerce = [
  "6a36708dc1bb5d15a66b6b87",
  "6a36708dc1bb5d15a66b6b90",
  "6a36708dc1bb5d15a66b6b91",
  "6a36708dc1bb5d15a66b6b86",
];

const seedData = async function () {
  try {
    await Class.deleteMany();
    const teachers = await Teacher.find();

    let teacherIndex = 0;

    for (let grade = 1; grade <= 12; grade++) {
      for (const section of ["A", "B", "C"]) {
        const data = {
          grade,
          section,
          maxCapacity: 40,
          primaryTeacher: teachers[teacherIndex % teachers.length]._id,
        };

        teacherIndex++;

        // choose subjects & stream
        if (grade <= 10) {
          data.stream = "general";
          if (grade <= 5) {
            data.subjects = tillFive;
          } else if (grade <= 8) {
            data.subjects = tillEight;
          } else {
            data.subjects = tillTenth;
          }
        } else {
          if (section == "A" || section == "B") {
            data.stream = "science";
          } else {
            data.stream = "commerce";
          }

          if (data.stream == "science") {
            data.subjects = Science;
          } else {
            data.subjects = Commerce;
          }
        }
        const newClass = await Class.create(data);
        console.log(newClass);

        await Teacher.findByIdAndUpdate(data.primaryTeacher, {
          $push: {
            assignedClasses: newClass._id,
          },
        });
      }
    }

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

// seedData();

const seedTeacherData = async function () {
  try {
    await Teacher.deleteMany();

    for (const teacher of teacherData) {
      const subject = await Subject.findOne({
        name: { $in: teacher.subject },
      });

      teacher.subject = subject.id;
    }

    const teachers = await Teacher.create(teacherData);
    console.log(teachers);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

const seedStudentsData = async function () {
  try {
    await Student.deleteMany();
    const classes = await Class.find();

    var max = 19;
    var min = 6;
    for (const cl of classes) {
      for (let i = 0; i < 20; i++) {
        const config = {
          name: randomName(),
          age: cl.grade + 5 + Math.floor(Math.random() * 2),
          rollNumber: i + 1,
          class: cl._id,
          subjects: cl.subjects,
        };

        const student = await Student.create(config);
        console.log(student.name);
      }
    }

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

function randomMarks(){

    const r = Math.random();

    if(r < 0.05){
        return Math.floor(Math.random()*30);
    }

    if(r < 0.20){
        return Math.floor(Math.random()*25)+30;
    }

    return Math.floor(Math.random()*41)+60;
}

const seedMarks = async function () {
  try {
    await Marks.deleteMany();

    const students = await Student.find();

    const exams = ["unit_1", "unit_2", "midterm", "final"];

    for (const student of students) {
      for (const subject of student.subjects) {
        for (const exam of exams) {
          await Marks.create({
            Student: student._id,
            Subject: subject,
            marks: randomMarks(),
            examType: exam,
          });
        }
      }
    }
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

seedMarks();

// seedStudentsData();

// seedTeacherData();
