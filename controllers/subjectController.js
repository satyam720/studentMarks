import Subject from "../models/subjectModel.js";

const createSubject = async function(req, res) {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json({
            status: 'succes',
            data: {
                subject
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            data: {
                message: error.message,
                stack: error.stack
            }
        })
    }
}

const getSubject = async function (req, res){
    try {
        const subject = await Subject.find();
        
        res.status(200).json({
            message: 'success',
            data: {
                length: subject.length,
                subject
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            data: {
                message: error.message,
                stack: error.stack
            }
        })
    }
}

export {createSubject, getSubject};