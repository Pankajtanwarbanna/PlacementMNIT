let User = require('../models/user');

function ensureAdmin(req, res, next) {
    if(!req.decoded.email) {
        res.json({
            success : false,
            message : 'Please login.'
        })
    } else {
        User.findOne({ email : req.decoded.email }).select('permission').lean().exec(function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(user.permission === 'admin') {
                        next();
                    } else {
                        res.json({
                            success : false,
                            message : 'Insufficient Permission.'
                        })
                    }
                }
            }
        });
    }
}

function ensureStudent(req, res, next) {
    if(!req.decoded.email) {
        res.json({
            success : false,
            message : 'Please login.'
        })
    } else {
        User.findOne({ email : req.decoded.email }).select('permission').lean().exec(function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(user.permission === 'student') {
                        next();
                    } else {
                        res.json({
                            success : false,
                            message : 'Insufficient Permission.'
                        })
                    }
                }
            }
        });
    }
}

module.exports = {
    ensureAdmin,
    ensureStudent
};
