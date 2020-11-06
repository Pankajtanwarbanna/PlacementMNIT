const RedFlag = require('../models/redFlag.model');
const User = require('../models/user.model');
const Utility = require('../services/utility.service');

exports.add = (req, res) => {
    const _b = req.body;

    RedFlag.create({
        redFlag : _b.redFlag,
        active : true,
        reason : _b.reason,
        assignee : req.decoded.college_id,
        receiver : _b.receiver.toUpperCase()
    })
        .then(data => {
            res.status(200).json({ success : true, message : 'Red Flag successfully added.' });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!', error : err })
        })
};

exports.remove = (req, res) => {

    const _b = req.body;

    RedFlag
        .updateOne({ _id : _b.redFlagID }, { $set : { active : false, remover : req.decoded.college_id, remove_timestamp: new Date() }})
        .then(data => {
            res.status(200).json({ success : true, message : 'Red Flag successfully removed.' });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!', error : err })
        })
};

exports.getAll = async (req, res) => {

    const _b = req.body;

    const student = await User.findOne({ college_id : _b.receiver.toUpperCase(), permission : "student" }).select('student_name').lean();

    if(!student) {
        res.status(200).json({ success : false, message : 'Incorrect Student College ID.'})
    } else {

        const pipeline = [
            {
                $match : {
                    receiver : _b.receiver.toUpperCase()
                }
            },
            {
                // Lookup
                $lookup: {
                    from : "users",
                    localField: "assignee",
                    foreignField : "college_id",
                    as : "assignees"
                }
            },
            {
                // Lookup
                $lookup: {
                    from : "users",
                    localField: "remover",
                    foreignField : "college_id",
                    as : "removers"
                }
            },
            {
                // To Select Particular Fields
                $project : {
                    "redFlag" : 1,
                    "active" : 1,
                    "reason" : 1,
                    "assignee" : 1,
                    "remover" : 1,
                    "remove_timestamp" : 1,
                    "timestamp" : 1,
                    "assignees.student_name" : 1,
                    "assignees.permission" : 1,
                    "removers.student_name" : 1,
                    "removers.permission" : 1
                }
            }
        ];

        RedFlag
            .aggregate(pipeline)
            .then(data => {

                const redFlags = Utility.calculateRedFlags(data);

                res.status(200).json({ success : true, student : student, redFlagHistory : data, redFlags : redFlags });
            })
            .catch(err => {
                console.log(err);
                res.status(200).json({ success : false, message : 'Something went wrong!', error : err })
            })
    }
};

exports.my = (req, res) => {

    RedFlag
        .find({ receiver : req.decoded.college_id })
        .select('-remover -remove_timestamp -assignee')
        .then(data => {

            const redFlags = Utility.calculateRedFlags(data);

            res.status(200).json({ success : true, redFlagHistory : data, redFlags : redFlags });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!', error : err })
        })
};
