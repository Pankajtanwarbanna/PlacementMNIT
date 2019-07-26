/*
    API written by - Pankaj Tanwar
*/
var User = require('../models/user');
var Schedule = require('../models/schedule');
var Announcement = require('../models/announcement');
var Feedback = require('../models/feedback');
var Company = require('../models/company');
var jwt = require('jsonwebtoken');
var secret = 'placementmnit';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ptcell@mnit.ac.in',
        pass: 'ptcell2020'
    }
});
const fs = require('fs');

module.exports = function (router){

    // Nodemailer-sandgrid stuff
    var options = {
        auth: {
            api_key: 'YOUR_API_KEY'
        }
    };

    var client = nodemailer.createTransport(sgTransport(options));

/*    // User register API
    router.post('/register',function (req, res) {
        var user = new User();

        console.log(req.body);

        user.student_name = 'PANKAJ TANWAR';
        user.college_id = '2016UCP1381';
        user.program = 'UG';
        user.gender = 'M';
        user.student_name = 'PANKAJ TANWAR';
        user.contact_no = '7740996673';
        user.college_email = '2016ucp1381@mnit.ac.in';
        user.alternate_email = 'pankajtanwar510@gmail.com';
        user.degree = 'B.Tech';
        user.department = 'COMPUTER SCIENCE & ENGG.';
        user.status = 'active';
        user.cgpa = '6.91';

        user.password = 'pankaj';
        user.temporarytoken = jwt.sign({ student_name : user.student_name , college_id : user.college_id }, secret);

        //console.log(req.body);
        if(!user.student_name || !user.college_id || !user.password) {
            res.json({
                success : false,
                message : 'Ensure you filled all entries!'
            });
        } else {
            user.save(function(err) {
                if(err) {
                    if(err.errors != null) {
                        // validation errors
                        if(err.errors.name) {
                            res.json({
                                success: false,
                                message: err.errors.name.message
                            });
                        } else if(err.errors.password) {
                            res.json({
                                success : false,
                                message : err.errors.password.message
                            });
                        } else {
                            res.json({
                                success : false,
                                message : err
                            });
                        }
                    } else {
                        // duplication errors
                        if(err.code === 11000) {
                            console.log(err.errmsg);
                            console.log(err.errmsg[57]);
                            console.log(err.errmsg[58]);
                            if(err.errmsg[66] === 'c') {
                                res.json({
                                    success: false,
                                    message: 'College ID is already registered.'
                                });
                            } else {
                                res.json({
                                    success : false,
                                    message : err
                                });
                            }
                        } else {
                            res.json({
                                success: false,
                                message: err
                            })
                        }
                    }
                } else {

                    var email = {
                        from: 'Placement Portal Registration, placements@mnit.ac.in',
                        to: user.college_id + '@mnit.ac.in',
                        subject: 'Activation Link - Placement Portal Registration',
                        text: 'Hello '+ user.name + 'Thank you for registering with placement portal.Please find the below activation link Activation link Thank you Placement & Training Cell, MNIT Jaipur',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>Thank you for registering with placement portal. Please find the below activation link<br><br><a href="http://localhost:8080/activate/'+ user.temporarytoken+'">Activation link</a><br><br>Thank you<br>Placement & Training Cell<br>MNIT Jaipur'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                            res.json({
                                success : false,
                                message : 'Account registered but activation link was not send.(Issue with Email service - Contact Developer)'
                            });
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                            res.json({
                                success : true,
                                message : 'Account registered! Please check your E-mail inbox for the activation link.'
                            });
                        }
                    });
                }
            });
        }
    });*/

    // User login API
    router.post('/authenticate', function (req,res) {

        if(!req.body.college_id || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you filled all the entries.'
            });
        } else {

            User.findOne({ college_id : (req.body.college_id).toUpperCase() }).select('college_id name password active').exec(function (err, user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else if(user) {

                    if(!user.active) {
                        res.json({
                            success : false,
                            message : 'Account is not activated yet.Please check your email for activation link.',
                            expired : true
                        });
                    } else {

                        var validPassword = user.comparePassword(req.body.password);

                        if (validPassword) {
                            var token = jwt.sign({
                                college_id : user.college_id,
                                student_name: user.student_name
                            }, secret);
                            res.json({
                                success: true,
                                message: 'User authenticated.',
                                token: token
                            });
                        } else {
                            res.json({
                                success: false,
                                message: 'Incorrect password. Please try again.'
                            });
                        }
                    }
                }
            });
        }

    });

    // Send link to email id for reset password
    router.put('/forgotPasswordLink', function (req,res) {

        if(!req.body.college_id) {
            res.json({
                success : false,
                message : 'Please ensure you filled the entries.'
            });
        } else {

            User.findOne({ college_id : (req.body.college_id).toUpperCase() }).select('college_id college_email temporarytoken student_name').exec(function (err,user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Username not found.'
                    });
                } else {

                    console.log(user.temporarytoken);

                    user.temporarytoken = jwt.sign({
                        student_name: user.student_name,
                        college_id: user.college_id
                    }, secret);

                    console.log(user.temporarytoken);

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error accured! Please try again. '
                            })
                        } else {

                            var email = {
                                from: '"Placement & Training Cell" <ptcell@mnit.ac.in>',
                                to: user.college_email,
                                subject: 'Reset Password Request : Placemet Cell, MNIT Jaipur',
                                text: 'Hello '+ user.student_name + 'You requested for the reset password.Please find the below link Reset password With Regards, Prof. Mahendar Choudhary',
                                html: 'Hello <strong>'+ user.student_name + '</strong>,<br><br>You requested for the reset password. Please find the below link<br><br><a href="' +req.body.hostname + "/forgotPassword/" + user.temporarytoken + '">Reset password</a><br><br>With Regards.<br><br>Prof. Mahender Choudhary<br>In-charge, Training & Placement<br>MNIT Jaipur<br>+91-141-2529065'
                            };

                            transporter.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                    res.json({
                                        success : false,
                                        message : 'Email service not working. Contact Admin.'
                                    })
                                }
                                else {
                                    console.log('Message sent: ' + info.response);

                                    res.json({
                                        success : true,
                                        message : 'Link to reset your password has been sent to your registered email.'
                                    });
                                }
                            });
                        }
                    });

                }

            })

        }
    });

    // router to change password
    router.post('/forgotPassword/:token', function (req,res) {

        if(!req.params.token) {
            res.json({
                success : false,
                message : 'No token provied.'
            });
        } else {

            User.findOne({ temporarytoken : req.params.token }).select('college_id temporarytoken').exec(function (err,user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Link has been expired.'
                    });
                } else {
                    res.json({
                        success : true,
                        user : user
                    });
                }
            });
        }
    });

    // route to reset password
    router.put('/resetPassword/:token', function (req,res) {

        if(!req.body.password) {
            res.json({
                success : false,
                message : 'New password is missing.'
            })
        } else {

            User.findOne({ temporarytoken : req.params.token }).select('student_name password').exec(function (err,user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Link has been expired.'
                    })
                } else {

                    user.password = req.body.password;
                    user.temporarytoken = false;

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Password must have one lowercase, one uppercase, one special character, one number and minimum 8 and maximum 25 character.'
                            });
                        } else {

                            res.json({
                                success : true,
                                message : 'Password has been changed successfully.'
                            })
                        }
                    })
                }
            })
        }
    });

    // Middleware to verify token
    router.use(function (req,res,next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            // verify token
            jwt.verify(token, secret, function (err,decoded) {
                if (err) {
                    res.json({
                        success : false,
                        message : 'Token invalid.'
                    })
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            res.json({
                success : false,
                message : 'No token provided.'
            });
        }
    });

    // API User profile
    router.post('/me', function (req,res) {

        //console.log(req.decoded.email);
        // getting profile of user from database using email, saved in the token in localStorage
        User.findOne({ college_id : req.decoded.college_id }).select('college_id student_name gender department').exec(function (err, user) {
            if(err) throw err;

            if(!user) {
                res.status(500).send('User not found.');
            } else {
                res.send(user);
            }
        });
    });

    // get permission of user
    router.get('/permission', function (req,res) {

        User.findOne({ college_id : req.decoded.college_id }).select('permission').exec(function (err,user) {

            if(err) throw err;

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                })
            } else {
                res.json({
                    success : true,
                    permission : user.permission
                })
            }
        })
    });

    // Schedule Company
    router.post('/scheduleCompany', function (req, res) {

        User.findOne({ college_id : req.decoded.college_id }).select('permission').exec(function (err, user) {
            if(err) throw err;

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                if(user.permission !== 'admin') {
                    res.json({
                        success : false,
                        message : 'You are not authorized.'
                    })
                } else {
                    if(!req.body.title || !req.body.start || !req.body.end) {
                        res.json({
                            success : false,
                            message : 'Please ensure you fill all the entries.'
                        })
                    } else {
                        let schedule = new Schedule();

                        schedule.title = req.body.title;
                        schedule.start = req.body.start;
                        schedule.end = req.body.end;

                        schedule.save(function (err) {
                            if(err) {
                                res.json({
                                    success : false,
                                    message : 'Error while saving data to database.'
                                });
                            } else {
                                res.json({
                                    success : true,
                                    message : 'Event successfully created.'
                                })
                            }
                        })
                    }
                }
            }
        })
    });

    // get schedules of all companies
    router.get('/getSchedule', function (req, res) {

        Schedule.find({}).select('title start end').exec(function (err, schedule) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Error while getting schedule data'
                });
            }

            if(!schedule) {
                res.json({
                    success : false,
                    message : 'No schedule found.'
                });
            } else {

                fs.writeFile('./public/events/events.json', JSON.stringify(schedule), function (err) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.json({
                            success : true,
                            schedule : schedule
                        })
                    }
                });
            }
        })
    });

    // Post new announcement
    router.post('/postAnnouncement', function (req, res) {

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

    // get all announcements
    router.get('/getAnnouncements', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            Announcement.find({ }, function (err, announcements) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while getting data.'
                    })
                }

                if(!announcements) {
                    res.json({
                        success : false,
                        message : 'Announcements not found.'
                    })
                } else {
                    res.json({
                        success : true,
                        announcements : announcements
                    })
                }
            })
        }
    });

    // post new company to db
    router.post('/postCompanyDetails', function (req, res) {

        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {

            var company = new Company();

            company.eligibility = req.body.eligibility;

            company.company_name = req.body.company_name;
            company.company_website_url = req.body.company_website_url;
            company.about_company = req.body.about_company;

            company.job_profile = req.body.job_profile;
            company.posting_location = req.body.posting_location;
            company.recruitment = req.body.recruitment;
            company.duration = req.body.duration;
            company.package = req.body.package;
            company.other_facility = req.body.other_facility;

            company.min_cgpa = req.body.min_cgpa;
            company.min_10_percent = req.body.min_10_percent;
            company.min_12_percent = req.body.min_12_percent;
            company.other_eligibility = req.body.other_eligibility;

            company.deadline_date = req.body.deadline_date;
            company.timestamp = new Date();

            company.save(function (err) {
                if(err) {
                    console.log(err);
                    res.json({
                        success : false,
                        message : 'Error while saving to database.'
                    });
                } else {
                    console.log('success.')
                    res.json({
                        success : true,
                        message : 'Successfully new company added.'
                    })
                }
            })

        }
    });

    // get companies details from db
    router.get('/getAllUpcomingCompanies', function (req, res) {

        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            // todo Add here validation according to branch, cgpa etc
            Company.find({ deadline_date : { $gte: new Date() -1 }}).select('company_name job_profile package deadline_date').exec(function (err, companies) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while getting data from database.'
                    });
                }

                if(!companies) {
                    res.json({
                        success : false,
                        message : 'Companies not found.'
                    });
                } else {
                    res.json({
                        success : true,
                        companies : companies
                    })
                }
            })
        }
    });

    // get previous companies details from db
    router.get('/getAllPreviousCompanies', function (req, res) {

        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            // todo Add here validation according to branch, cgpa etc

            Company.find({ deadline_date : { $lt: new Date() }}).select('company_name job_profile package deadline_date').exec(function (err, companies) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while getting data from database.'
                    });
                }

                if(!companies) {
                    res.json({
                        success : false,
                        message : 'Companies not found.'
                    });
                } else {
                    res.json({
                        success : true,
                        companies : companies
                    })
                }
            })
        }
    });

    // get company details
    router.get('/getCompanyDetails/:company_id', function (req, res) {

        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            Company.findOne({ _id : req.params.company_id}, function (err, companyDetail) {
                if(err) {
                    console.log(err);
                    res.json({
                        success : false,
                        message : 'Error while getting data from database.'
                    });
                }

                if(!companyDetail) {
                    res.json({
                        success : false,
                        message : 'Company not found.'
                    });
                } else {
                    res.json({
                        success : true,
                        companyDetail : companyDetail
                    })
                }
            })

        }
    });

    // get candidate apply status in company
    router.get('/getCandidateApplyStatus/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            Company.findOne({ _id : req.params.company_id}, function (err, company) {
                if(err) {
                    console.log(err);
                    res.json({
                        success : false,
                        message : 'Database error.'
                    });
                }
                // No candidate registered till now
                if(!company) {
                    res.json({
                        success : false,
                        message : 'Not applied.'
                    });
                } else {
                    console.log(company.candidates);

                    if(company.candidates.find(candidate => candidate.college_id === req.decoded.college_id)) {
                        res.json({
                            success : true,
                            message : 'Applied.'
                        });
                    } else {
                        res.json({
                            success : false,
                            message : 'Not applied.'
                        })
                    }
                }
            })
        }
    });

    // register in a company by student
    router.post('/oneClickApply/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            Company.findOne({ _id : req.params.company_id }, function (err, company) {
                if(err) {
                    console.log(err);
                    res.json({
                        success : false,
                        message : 'Database error.'
                    });
                }

                if(!company) {
                    // Company not found
                    res.json({
                        success : false,
                        message : 'Company not found.'
                    })
                } else {
                    // todo Check deadline date
                    // todo check eligibility criteria
                    company.candidates.push({college_id : req.decoded.college_id, timestamp : new Date()});

                    company.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Database error.'
                            });
                        } else {
                            res.json({
                                success : true,
                                message : 'Successfully applied.'
                            });
                        }
                    })
                }
            })
        }
    });

    // get user timeline
    router.get('/getTimeline', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            Company.find({  }, function (err, companyData) {
                if(err) {
                    console.log(err);
                    res.json({
                        success : false,
                        message : 'Database error.'
                    })
                }

                if(!companyData) {
                    res.json({
                        success : false,
                        message : 'Company not found.'
                    });
                } else {

                    let candidateTimeline = [];

                    // Used Let for scope purpose
                    for(let i=0; i < companyData.length; i++) {
                        if(companyData[i].candidates.find(obj => obj.college_id === req.decoded.college_id)) {

                            let candidateTimelineObj = {};

                            candidateTimelineObj.company_name = companyData[i].company_name;
                            // todo company coming to MNIT date
                            candidateTimelineObj.company_date = companyData[i].deadline_date;
                            //console.log(candidatesData);
                            candidateTimelineObj.timestamp = (companyData[i].candidates.find(obj => obj.college_id === req.decoded.college_id)).timestamp;
                            candidateTimelineObj.status = (companyData[i].candidates.find(obj => obj.college_id === req.decoded.college_id)).candidate_status;

                            candidateTimeline.push(candidateTimelineObj);
                            console.log(candidateTimeline)
                        }
                    }

                    console.log(candidateTimeline);
                    res.json({
                        success : true,
                        candidateTimeline : candidateTimeline
                    })

                }
            })
        }
    });

    // delete company
    router.delete('/deleteCompany/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from the database side.'
                    });
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(user.permission === 'admin') {
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
                    } else {
                        res.json({
                            success :  false,
                            message : 'User not authorized.'
                        })
                    }
                }
            })
        }
    });

    // router to get registered candidate students
    router.get('/getRegisteredStudents/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from the database side.'
                    });
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(user.permission === 'admin') {
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
                                res.json({
                                    success : true,
                                    candidates : company.candidates,
                                    name : company.company_name
                                })
                            }
                        })
                    } else {
                        res.json({
                            success :  false,
                            message : 'User not authorized.'
                        })
                    }
                }
            })
        }
    });

    // get students details by college_id
    router.get('/getStudentDetailsByCollegeID/:college_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from the database side.'
                    });
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(user.permission === 'admin') {
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
                    } else {
                        res.json({
                            success :  false,
                            message : 'User not authorized.'
                        })
                    }
                }
            })
        }
    });

    router.post('/addCompanySchedule/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while getting data from database.'
                    });
                }
                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    if(user.permission === 'admin') {
                        Company.findOne({ _id : req.params.company_id }, function (err, company) {
                            if(err) {
                                res.json({
                                    success : false,
                                    message : 'Error while getting data from database.'
                                });
                            }

                            if(!company) {
                                res.json({
                                    success : false,
                                    message : 'Company Not found.'
                                })
                            } else {
                                var scheduleObj = {};
                                scheduleObj.date_time = req.body.date_time;
                                scheduleObj.schedule_info = req.body.schedule_info;
                                scheduleObj.timestamp = new Date();

                                company.company_schedule.push(scheduleObj);

                                company.save(function (err) {
                                    if(err) {
                                        res.json({
                                            success : false,
                                            message : 'Error from database.'
                                        });
                                    } else {
                                        res.json({
                                            success : true,
                                            message : 'Schedule successfully posted.'
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    });

    router.post('/addCompanyNotification/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while getting data from database.'
                    });
                }
                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    if(user.permission === 'admin') {
                        Company.findOne({ _id : req.params.company_id }, function (err, company) {
                            if(err) {
                                res.json({
                                    success : false,
                                    message : 'Error while getting data from database.'
                                });
                            }

                            if(!company) {
                                res.json({
                                    success : false,
                                    message : 'Company Not found.'
                                })
                            } else {
                                var notificationObj = {};
                                notificationObj.notification = req.body.notification;
                                notificationObj.timestamp = new Date();

                                company.company_notifications.push(notificationObj);

                                company.save(function (err) {
                                    if(err) {
                                        res.json({
                                            success : false,
                                            message : 'Error from database.'
                                        });
                                    } else {
                                        res.json({
                                            success : true,
                                            message : 'Notification successfully posted.'
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    });

    router.get('/getCompanySchedule/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while getting data from database.'
                    });
                }
                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    Company.findOne({ _id : req.params.company_id }, function (err, company) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error while getting data from database.'
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
                                schedule : company.company_schedule
                            })
                        }
                    })
                }
            })
        }
    });

    router.get('/getCompanyNotifications/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error while getting data from database.'
                    });
                }
                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    Company.findOne({ _id : req.params.company_id }, function (err, company) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error while getting data from database.'
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
                                notifications : company.company_notifications
                            })
                        }
                    })
                }
            })
        }
    });

    router.get('/getAllRegisteredStudentsInCompany/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err,user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from database side.'
                    });
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(user.permission === 'admin') {
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
                    }
                }
            })
        }
    });

    // post company result
    router.post('/addCompanyResult/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err,user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from database side.'
                    });
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    if(user.permission === 'admin') {
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

                                var companyResultObj = {};

                                companyResultObj.result_title = req.body.result_title;
                                companyResultObj.result_message = req.body.result_message;
                                companyResultObj.candidates = req.body.candidates;
                                companyResultObj.result_stage = company.company_result.length + 1;
                                companyResultObj.timestamp = new Date();

                                //console.log(companyResultObj);

                                company.company_result.push(companyResultObj);

                                company.save(function (err) {
                                    if(err) {
                                        res.json({
                                            success : false,
                                            message : 'Database error.'
                                        })
                                    } else {
                                        res.json({
                                            success : true,
                                            message : 'Successfully result posted.'
                                        })
                                    }
                                });
                            }
                        })
                    }
                }
            })
        }
    })

    // get company result
    router.get('/getCompanyResult/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err,user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from database side.'
                    });
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
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
                                result : company.company_result
                            })
                        }
                    })
                }
            })
        }
    })

    // get user profile details
    router.get('/getUserProfile', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login'
            })
        } else {
            User.findOne({ college_id : req.decoded.college_id}, function (err, user) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Database error'
                    })
                }

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    })
                } else {
                    res.json({
                        success : true,
                        profile : user
                    })
                }
            })
        }
    })

	// update user profile
	router.put('/updateProfile', function (req, res) {
		if(!req.decoded.college_id) {
		    res.json({
		        success : false,
		        message : 'Please login.'
		    })
		} else {
		    User.findOne({ college_id : req.decoded.college_id }, function (err, user) {
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
		}
	})

	// check profile is complete or not
	router.get('/checkCompleteProfile', function (req, res) {
	   if(!req.decoded.college_id) {
		   res.json({
		       success : false,
		       message : 'Please login.'
		   })
	   } else {
		   User.findOne({ college_id : req.decoded.college_id }, function (err, user) {
		       if(err) {
		           res.json({
		               success : false,
		               message : 'Error from database.'
		           })
		       }
		      
		       if(!user) {
		           res.json({
		               success : false,
		               message : 'User not found'
		           })
		       } else {
		           if(!user.matric_marks || !user.matric_board || !user.senior_marks || !user.senior_board || !user.alternate_contact_no || !user.address || !user.city || !user.post_code || !user.state || !user.country || !user.linkedln_link ) {
		               res.json({
		                   success : false,
		                   message : 'Profile fields missing'
		               })
		           } else {
		               res.json({
		                   success : true,
		                   message : 'Profile is complete!'
		               })
		           }
		       }
		   })
	   }
	});

    // send feedback
    router.post('/sendFeedback', function (req, res) {

        var feedback = new Feedback();

        feedback.title = req.body.title;
        feedback.feedback = req.body.feedback;

        feedback.save(function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Database error'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Thank you for submitting feedback.'
                })
            }
        })

    })



    return router;
};

