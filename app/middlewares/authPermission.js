let User = require('../models/user');

function ensureAdmin(req, res, next) {
    if(!req.decoded.college_id ) {
        res.json({
            success : false,
            message : 'Please login.'
        })
    } else {
        User.findOne({ college_id : req.decoded.college_id }).select('permission').lean().exec(function (err, user) {
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
                            message : 'Insufficient Permission. Only Admin is allowed.'
                        })
                    }
                }
            }
        });
    }
}

// Only allows Admin & Faculty Coordinators
function ensureAdminOrFaculty(req, res, next) {
    if(!req.decoded.college_id ) {
        res.json({
            success : false,
            message : 'Please login.'
        })
    } else {
        User.findOne({ college_id : req.decoded.college_id }).select('permission').lean().exec(function (err, user) {
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
                    if(user.permission === 'admin' || user.permission === 'faculty-coordinator') {
                        next();
                    } else {
                        res.json({
                            success : false,
                            message : 'Insufficient Permission. Only Faculty Coordinator is allowed.'
                        })
                    }
                }
            }
        });
    }
}

// This will check if user is Admin/Faculty Coordinator/SPC
function ensureOfficialPlacementTeam(req, res, next) {
    if(!req.decoded.college_id ) {
        res.json({
            success : false,
            message : 'Please login.'
        })
    } else {
        User.findOne({ college_id : req.decoded.college_id }).select('permission').lean().exec(function (err, user) {
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
                    if(user.permission === 'admin' || user.permission === 'spc' || user.permission === 'faculty-coordinator') {
                        next();
                    } else {
                        res.json({
                            success : false,
                            message : 'Insufficient Permission. Only official Placement Team is allowed.'
                        })
                    }
                }
            }
        });
    }
}

function ensureStudent(req, res, next) {
    if(!req.decoded.college_id) {
        res.json({
            success : false,
            message : 'Please login.'
        })
    } else {
        User.findOne({ college_id : req.decoded.college_id }).select('permission').lean().exec(function (err, user) {
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
                            message : 'Insufficient Permission. Only Student allowed.'
                        })
                    }
                }
            }
        });
    }
}

function ensureLoggedIn(req, res, next) {
    if(!req.decoded.college_id) {
        res.json({
            success : false,
            message : 'Please login.'
        })
    } else {
        next();
    }
}

module.exports = {
    ensureAdmin,
    ensureStudent,
    ensureOfficialPlacementTeam,
    ensureAdminOrFaculty,
    ensureLoggedIn
};
