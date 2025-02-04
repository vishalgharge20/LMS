const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'Admin' // refers to admins assigned to the organization
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student' // refers to students in the organization
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course' // Courses assigned to organization by super admin
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin' // Reference to the super admin who created the organization
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
