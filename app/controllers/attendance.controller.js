const Company = require('../models/company.model');
const Utility = require('../services/utility.service');

exports.getStatus = (req, res) => {

    const _b = req.params;

    Company
        .findOne({ _id : _b.company_id })
        .select('attendance company_otp')
        .lean()
        .then(company => {
            res.status(200).json({ success : true, attendanceStatus : company.attendance, company_otp : company.company_otp})
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        })
}

exports.mark = async (req, res) => {

    const _b = req.body;

    try {
        const company = await Company.findOne({ _id : _b.company_id }).select('attendance company_otp candidates');

        if(company.attendance) {
            if(company.company_otp === _b.otp) {
                let index = company.candidates.indexOf(company.candidates.find(candidate => candidate.college_id === req.decoded.college_id));

                company.candidates[index].candidate_status = 'Appeared';

                const data = await company.save();

                res.status(200).json({ success : true, message : 'Attendance successfully marked.'})
            } else {
                res.status(200).json({ success : false, message : 'Incorrect OTP'})
            }
        } else {
            res.status(200).json({ success : false, message : 'Attendance is closed.'})
        }
    }
    catch (err) {
        console.error(err);
        res.status(200).json({ success : false, message : 'Something went wrong!'})
    }
}

exports.update = async (req, res) => {
    const _b = req.body;

    try {
        const company = await Company.findOne({ _id : _b.company_id }).select('attendance company_otp');

        if(company.attendance) {
            company.attendance = false;
            company.company_otp = '';

        } else {
            // If Attendance Closed then start Attendance
            company.attendance = true;
            company.company_otp = Utility.generateOTP();
        }

        const data = await company.save();

        res.status(200).json({ success : true, message : 'Attendance successfully updated.'});
    }
    catch (err) {
        console.error(err);
        res.status(200).json({ success : false, message : 'Something went wrong!'})
    }
}

exports.complete = async (req, res) => {
    const _b = req.body;

    try {
        const company = await Company.findOne({ _id : _b.company_id }).select('attendance company_otp');

        // todo Make it more Efficient
        if(company.candidates) {
            for(let i=0;i< company.candidates.length;i++) {
                if(company.candidates[i].candidate_status === 'Applied') {
                    company.candidates[i].candidate_status = 'Absent';
                }
            }
        }

        company.attendance = false;

        const data = await company.save();

        res.status(200).json({ success : true, message : 'Attendance successfully completed.'});
    }
    catch (err) {
        console.error(err);
        res.status(200).json({ success : false, message : 'Something went wrong!'})
    }
}
