const express = require('express');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Course = require('../models/courses');  // Assuming your course schema is in models/Course
const router = express.Router();
const { storage } = require('../cloudinary/index')
// multer
const multer = require('multer')
const upload = multer({storage})




// get new Course page
router.get('/newCoursePage',(req,res)=>{
    res.render('newCoursePage')
})



// Define the route for creating a new course
router.post('/createCourse', upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'assignments', maxCount: 5 },
    { name: 'apks', maxCount: 5 },
    { name: 'videos', maxCount: 10 } // Upload multiple videos for chapters
]), async (req, res) => {
    try {
        const newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            createdBy: req.user ? req.user._id : null,
            organizations: req.body.organizations || []
        });

        // Process images
        if (req.files['images']) {
            newCourse.images = req.files['images'].map(file => ({
                url: file.path,
                filename: file.originalname
            }));
        }

        // Process assignments and APKs
        if (req.files['assignments']) {
            newCourse.assignments = req.files['assignments'].map(file => ({
                url: file.path,
                filename: file.originalname
            }));
        }
        
        if (req.files['apks']) {
            newCourse.apks = req.files['apks'].map(file => ({
                url: file.path,
                filename: file.originalname
            }));
        }

        // Process video tutorials with chapters
        if (req.files['videos'] && req.body.chapterTitles) {
            const videosPerChapter = req.files['videos'];

            // Ensure chapterTitles and videos are paired correctly
            newCourse.videoTutorials = req.body.chapterTitles.map((chapterTitle, index) => {
                const chapterVideos = videosPerChapter.slice(index * 2, (index + 1) * 2); // Assuming 2 videos per chapter

                return {
                    chapterTitle: chapterTitle || 'Default Chapter Title', // Default if no title
                    videos: chapterVideos.map(file => ({
                        url: file.path,
                        filename: file.filename
                    }))
                };
            });
        }

        // Save the course to the database
        await newCourse.save();
        console.log("New course created with chapters:", newCourse);
        console.log('Video Tutorials:', newCourse.videoTutorials);

        res.redirect('/allCourses');
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).send("An error occurred while creating the course.");
    }
});


//get all courses
router.get('/allCourses',async(req,res)=>{
    const allCourses = await Course.find({})
    res.render('allCoursesPage',{allCourses})
})


// get course by id
// In your course router file (e.g., courses.js)
router.get('/courses/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).send("Course not found");
        }

        // Ensure videoTutorials is an array
        if (!Array.isArray(course.videoTutorials)) {
            course.videoTutorials = [];
        }
        
        res.render('courseDetailPage', { course });
    } catch (error) {
        console.error("Error fetching course details:", error);
        res.status(500).send("An error occurred while fetching course details.");
    }
});
module.exports = router;