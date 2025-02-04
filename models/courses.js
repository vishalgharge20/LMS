const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    images: [{
        url: String,   // URL where the image is stored
        filename: String,  // Original filename for reference
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    videoTutorials: [{
        chapterTitle: {   // Title of the chapter
            type: String,
            required: true
        },
        videos: [{  // Array of videos within this chapter
            url: String,
            filename: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }]
    }],
    assignments: [{
        url: String,
        filename: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    apks: [{
        url: String,
        filename: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'SuperAdmin', // Reference to SuperAdmin who created the course
        // required: true
    },
    organizations: [{
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    assignedUsers: [{  // Optional users
        type: Schema.Types.ObjectId,
        ref: 'Student'  // Users (students) assigned to the course
    }]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;