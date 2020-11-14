let Notification    = require('../models/notification.model');
let Company         = require('../models/company.model');
let User            = require('../models/user.model');

exports.add = async (req, res) => {

    const _b = req.body;
    let users;
    let reference;

    // TODO : This is quite basic, give freedom to SPC to send notifications to particular branch, batch etc
    if(_b.companyId) {
        let company     = await Company.findOne({ _id : _b.companyId });
        reference       = 'company_' + _b.companyId; // To check in future
        users           = await User.find({ $or : [
            { passout_batch : company.passout_batch},
            { permission : { $in : ['spc', 'faculty-coordinator']} }
        ]});
    }

    Notification
        .create(users.map(user => {
            return {
                title       : _b.title,
                description : _b.description,
                sender      : req.decoded.college_id,
                receiver    : user.college_id,
                reference   : reference,
                timestamp   : new Date()
            }
        }))
        .then(data => {
            res.status(200).json({ success : true, message : 'Notification successfully added.' })
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!', error : err})
        });
};

exports.getAll = (req, res) => {

    const _b = req.body;
    let opts = {};
    if(_b.reference) {
        opts = { reference: _b.reference };
    }
    opts.receiver = req.decoded.college_id;

    Notification
        .find(opts)
        .sort({ timestamp : -1 })
        .lean()
        .limit(_b.limit)
        .then( notifications => {
            res.status(200).json({ success : true, notifications : notifications })
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        });
};

exports.wipe = (req, res) => {

    Notification
        .updateMany({ read : { seen : false }}, { read : { seen : true, seen_at : new Date() }})
        .then(data => {
            res.status(200).json({ success : true, data : data });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        })
}
