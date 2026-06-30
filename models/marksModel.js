import mongoose from "mongoose";

const marksSchema = mongoose.Schema({
    Student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    Subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    marks: {
        type: Number,
        min: [0, 'Marks cannot be less than 0'],
        max: [100, 'Marks obtained cannot be more than 100'],
        required: true
    },
    examType: {
        type: String,
        enum: ['unit_1', 'unit_2', 'midterm', 'final']
    }
});

const Marks = mongoose.model('Marks', marksSchema);

export default Marks;