/*
    API written by - Pankaj Tanwar
*/
var User = require('../models/user');
var Announcement = require('../models/announcement');
var Feedback = require('../models/feedback');
var Company = require('../models/company');
var Interview = require('../models/interview');
var auth = require('../middlewares/authPermission');
var jwt = require('jsonwebtoken');
var secret = 'placementmnit';
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.PTP_EMAIL,
        pass: process.env.PTP_EMAIL_PASSWORD
    }
});

module.exports = function (router){

    // get all interviews
    router.get('/getAllInterviews', auth.ensureAdmin, function (req, res) {
        Interview.find({ }, function (err, interviews) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                if(!interviews) {
                    res.json({
                        success : false,
                        message : 'Interviews not found.'
                    })
                } else {
                    res.json({
                        success : true,
                        interviews : interviews
                    })
                }
            }
        })
    });

    // change interview experience status
    router.post('/changeStatus/:experience_id', auth.ensureAdmin, function (req, res) {
        Interview.findOne({ _id : req.params.experience_id }).select('status author_id author_name title').exec(function (err, interview) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                if(!interview) {
                    res.json({
                        success : false,
                        message : 'Interview not found.'
                    })
                } else {

                    if(interview.status === 'pending') {
                        interview.status = 'approved';
                        interview.save(function (err) {
                            if(err) {
                                res.json({
                                    success : false,
                                    message : 'Something went wrong!'
                                })
                            } else {
                                var email = {
                                    from: '"Placement & Training Cell" <ptcell@mnit.ac.in>',
                                    to: interview.author_id + '@mnit.ac.in',
                                    subject: 'We published your article ' + interview.title,
                                    text: 'Hello '+ interview.author_name + 'You requested for the reset password.Please find the below link Reset password With Regards, Prof. Mahendar Choudhary',
                                    html: 'Hello <strong>'+ interview.author_name + '</strong>,<br><br>Thanks for sharing your interview process and thoughts with us. We published your interview experience! Please find the link below -<br><br><a href="' + 'http://placements.mnit.ac.in' + "/experience/" + interview._id + '">' + interview.title + ' </a><br><br>With Regards.<br><br>Prof. Mahender Choudhary<br>In-charge, Training & Placement<br>MNIT Jaipur<br>+91-141-2529065'
                                };

                                transporter.sendMail(email, function(err, info){
                                    if (err ){
                                        console.log(err);
                                        res.json({
                                            success : false,
                                            message : 'Email service not working. Status has been changed successfully!'
                                        })
                                    }
                                    else {
                                        console.log('Message sent: ' + info.response);

                                        res.json({
                                            success : true,
                                            message : 'Interview experience approved. Author has been notified!'
                                        });
                                    }
                                });
                            }
                        })
                    } else {
                        interview.status = 'pending';
                        interview.save(function (err) {
                            if(err) {
                                res.json({
                                    success : false,
                                    message : 'Something went wrong!'
                                })
                            } else {
                                res.json({
                                    success : true,
                                    message : 'Interview experience disapproved!'
                                });
                            }
                        })
                    }
                }
            }
        })
    })

    return router;
}
