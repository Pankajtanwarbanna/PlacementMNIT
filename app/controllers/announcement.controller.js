let Announcement = require('../models/announcement.model');
let User = require('../models/user.model');

exports.add = (req, res) => {
    const _b = req.body;

    Announcement.create({
        category : _b.category,
        passout_batch : _b.passout_batch,
        author : req.decoded.student_name,
        announcement : _b.announcement,
        timestamp : new Date()
    })
        .then(data => {
            res.status(200).json({ success : true, message : 'Announcement successfully updated.' });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({ success : false, message : 'Something went wrong!'})
        })
};

exports.getAll = async (req, res) => {

    const user = await User.findOne({ college_id : req.decoded.college_id }).select('passout_batch')

    Announcement.find({
        passout_batch : user.passout_batch
    })
        .then(announcements => {
            res.status(200).json({ success : true, announcements : announcements })
        })
        .catch(err => {
            res.status(200).json({ success : false, message : 'Something went wrong!' })
        })
}
