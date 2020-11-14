let User = require('../models/user.model');
const SMS = require('../services/sms.service');
const Constant = require('../config/constant')

exports.add = async (req, res) => {
    const _b = req.body;

    if(_b.college_email.toLowerCase().split("@")[1] !== Constant.emailSuffix) {
        res.status(200).json({ success : false, message : 'Invalid MNIT College Email ID.'})
    } else {

        try {
            const coordinator = await User.create({
                student_name: _b.name.toUpperCase(),
                college_email: _b.college_email.toLowerCase(),
                college_id: _b.college_email.toUpperCase().split("@")[0] + '-PTP',
                permission: _b.permission.toLowerCase(),
                passout_batch: _b.passout_batch,
                alternate_contact_no: _b.alternate_contact_no,
                password: _b.alternate_contact_no,
                contact_no: _b.alternate_contact_no,
                ...Constant.coordinatorData
            });

            res.status(200).json({ success : true, message : 'Coordinator successfully added.'})

            const notif = await SMS.sendDM(_b, 'addCoordinator');
        }
        catch(err) {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'});
        }
    }
}

exports.getAll = (req, res) => {

    User
        .find({ permission : { $in :  Constant.placementTeamRoles } })
        .select('student_name college_id college_email alternate_contact_no permission')
        .lean()
        .then(coordinators => {
            res.status(200).json({ success : true, coordinators : coordinators })
        })
        .catch(err => {
            console.error(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'});
        })
}
