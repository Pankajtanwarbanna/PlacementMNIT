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

    // post new company to db
    router.post('/postCompanyDetails', auth.ensureAdmin, function (req, res) {

        let company = new Company(req.body);

        company.save(function (err) {
            if(err) {
                console.log(err);
                res.json({
                    success : false,
                    message : 'Error while saving to database.'
                });
            } else {
                res.json({
                    success : true,
                    message : 'Successfully new company added.'
                })
            }
        })
    });

    // update company details
    router.post('/updateCompanyDetails', auth.ensureAdmin, function (req, res) {
        Company.findByIdAndUpdate( { _id : req.body._id } , req.body , function (err) {
            if(err) {
                console.log(err);
                res.json({
                    success : false,
                    message : 'Something went wrong!',
                    error : err
                })
            } else {
                res.json({
                    success : true,
                    message : 'Company Details successfully updated.'
                })
            }
        })
    });

    // delete company
    router.delete('/deleteCompany/:company_id', auth.ensureAdmin, function (req, res) {
        Company.findOneAndRemove({ _id : req.params.company_id}, function (err,data) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error while deleting company.'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Successfully deleted company.'
                })
            }
        })
    });

    // router to get registered candidate students
    router.get('/getRegisteredStudents/:company_id',auth.ensureAdmin, function (req, res) {
        Company.findOne({ _id : req.params.company_id }, function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            }

            if(!company) {
                res.json({
                    success : false,
                    message : 'Company not found.'
                })
            } else {
                // todo implement select & lean()
                res.json({
                    success : true,
                    candidates : company.candidates,
                    name : company.company_name
                })
            }
        })
    });

    // get students details by college_id
    router.get('/getStudentDetailsByCollegeID/:college_id', auth.ensureAdmin, function (req, res) {
        User.findOne({ college_id : req.params.college_id}, function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                });
            }

            if(!user) {
                res.json({
                    success : true,
                    message : 'No user found.'
                })
            } else {
                res.json({
                    success : true,
                    user : user
                })
            }
        })
    });

    // get all registered students
    router.get('/getAllRegisteredStudentsInCompany/:company_id', auth.ensureAdmin, function (req, res) {
        Company.findOne({ _id : req.params.company_id}, function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database side.'
                });
            }

            if(!company) {
                res.json({
                    success : false,
                    message : 'Company Not found.'
                })
            } else {
                res.json({
                    success : true,
                    candidate : company.candidates
                })
            }
        })
    });

    // get feedbacks form database
    router.get('/fetchFeedbacks',  auth.ensureAdmin, function (req, res) {

        Feedback.find({}, function (err, feedbacks) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            }

            if(!feedbacks) {
                res.json({
                    success : false,
                    message : 'No feedbacks found.'
                })
            } else {
                res.json({
                    success : true,
                    feedbacks : feedbacks
                })
            }
        })
    });

    // Delete student from a company
    router.delete('/withdrawRegistration/:college_id/:company_id', auth.ensureAdmin, function (req, res) {
        Company.findOne({ _id : req.params.company_id}, function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database side.'
                })
            }

            if (!company){
                res.json({
                    success : false,
                    message : 'Company not found'
                })
            } else {
                var index = company.candidates.indexOf(company.candidates.find(x => x.college_id === req.params.college_id));
                company.candidates.splice(index,1);

                company.save(function (err) {
                    if(err) {
                        res.json({
                            success : false,
                            message : 'Error from database. '
                        })
                    } else {
                        res.json({
                            success : true,
                            message : 'Successfully withdraw registration'
                        })
                    }
                });
            }
        })
    });

    // router to start attendance
    router.post('/updateAttendanceStatus/:company_id', auth.ensureAdmin, function (req, res) {
        Company.findOne({ _id : req.params.company_id}, function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            }

            if(!company) {
                res.json({
                    success : false,
                    message : 'Company not found.'
                })
            } else {
                if(company.attendance) {
                    company.attendance = false;
                    company.company_otp = '';

                    company.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Database side eror.'
                            })
                        } else {
                            res.json({
                                success : true,
                                message : 'Attendance successfully closed.'
                            })
                        }
                    })
                } else {
                    company.attendance = true;
                    var max = 99999;
                    var min = 10000;
                    company.company_otp = Math.floor(Math.random() * (+max - +min)) + +min;
                    console.log(company.company_otp);

                    company.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Database side error.'
                            })
                        } else {
                            res.json({
                                success : true,
                                message : 'Attendance successfully started.'
                            })
                        }
                    })
                }
            }
        })

    });

    // done with the test router
    router.post('/doneWithAttendance/:company_id', auth.ensureAdmin, function (req, res) {
        Company.findOne({ _id : req.params.company_id }, function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database side.'
                })
            }

            if(!company) {
                res.json({
                    success : false,
                    message : 'Company not found.'
                })
            } else {
                for(var i=0;i< company.candidates.length;i++) {
                    if(company.candidates[i].candidate_status === 'Applied') {
                        company.candidates[i].candidate_status = 'Absent';
                        console.log(company.candidates[i].college_id);
                    }
                }

                company.attendance = false;

                company.save(function (err) {
                    if(err) {
                        res.json({
                            success : false,
                            message : 'Error from database.'
                        });
                    } else {
                        res.json({
                            success : true,
                            message : 'Updated successfully.'
                        });
                    }
                });
            }
        })
    });


    // Post new announcement
    router.post('/postAnnouncement', auth.ensureAdmin, function (req, res) {

        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            var announcement  = new Announcement();

            announcement.category = req.body.category;
            announcement.announcement = req.body.announcement;
            announcement.timestamp = new Date();

            announcement.save(function (err) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while saving data to database.'
                    });
                } else {
                    res.json({
                        success : true,
                        message : 'Announcement successfully updated.'
                    });
                }
            })
        }
    });

    // Get student Profile
    router.get('/searchByID/:studentID', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.params.studentID }, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from database side.'
                    })
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'College ID is incorrect!'
                    })
                } else {
                    res.json({
                        success : true,
                        user : user
                    })
                }
            })
        }
    });

    // update user profile
    router.put('/updateStudentProfile', auth.ensureAdmin, function (req, res) {
        User.findOne({ college_id : req.body.college_id }, function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            }

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                })
            } else {

                if(req.body.student_name) {
                    user.student_name = req.body.student_name;
                }
                if(req.body.degree) {
                    user.degree = req.body.degree;
                }
                if(req.body.department) {
                    user.department = req.body.department;
                }
                if(req.body.alternate_email) {
                    user.alternate_email = req.body.alternate_email;
                }
                if(req.body.contact_no) {
                    user.contact_no = req.body.contact_no;
                }
                if(req.body.cgpa) {
                    user.cgpa = req.body.cgpa;
                }
                if(req.body.red_flags == 0 || req.body.red_flags) {
                    user.red_flags = req.body.red_flags;
                }
                if(req.body.matric_marks) {
                    user.matric_marks = req.body.matric_marks;
                }
                if(req.body.matric_board) {
                    user.matric_board = req.body.matric_board;
                }
                if(req.body.senior_marks) {
                    user.senior_marks = req.body.senior_marks;
                }
                if(req.body.senior_board) {
                    user.senior_board = req.body.senior_board;
                }
                if(req.body.alternate_contact_no) {
                    user.alternate_contact_no = req.body.alternate_contact_no;
                }
                if(req.body.address) {
                    user.address = req.body.address;
                }
                if(req.body.city) {
                    user.city = req.body.city;
                }
                if(req.body.post_code) {
                    user.post_code = req.body.post_code;
                }
                if(req.body.state) {
                    user.state = req.body.state;
                }
                if(req.body.country) {
                    user.country = req.body.country;
                }
                if(req.body.linkedln_link) {
                    user.linkedln_link = req.body.linkedln_link;
                }

                user.save(function (err) {
                    if(err) {
                        console.log(err);
                        res.json({
                            success : false,
                            message : 'Error while saving to database.'
                        })
                    } else {
                        res.json({
                            success : true,
                            message : 'Profile Successfully updated.'
                        })
                    }
                })
            }
        })

    });

    // update admin's passout batch
    router.post('/updateAdminBatch/:batch', auth.ensureAdmin, function (req, res) {

        User.findOneAndUpdate( { college_id : req.decoded.college_id },{ $set : { passout_batch : req.params.batch }}, function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Batch updated.'
                })
            }
        })
    });

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
