let Placements = require('../models/placements.model');
const mongoose = require('mongoose');

exports.add = (req, res) => {
    const _b = req.body;

    if(_b.candidates.length === 0)  {
        res.status(200).json({ success : false, message : 'Candidates list can not be empty!'})
    } else {
        Placements
            .create(_b.candidates.map(user => {
                return {
                    passout_batch : _b.passout_batch,
                    company_name : _b.company_name,
                    job_profile : _b.job_profile,
                    recruitment : _b.recruitment,
                    recruitment_type: _b.recruitment_type,
                    recruitment_date : _b.recruitment_date,
                    intern_duration : _b.intern_duration,
                    intern_stipend : _b.intern_stipend,
                    package : _b.package,
                    student_college_id : user.college_id,
                    timestamp : new Date(),
                    author : req.decoded.college_id,
                    comments : _b.comments
                }
            }))
            .then(data => {
                console.log(data);
                res.status(200).json({ success : true, message : 'Placements data successfully added.' })
            })
            .catch(err => {
                console.log(err);
                res.status(200).json({ success : false, message : 'Something went wrong!', error : err})
            });
    }

}

exports.getAll = (req, res) => {

    const _b = req.body;

    const pipeline = [
        {
            // Lookup
            $lookup: {
                from : "users",
                localField: "student_college_id",
                foreignField : "college_id",
                as : "students"
            }
        },
        {
            // To Select Particular Fields
            $project : {
                "passout_batch" : 1,
                "company_name" : 1,
                "job_profile" : 1,
                "recruitment" : 1,
                "recruitment_type" : 1,
                "recruitment_date" : 1,
                "intern_duration" : 1,
                "intern_stipend" : 1,
                "package" : 1,
                "students.student_name" : 1,
                "students.degree" : 1,
                "students.department" : 1,
                "comments" : 1
            }
        }
    ];

    if(_b.placement_id) {
        pipeline.push({
            $match : {
                _id : mongoose.Types.ObjectId(_b.placement_id)
            }
        })
    }

    // Todo Some Filter
    Placements
        .aggregate(pipeline)
        .sort({ recruitment_date : -1 })
        .then(data => {
            res.status(200).json({ success : true, placements : data })
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!', error : err})
        })
}

exports.update = (req, res) => {

    const _b = req.body;

    Placements
        .updateOne({ _id : _b._id }, _b)
        .then(data => {
            res.status(200).json({ success : true, message : 'Placement details successfully updated..' })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}
