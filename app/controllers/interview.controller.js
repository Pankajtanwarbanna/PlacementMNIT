let Interview = require('../models/interview.model');
const Mailer = require('../services/mailer.service');

exports.getAll = (req, res) => {

    Interview
        .find({ status : 'approved' })
        .select('title experience author_name tags created_at')
        .lean()
        .then(interviews => {
            res.status(200).json({ success : true, interviews : interviews })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        })
}

exports.getAll_admin = (req, res) => {

    Interview
        .find({ })
        .select('title experience author_name tags status created_at')
        .lean()
        .then(interviews => {
            res.status(200).json({ success : true, interviews : interviews })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        })
}

exports.getOne = (req, res) => {
    const _b = req.params;

    Interview
        .findOne({ _id : _b.experience_id })
        .lean()
        .then(experience => {
            res.status(200).json({ success : true, experience : experience })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        })
}

exports.add = (req, res) => {

    const _b = req.body;

    Interview.create({
        title : _b.title,
        experience : _b.experience,
        tags : _b.tags,
        author_id : req.decoded.college_id,
        author_name : req.decoded.student_name,
        created_at : new Date()
    })
        .then(data => {
            res.status(200).json({ success : true, message : 'Thanks for your contribution! Sit back and relax while our reviewers approves your interview experience.' })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        })
}

exports.changeStatus = async (req, res) => {

    const _b = req.body;

    try {
        const interview = await Interview.findOne({ _id : _b.experience_id }).select('status author_id author_name title');

        if(interview.status === 'pending') {
            interview.status = 'approved';

            const data = await interview.save();

            res.status(200).json({ success : true, message : 'Interview experience han been updated. Author will be notified.'});

            const notifyAuthor = await Mailer.sendDM(interview, 'approveInterviewExperience');

        } else {
            interview.status = 'pending';

            const data = await interview.save();

            res.status(200).json({ success : true, message : 'Interview experience han been updated. Author will be notified.'});
        }
    }
    catch (err) {
        console.error(err);
        res.status(200).json({ success : false, message : 'Something went wrong!'})
    }
}

exports.edit = (req, res) => {

    const _b = req.body;

    Interview
        .updateOne({ _id : _b._id }, _b)
        .then(data => {
            res.status(200).json({ success : true, message : 'Interview Experience successfully updated..' })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}

