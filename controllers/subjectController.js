import Subject from "../models/subjectModel.js";
import catchAsync from "../Utils/catchAsync.js";
import AppError from "../Utils/AppError.js";

const createSubject = catchAsync(async function(req, res) {
        const subject = await Subject.create(req.body);
        res.status(201).json({
            status: 'succes',
            data: {
                subject
            }
        })
})

const getSubject = catchAsync(async function (req, res){
        const subject = await Subject.find();
        if (subject.length === 0) {
            throw new AppError("No subjects found", 404);
        }
        
        res.status(200).json({
            message: 'success',
            data: {
                length: subject.length,
                subject
            }
        })
})

export {createSubject, getSubject};
