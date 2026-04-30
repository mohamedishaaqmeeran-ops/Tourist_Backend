const multer = require('multer');
const path = require('path');
const fs = require('fs');


const createUploadsDir = () => {
    const uploadDirs = [
        'uploads/profiles',
        'uploads/course',
        'uploads/lesson'
    ];

    uploadDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

createUploadsDir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        switch (file.fieldname) {
            case 'profilePicture':
                uploadPath += 'profiles/';
                break;

            case 'courseLogo':
                uploadPath += 'course/';
                break;

            case 'lessonImage':
                uploadPath += 'lesson/';
                break;

            default:
                return cb(new Error('Invalid field name'), false);
        }

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(
            null,
            file.fieldname +
                '-' +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    }
});


const fileFilter = (req, file, cb) => {
    if (
        ['profilePicture', 'courseLogo', 'lessonImage']
            .includes(file.fieldname)
    ) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    } else {
        cb(new Error('Invalid field name'), false);
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;