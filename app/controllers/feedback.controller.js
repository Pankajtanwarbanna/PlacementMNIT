let Feedback = require('../models/feedback.model');

exports.add = (req, res) => {

    const _b = req.body;

    Feedback.create({
        title : _b.title,
        feedback : _b.feedback,
        author_name : req.decoded.student_name,
        author_email : req.decoded.college_id + '@mnit.ac.in',
        timestamp : new Date()
    })
        .then(data => {
            res.status(200).json({ success : true, message : 'Thank you for submitting feedback.' })
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!', error : err})
        });
};

exports.getAll = (req, res) => {

    Feedback
        .find({ })
        .select('title feedback author_name author_email timestamp')
        .sort({ timestamp : -1 })
        .lean()
        .then( feedbacks => {
            res.status(200).json({ success : true, feedbacks : feedbacks })
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        });
}
