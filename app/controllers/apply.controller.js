let User = require('../models/user.model');
const Company = require('../models/company.model');

exports.getStatus = (req, res) => {

    const _b = req.params;

    Company
        .findOne({ _id : _b.company_id })
        .select('candidates')
        .lean()
        .then(company => {
            let isCandidateAlreadyRegistered = company.candidates.find(function (candidate) {
                return candidate.college_id === req.decoded.college_id
            });
            if(isCandidateAlreadyRegistered) {
                res.status(200).json({ success : true, message : 'Applied', status : isCandidateAlreadyRegistered.candidate_status});
            } else {
                res.status(200).json({ success : false, message : 'Not applied.'})
            }
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!' })
        })
};

exports.oneClickApply = async (req, res) => {

    const _b = req.body;

    try {
        const company = await Company.findOne({ _id : _b.company_id }).select('candidates');

        const isCandidateAlreadyRegistered = company.candidates.find(function (candidate) {
            return candidate.college_id === req.decoded.college_id;
        });

        if(!isCandidateAlreadyRegistered) {
            // todo = Validations
            company.candidates.push({ college_id : req.decoded.college_id, timestamp : new Date()});

            const data = await company.save();
            res.status(200).json({ success : true, message : 'Successfully applied.' })

        } else {
            res.status(200).json({ success : false, message : 'Already applied.'})
        }
    }
    catch (err) {
        console.error(err);
        res.status(200).json({ success : false, message : 'Something went wrong!' })
    }
}

exports.withdraw = async (req, res) => {

    const _b = req.body;

    try {
        const company = await Company.findOne({ _id : _b.company_id }).select('candidates');

        let college_id = req.decoded.college_id;
        if(_b.college_id) { // Todo Make it ternary operator
            college_id = _b.college_id;
        }
        // This method is 50% faster as compared to loop then splice and filter method
        company.candidates.splice(company.candidates.map(function (candidate) {
            return candidate.college_id;
        }).indexOf(college_id), 1);

        const data = await company.save();
        res.status(200).json({ success : true, message : 'Registration successfully withdraw.' })
    }
    catch (err) {
        console.error(err);
        res.status(200).json({ success : false, message : 'Something went wrong!' })
    }
}
