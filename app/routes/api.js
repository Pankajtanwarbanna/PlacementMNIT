/*
    API written by - Pankaj Tanwar
*/
var User = require('../models/user');
var Schedule = require('../models/schedule');
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

    // User login API
    router.post('/authenticate', function (req,res) {

        if(!req.body.college_id || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you filled all the entries.'
            });
        } else {

            User.findOne({ college_id : (req.body.college_id).toUpperCase() }).select('college_id student_name password active').exec(function (err, user) {

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
                        message : 'College ID not found.'
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
                                subject: 'Reset Password Request : Placement Cell, MNIT Jaipur',
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
        User.findOne({ college_id : req.decoded.college_id }).select('college_id student_name gender department red_flags passout_batch').exec(function (err, user) {
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
    router.post('/updateCompanyDetails', function (req, res) {
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

    // get companies details from db
    router.get('/getAllUpcomingCompanies', function (req, res) {

        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            });
        } else {
            User.findOne({ college_id : req.decoded.college_id }).select('passout_batch').lean().exec(function (err, user) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Something went wrong!'
                    })
                } else {
                    if(!user) {
                        res.json({
                            success : false,
                            message : 'User not found.'
                        })
                    } else {
                        // todo Add here validation according to branch, cgpa etc
                        Company.find({ passout_batch: user.passout_batch, deadline_date : { $gte: new Date() -1 } }).select('company_name job_profile package deadline_date').lean().exec(function (err, companies) {
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
                }
            });
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
            User.findOne({ college_id : req.decoded.college_id }).select('passout_batch').lean().exec(function (err, user) {
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
                        Company.find({ passout_batch : user.passout_batch, deadline_date : { $lt: new Date() }  }).select('company_name job_profile package deadline_date').exec(function (err, companies) {
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
                }
            });
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
            Company.findOne({ _id : req.params.company_id}).select('-candidates').lean().exec(function (err, companyDetail) {
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
                            message : 'Applied',
                            status : company.candidates[company.candidates.indexOf(company.candidates.find(x => x.college_id === req.decoded.college_id))].candidate_status
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
    router.post('/oneClickApply/:company_id', auth.ensureStudent, function (req, res) {
        Company.findOne({ _id : req.params.company_id }, function (err, company) {
            if(err) {
                console.log(err);
                res.json({
                    success : false,
                    message : 'Some Database error.'
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
                company.candidates.push({ college_id : req.decoded.college_id, timestamp : new Date()});

                company.save(function (err) {
                    if(err) {
                        console.log(err);
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
    });

    // route to withdraw application
    router.post('/withdrawApplication/:company_id', function (req, res) {
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

                    let candidateIndex;

                    for(let i=0;i<company.candidates.length;i++) {
                        if(company.candidates[i].college_id === req.decoded.college_id) {
                            candidateIndex = i;
                            break;
                        }
                    }

                    company.candidates.splice(candidateIndex,1);

                    company.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Database error.'
                            });
                        } else {
                            res.json({
                                success : true,
                                message : 'Registration successfully withdraw.'
                            });
                        }
                    })
                }
            })
        }
    })

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

    // Add Company Notification
    router.post('/addCompanyNotification/:company_id', auth.ensureAdmin, function (req, res) {
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
    });

    // get company notifications
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
    });

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
	});

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

        let feedback = new Feedback();

        feedback.title = req.body.title;
        feedback.feedback = req.body.feedback;
        //console.log(req.decoded.student_name);
        feedback.author_name = req.decoded.student_name;
        feedback.author_email = req.decoded.college_id + '@mnit.ac.in';
        feedback.timestamp = new Date();

        feedback.save(function (err) {
            if(err) {
                console.log(err);
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
    router.post('/updateAttendanceStatus/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
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
        }
    });

    // get company attendance status
    router.get('/getAttendanceStatus/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            Company.findOne({ _id : req.params.company_id}, function (err, company) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Database error.'
                    })
                }

                if(!company) {
                    res.json({
                        success : false,
                        message : 'Company Not found.'
                    })
                } else {
                    res.json({
                        success : true,
                        attendanceStatus : company.attendance,
                        company_otp : company.company_otp
                    })
                }
            })
        }
    });

    // mark attendance
    router.post('/markCompanyAttendance/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            Company.findOne({ _id : req.params.company_id}, function (err, company) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Error from database'
                    })
                }

                if(!company) {
                    res.json({
                        success : false,
                        message : 'Company not found.'
                    })
                } else {
                    if(company.attendance) {
                        if(company.company_otp === req.body.otp) {
                            var index = company.candidates.indexOf(company.candidates.find(x => x.college_id === req.decoded.college_id));

                            company.candidates[index].candidate_status = 'Appeared for Test';

                            company.save(function (err) {
                                if(err) {
                                    res.json({
                                        success : false,
                                        message : 'Database error'
                                    })
                                } else {
                                    res.json({
                                        success : true,
                                        message : 'Attendance successfully marked.'
                                    })
                                }
                            })
                        } else {
                            res.json({
                                success : false,
                                message : 'Incorrect OTP'
                            })
                        }
                    } else {
                        res.json({
                            success : false,
                            message : 'Attendance is closed.'
                        })
                    }
                }
            })
        }
    })

    // done with the test  router
    router.post('/doneWithAttendance/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login'
            })
        } else {
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
        }
    });

    // mark ref flag to absent students
    router.post('/sendEmailToAbsentAndMarkRedFlag/:company_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
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
                        if (company.candidates[i].candidate_status === 'Absent') {

                            User.findOne({ college_id :  company.candidates[i].college_id }, function (err, user) {
                                if(err) {
                                    console.log(err);
                                }

                                if(!user) {
                                    console.log('User not found')
                                } else {
                                    if(user.red_flags) {
                                        user.red_flags = user.red_flags + 1;
                                    } else {
                                        user.red_flags = 1;
                                    }

                                    user.save(function (err) {
                                        if(err) {
                                            console.log('Error from database side.' + err);
                                        } else {
                                            var email = {
                                                from: '"Placement & Training Cell" <ptcell@mnit.ac.in>',
                                                to: user.college_email,
                                                subject: 'Red Flag Notification : Placement Cell, MNIT Jaipur',
                                                text: 'Hello '+ user.student_name + 'Your profile has been red flaged. 3 Red Flags will block your profile. With Regards, Prof. Mahendar Choudhary',
                                                html: 'Hello <strong>'+ user.student_name + '</strong>,<br><br>Your profile has been red flaged. 3 Red Flags will block your profile<br><br>With Regards.<br><br>Prof. Mahender Choudhary<br>In-charge, Training & Placement<br>MNIT Jaipur<br>+91-141-2529065'
                                            };

                                            transporter.sendMail(email, function(err, info){
                                                if (err ){
                                                    console.log(err);
                                                }
                                                else {
                                                    console.log('Message sent: ' + info.response);
                                                }
                                            });
                                        }
                                    });

                                }
                            })
                        }
                    }

                    res.json({
                        success : true,
                        message : 'Email sent successfully.'
                    });
                }
            });
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
    router.put('/updateStudentProfile', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
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
        }
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

    // change password
    router.post('/changePassword', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login first.'
            })
        } else {
            User.findOne({ college_id : req.decoded.college_id }).select('password').exec(function (err, user) {
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
                        let validPassword = user.comparePassword(req.body.old_password);

                        if(validPassword) {
                            user.password = req.body.new_password;

                            user.save(function (err) {
                                if(err) {
                                    res.json({
                                        success : false,
                                        message : 'Something went wrong!'
                                    })
                                } else {
                                    res.json({
                                        success : true,
                                        message : 'Password successfully updated.'
                                    })
                                }
                            })
                        } else {
                            res.json({
                                success : false,
                                message : 'Old Password is incorrect.'
                            })
                        }
                    }
                }
            })
        }
    });

    // get all interview experiences
    router.get('/getAllInterviewExperiences', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            Interview.find({ status : 'approved' }).select('title experience author_name created_at tags').lean().exec(function (err, interviews) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Something went wrong!'
                    })
                } else {
                    if(!interviews) {
                        res.json({
                            success : false,
                            message : 'Interview not found.'
                        })
                    } else {
                        res.json({
                            success : true,
                            interviews : interviews
                        })
                    }
                }
            })
        }
    });

    // get interview experience
    router.get('/getExperience/:experience_id', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            Interview.findOne({ _id : req.params.experience_id }).lean().exec(function (err, experience) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Something went wrong!'
                    })
                } else {
                    if(!experience) {
                        res.json({
                            success : false,
                            message : 'Interview experience not found.'
                        })
                    } else {
                        res.json({
                            success : true,
                            experience : experience
                        })
                    }
                }
            })
        }
    })

    // Posting Interview experiences
    router.post('/postInterviewExperience', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            User.findOne({ college_id : req.decoded.college_id }).select('student_name').exec(function (err, user) {
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
                        let interview = new Interview();

                        interview.title = req.body.title;
                        interview.experience = req.body.experience;
                        interview.tags = req.body.tags;
                        interview.author_id = req.decoded.college_id;
                        interview.author_name = user.student_name;
                        interview.created_at = new Date();

                        interview.save(function (err) {
                            if(err) {
                                res.json({
                                    success : false,
                                    message : 'Something went wrong!'
                                })
                            } else {
                                res.json({
                                    success : true,
                                    message : 'Thanks for your contribution! Sit back and relax while our reviewers approves your interview experience.'
                                })
                            }
                        })
                    }
                }
            })
        }
    });

    // get contributions
    router.get('/getContributions', function (req, res) {
        if(!req.decoded.college_id) {
            res.json({
                success : false,
                message : 'Please login.'
            })
        } else {
            Interview.find({ author_id : req.decoded.college_id }).lean().exec(function (err, interviews) {
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
        }
    })


    return router;
};

