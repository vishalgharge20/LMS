// cloudinary/index.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Make sure this is correct
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        let folder;
        let resourceType = 'auto'; // Default resource type

        switch (file.fieldname) {
            case 'images':
                folder = 'LMS/CourseImages';
                resourceType = 'image';
                break;
            case 'videos':
                folder = 'LMS/VideoTutorials';
                resourceType = 'video';
                break;
            case 'assignments':
                folder = 'LMS/Assignments';
                resourceType = 'raw';
                break;
            case 'apks':
                folder = 'LMS/APKs';
                resourceType = 'raw';
                break;
            default:
                folder = 'LMS/Other';
                resourceType = 'raw';
        }

        try {
            // Generate a clean `public_id` by using a sanitized file name and current timestamp
            const originalName = file.originalname.split('.')[0]; // Remove file extension
            const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9_-]/g, ""); // Remove special characters
            const uniqueSuffix = Date.now(); // Add a timestamp to ensure uniqueness

            return {
                folder: folder,
                resource_type: resourceType,
                public_id: `${sanitizedFileName}_${uniqueSuffix}`, // Custom public ID
                allowedFormats: resourceType === 'raw' ? ['pdf', 'doc', 'docx', 'apk'] : ['jpeg', 'png', 'jpg', 'mp4'],
            };
        } catch (error) {
            console.error('Error generating Cloudinary params:', error);
            throw error;
        }
    }
});

module.exports = { cloudinary, storage };
