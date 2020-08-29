/*
    API written by - Pankaj Tanwar
*/
let User = require('../models/user');
let Announcement = require('../models/announcement');
let Feedback = require('../models/feedback');
let Company = require('../models/company');
let Interview = require('../models/interview');
let auth = require('../middlewares/authPermission');
let mongoose = require('mongoose');
let nodemailer = require('nodemailer');
let zip = require('express-zip');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.PTP_EMAIL,
        pass: process.env.PTP_EMAIL_PASSWORD
    }
});

module.exports = function (router){

    // post new company to db
    router.post('/postCompanyDetails', auth.ensureOfficialPlacementTeam, function (req, res) {

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
    router.post('/updateCompanyDetails', auth.ensureOfficialPlacementTeam, function (req, res) {
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
    router.delete('/deleteCompany/:company_id', auth.ensureAdminOrFaculty, function (req, res) {
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
    router.get('/getRegisteredStudents/:company_id',auth.ensureOfficialPlacementTeam, function (req, res) {

        Company.aggregate([
            {
                // Document matching Company ID
                $match : {
                    _id : mongoose.Types.ObjectId(req.params.company_id)
                }
            },
            {
                // Lookup
                $lookup: {
                    from : "users",
                    localField: "candidates.college_id",
                    foreignField : "college_id",
                    as : "registered_candidates"
                }
            },
            {
                // To Select Particular Fields
                $project : {
                    "company_name" : 1,
                    "registered_candidates.student_name" : 1,
                    "registered_candidates.college_id" : 1,
                    "registered_candidates.alternate_contact_no" : 1,
                    "registered_candidates.college_email" : 1,
                    "registered_candidates.program" : 1,
                    "registered_candidates.degree" : 1,
                    "registered_candidates.department" : 1,
                    "registered_candidates.cgpa" : 1,
                    "registered_candidates.matric_marks" : 1,
                    "registered_candidates.senior_marks" : 1,
                    "registered_candidates.resume_url" : 1
                }
            }
        ]).exec( function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            } else if(!company) {
                res.json({
                    success : false,
                    message : 'Company not found.'
                })
            } else {
                res.json({
                    success : true,
                    // $lookup give result in array format
                    company : company[0]
                })
            }
        })
    });

    // Export Resumes of Registered Students
    router.get('/exportResumesOfRegisteredStudents/:company_id' , auth.ensureOfficialPlacementTeam, function (req, res) {

        Company.aggregate([
            {
                // Document matching Company ID
                $match : {
                    _id : mongoose.Types.ObjectId(req.params.company_id)
                }
            },
            {
                // Lookup
                $lookup: {
                    from : "users",
                    localField: "candidates.college_id",
                    foreignField : "college_id",
                    as : "registered_candidates"
                }
            },
            {
                // To Select Particular Fields
                $project : {
                    "company_name" : 1,
                    "registered_candidates.resume_url" : 1,
                    "registered_candidates.student_name" : 1,
                    "registered_candidates.college_id" : 1
                }
            }
        ]).exec( function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            } else if(!company) {
                res.json({
                    success : false,
                    message : 'Company not found.'
                })
            } else {

                let files = [];

                company[0].registered_candidates.forEach(function (student) {
                    let data = {};

                    // todo Check if file exists
                    data.name = student.student_name.split(' ').join('_') + '_' + student.college_id + '.pdf';
                    data.path = __basedir + '/public/assets/uploads/resumes/' + student.resume_url;

                    files.push(data);
                });

                console.log(files);


                res.zip(files, 'nodejs-zip-files.zip', function (err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        })
    });

    // get feedbacks form database
    router.get('/fetchFeedbacks',  auth.ensureAdmin, function (req, res) {

        Feedback.find({}).select('title feedback author_name author_email timestamp').lean().exec( function (err, feedbacks) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            } else if(!feedbacks) {
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
    router.delete('/withdrawRegistration/:college_id/:company_id', auth.ensureOfficialPlacementTeam, function (req, res) {
        Company.findOne({ _id : req.params.company_id}).select('candidates').exec( function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database side.'
                })
            } else if (!company){
                res.json({
                    success : false,
                    message : 'Company not found'
                })
            } else {
                // Find Index of Student
                let studentIndex = company.candidates.indexOf(company.candidates.find(function (candidate) {
                    return candidate.college_id === req.params.college_id;
                }));

                // Remove User.
                // todo If User Is Not There?
                company.candidates.splice(studentIndex,1);

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
    router.post('/updateAttendanceStatus/:company_id', auth.ensureOfficialPlacementTeam, function (req, res) {
        Company.findOne({ _id : req.params.company_id}).select('attendance company_otp').exec( function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            } else if(!company) {
                res.json({
                    success : false,
                    message : 'Company not found.'
                })
            } else {
                // If Attendance Already Open
                if(company.attendance) {
                    company.attendance = false;
                    company.company_otp = '';

                    company.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Database side error.'
                            })
                        } else {
                            res.json({
                                success : true,
                                message : 'Attendance successfully closed.'
                            })
                        }
                    })
                } else {
                    // If Attendance Closed then start Attendance
                    company.attendance = true;
                    let max = 99999;
                    let min = 10000;
                    // Generating Random OTP
                    company.company_otp = Math.floor(Math.random() * (+max - +min)) + +min;

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
    router.post('/doneWithAttendance/:company_id', auth.ensureOfficialPlacementTeam, function (req, res) {
        Company.findOne({ _id : req.params.company_id }).select('candidates attendance').exec( function (err, company) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database side.'
                })
            } else if(!company) {
                res.json({
                    success : false,
                    message : 'Company not found.'
                })
            } else {
                // todo Make it more Efficient
                for(let i=0;i< company.candidates.length;i++) {
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
    router.post('/postAnnouncement', auth.ensureOfficialPlacementTeam, function (req, res) {

        let announcement = new Announcement({
            category : req.body.category,
            passout_batch : req.body.passout_batch,
            author : req.decoded.student_name,
            announcement : req.body.announcement,
            timestamp : new Date()
        });

        announcement.save(function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error while this saving data to database.'
                });
            } else {
                res.json({
                    success : true,
                    message : 'Announcement successfully updated.'
                });
            }
        })
    });

    // Get student Profile
    router.get('/searchByID/:studentID',auth.ensureOfficialPlacementTeam, function (req, res) {
        // todo select restrictions
        User.findOne({ college_id : req.params.studentID }, function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database side.'
                })
            } else if(!user) {
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
    });

    // update user profile
    router.put('/updateStudentProfile', auth.ensureOfficialPlacementTeam, function (req, res) {
        // Todo Red Flags
        User.findOne({ college_id : req.body.college_id }, function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error from database.'
                })
            } else if(!user) {
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

    // update placement team passout batch
    router.post('/updateAdminBatch/:batch', auth.ensureOfficialPlacementTeam, function (req, res) {

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
    router.get('/getAllInterviews', auth.ensureOfficialPlacementTeam, function (req, res) {

        // Todo select and Lean
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
    router.post('/changeStatus/:experience_id', auth.ensureOfficialPlacementTeam, function (req, res) {

        // Todo Email Service Notify.js
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
                                let email = {
                                    from: '"Placement & Training Cell" <ptcell@mnit.ac.in>',
                                    to: interview.author_id + '@mnit.ac.in',
                                    subject: 'Yay! We have published your article ' + interview.title,
                                    text: 'Hello '+ interview.author_name + 'Thanks for sharing your interview process and thoughts with us With Regards, Prof. Mahendar Choudhary',
                                    html: 'Hello <strong>'+ interview.author_name + '</strong>,<br><br>Thanks for sharing your interview process and thoughts with us to help others. We have published your interview experience after a few modifications. We wish you luck for the future! Please find the link below -<br><br><a href="' + 'http://placements.mnit.ac.in' + "/experience/" + interview._id + '">' + interview.title + ' </a><br><br>With Regards.<br><br>Prof. Mahender Choudhary<br>In-charge, Training & Placement<br>MNIT Jaipur<br>+91-141-2529065'
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
    });

    // edit interview experience
    router.post('/editInterviewExperience', auth.ensureOfficialPlacementTeam, function (req, res) {
        Interview.findByIdAndUpdate( { _id : req.body._id } , req.body , function (err) {
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
                    message : 'Interview Experience successfully updated.'
                })
            }
        })
    });

    // Add New Coordinator
    router.post('/addCoordinator', auth.ensureAdminOrFaculty, function (req, res) {

        // Checking Valid College Email ID
        if(req.body.college_email.toLowerCase().split("@")[1] !== 'mnit.ac.in') {
            res.json({
                success : false,
                message : 'Invalid College Email ID.'
            })
        } else {
            let coordinator = new User({
                student_name : req.body.name.toUpperCase(),
                college_email: req.body.college_email.toLowerCase(),
                college_id : req.body.college_email.toUpperCase().split("@")[0] + '-PTP',
                permission : req.body.permission,
                passout_batch: req.body.passout_batch,
                alternate_contact_no : req.body.alternate_contact_no,
                password : req.body.alternate_contact_no,
                degree : 'N/A',
                department : 'N/A',
                program : 'N/A',
                cgpa : 'N/A',
                contact_no : req.body.alternate_contact_no,
                alternate_email : 'N/A',
                address : 'MNIT Jaipur',
                city : 'Jaipur',
                state : 'Rajasthan',
                post_code : '302017',
                country : 'India',
                linkedln_link : 'N/A',
                matric_marks : 'N/A',
                matric_board : 'N/A',
                senior_marks : 'N/A',
                senior_board : 'N/A'
            });

            // Save Data
            coordinator.save(function (err) {
                if(err) {
                    console.log(err);
                    res.json({
                        success : false,
                        message : 'Something went wrong! Looks like Coordinator is already added.'
                    })
                } else {
                    res.json({
                        success : true,
                        message : 'Coordinator successfully added.'
                    })
                }
            })
        }
    });

    // get Placement Cell Coordinators from DB
    router.get('/getAllCoordinators', auth.ensureOfficialPlacementTeam, function (req, res) {

        User.find({ permission : { $in : ['spc', 'faculty-coordinator']} }).select('student_name college_id college_email alternate_contact_no permission').lean().exec(function (err, coordinators) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else if(!coordinators) {
                res.json({
                    success : false,
                    message : 'Coordinators not found.'
                })
            } else {
                res.json({
                    success : true,
                    coordinators : coordinators
                })
            }
        })
    });

    return router;
};
