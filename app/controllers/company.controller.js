const User = require('../models/user.model');
const Company = require('../models/company.model');
const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
    const _b = req.body;

    const opts = { deadline_date : { $lt: new Date() } };

    if(_b.active) opts.deadline_date = { $gte: new Date() -1 };

    try {
        const user = await User.findOne({ college_id : req.decoded.college_id }).select('passout_batch').lean();

        const companies = await Company.find({ passout_batch: user.passout_batch, ...opts }).select('company_name job_profile package deadline_date').lean()

        res.status(200).json({ success : true, companies : companies })
    }
    catch (err) {
        console.error(err);
        res.status(200).json({ success : false, message : 'Something went wrong!'});
    }
}

exports.getOne = (req, res) => {

    const _b = req.params;

    Company
        .findOne({ _id : _b.company_id })
        .select('-candidates')
        .lean()
        .then( companyDetail => {
            res.status(200).json({ success : true, companyDetail : companyDetail })
        })
        .catch( err => {
            console.error(err);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}

exports.add = (req, res) => {

    const _b = req.body;

    Company
        .create(_b)
        .then(data => {
            res.status(200).json({ success : true, message : 'Successfully new company added.'})
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong! Did you miss Company Name, Passout Batch, Job Profile or Deadline date?'})
        })
}

exports.update = (req, res) => {

    const _b = req.body;

    Company
        .updateOne({ _id : _b._id }, _b)
        .then(data => {
            res.status(200).json({ success : true, message : 'Company Details successfully updated.' })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}

exports.remove = (req, res) => {

    const _b = req.body;

    Company
        .findOneAndRemove({ _id : _b.company_id })
        .then(data => {
            res.status(200).json({ success : true, message : 'Successfully deleted company.'})
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}

exports.allApplied = (req, res) => {

    const _p = req.params;

    Company
        .aggregate([
            {
                // Document matching Company ID
                $match : {
                    _id : mongoose.Types.ObjectId(_p.company_id)
                }
            },
            {
                // Lookup
                $lookup: {
                    from : "users",
                    localField: "candidates.college_id",
                    foreignField : "college_id",
                    as : "registered_candidates"
                }
            },
            {
                // To Select Particular Fields
                $project : {
                    "company_name" : 1,
                    "registered_candidates.student_name" : 1,
                    "registered_candidates.college_id" : 1,
                    "registered_candidates.alternate_contact_no" : 1,
                    "registered_candidates.college_email" : 1,
                    "registered_candidates.program" : 1,
                    "registered_candidates.degree" : 1,
                    "registered_candidates.department" : 1,
                    "registered_candidates.cgpa" : 1,
                    "registered_candidates.matric_marks" : 1,
                    "registered_candidates.senior_marks" : 1,
                    "registered_candidates.resume_url" : 1
                }
            }
        ])
        .then(company => {
            res.status(200).json({ success : true, company : company[0] })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}

