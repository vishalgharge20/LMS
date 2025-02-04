const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'student'
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization' // Link to the organization the student belongs to
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course' // Courses the student is assigned to
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
