const User = require('../models/user.model');
const Multer = require('../services/multer.service');

exports.resume = async (req, res) => {

    Multer(req, res, function (err) {
        if (err) {
            if(err.code === 'LIMIT_FILE_SIZE') {
                res.json({ success : false, message : 'File is too large to upload.'})
            } else if(err.code === 'filetype') {
                res.json({ success : false, message : 'File type invalid. Only PDF files accepted.'})
            } else {
                res.json({ success : false, message : 'File was not able to be uploaded. Try again later.'})
            }
        } else {
            if (!req.file) {
                res.status(200).json({success: false, message: 'File is missing.'})
            } else {
                User
                    .updateOne({college_id: req.decoded.college_id}, {resume_url: req.file.filename})
                    .then(data => {
                        res.status(200).json({success: true, message: 'Resume successfully uploaded.'})
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(200).json({success: false, message: 'Something went wrong!'})
                    })
            }
        }
    })
}
