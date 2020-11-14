const Group = require('../models/group.model');

exports.add = (req, res) => {
    const _b = req.body;

    if(!_b.branchCode || !_b.branchName || !_b.programName || !_b.courseDuration || isNaN(_b.courseDuration)) {
        res.status(200).json({ success : false, message : 'Invalid input.'})
    } else {
        Group
            .create({
                branchCode: _b.branchCode,
                branchName : _b.branchName,
                programName :_b.programName,
                courseDuration: _b.courseDuration
            })
            .then(data => {
                res.status(200).json({ success : true, message : 'Group added.'})
            })
            .catch(err => {
                console.error(`[Group][Add] ${err}`);
                res.status(400).json({ success : false, message : 'Something went wrong!' })
            })
    }
};

exports.update = (req, res) => {
    const _b = req.body;

    Group
        .updateOne({ _id : _b._id }, _b)
        .then(data => {
            res.status(200).json({ success : true, message : 'Group successfully updated..' })
        })
        .catch(err => {
            console.error(`[Group][Update] ${err}`);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
};

exports.delete = (req, res) => {

    const _b = req.body;

    Group
        .findOneAndRemove({ _id : _b.groupId })
        .then(data => {
            res.status(200).json({ success : true, message : 'Successfully deleted group.'})
        })
        .catch(err => {
            console.error(`[Group][delete] ${err}`);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
};

exports.getAll = (req, res) => {

    const _b = req.body;

    Group
        .find(opts)
        .then(data => {
            res.status(200).json({ success : true, groups : data })
        })
        .catch(err => {
            console.error(`[Group][getAll] ${err}`);
            res.status(200).json({ success :false, message : 'Something went wrong!' })
        })
}
