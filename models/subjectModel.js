import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    optional: {
        type: Boolean,
        default: false,
    },
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;