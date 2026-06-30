import mongoose from "mongoose";

const teacherSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    assignedClasses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    }],
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    }
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;

