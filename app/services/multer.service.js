let multer = require('multer');

// Resume Storage on Disk
let resumeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __basedir + '/public/assets/uploads/resumes/')
    },
    filename: function (req, file, cb) {

        if(!file.originalname.match(/\.(pdf)$/)) {
            let err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            cb(null,Date.now() + '_' + file.originalname.replace(/ /g,'')) // replace - to remove all white spaces
        }
    }
});

// Upload
module.exports = multer({
    storage: resumeStorage,
    limits : { fileSize : 100000000000000 }
}).single('resume');
