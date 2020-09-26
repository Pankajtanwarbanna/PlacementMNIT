let User = require('../models/user.model');
let Company = require('../models/company.model');
const Export = require('../services/export.service');
let mongoose = require('mongoose');
let zip = require('express-zip');

exports.resumes = (req, res) => {

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
                    "registered_candidates.resume_url" : 1,
                    "registered_candidates.student_name" : 1,
                    "registered_candidates.college_id" : 1
                }
            }
        ])
        .then(company => {
            res.zip(Export.resumes(company[0].registered_candidates), 'resume-zip-files.zip', err => { console.error(err); });
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}
