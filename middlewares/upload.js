// backend/middlewares/upload.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createUploadsDir = () => {
    const uploadDirs = [
        'uploads/profiles',
        'uploads/consultancies',
        'uploads/tourpackages'
    ];

    uploadDirs.forEach((dir) => {
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

            case 'consultancyLogo':
                uploadPath += 'consultancies/';
                break;

            case 'tourpackageImage':
                uploadPath += 'tourpackages/';
                break;

            default:
                return cb(new Error('Invalid field name'));
        }

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${path.extname(
                file.originalname
            )}`
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedFields = [
        'profilePicture',
        'consultancyLogo',
        'tourpackageImage',
    ];

    if (!allowedFields.includes(file.fieldname)) {
        return cb(new Error('Invalid field name'), false);
    }

    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;