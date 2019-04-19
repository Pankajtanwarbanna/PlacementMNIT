/*
    API written by - Pankaj Tanwar
*/
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'placementmnit';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function (router){

    // Nodemailer-sandgrid stuff
    var options = {
        auth: {
            api_key: 'YOUR_API_KEY'
        }
    };

    var client = nodemailer.createTransport(sgTransport(options));

    // User register API
    router.post('/register',function (req, res) {
        var user = new User();

        console.log(req.body);

        user.name = req.body.name;
        user.college_id = req.body.college_id;
        user.branch = req.body.branch;
        user.year = req.body.year;
        user.cgpa = req.body.cgpa;
        user.contact_no = req.body.contact_no;
        user.password = req.body.password;
        user.temporarytoken = jwt.sign({ name : user.name , college_id : user.college_id }, secret , { expiresIn : '24h' });

        //console.log(req.body);
        if(!user.name || !user.college_id || !user.password || !user.branch || !user.year || !user.cgpa || !user.contact_no) {
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
    });

    // User login API
    router.post('/authenticate', function (req,res) {

        if(!req.body.college_id || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you filled all the entries.'
            });
        } else {

            User.findOne({ college_id : req.body.college_id }).select('college_id name password active').exec(function (err, user) {

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
                                name: user.name
                            }, secret, {expiresIn: '24h'});
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

    router.put('/activate/:token', function (req,res) {

        if(!req.params.token) {
            res.json({
                success : false,
                message : 'No token provided.'
            });
        } else {

            User.findOne({temporarytoken: req.params.token}, function (err, user) {
                if (err) throw err;

                var token = req.params.token;

                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Activation link has been expired.'
                        })
                    }
                    else if (!user) {
                        res.json({
                            success: false,
                            message: 'Activation link has been expired.'
                        });
                    } else {

                        user.temporarytoken = false;
                        user.active = true;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {

                                var email = {
                                    from: 'Polymath Registration, support@polymath.com',
                                    to: user.email,
                                    subject: 'Activation activated',
                                    text: 'Hello ' + user.name + 'Your account has been activated.Thank you Pankaj Tanwar CEO, Polymath',
                                    html: 'Hello <strong>' + user.name + '</strong>,<br><br> Your account has been activated.<br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                                };

                                client.sendMail(email, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });

                                res.json({
                                    success: true,
                                    message: 'Account activated.'
                                })

                            }
                        });
                    }
                });
            })
        }
    });

    // Resend activation link
    router.post('/resend', function (req,res) {

        if(!req.body.username || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you fill all the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('name username email password active temporarytoken').exec(function (err,user) {

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User is not registered with us.Please signup!'
                    });
                } else {
                    if(user.active) {
                        res.json({
                            success : false,
                            message : 'Account is already activated.'
                        });
                    } else {

                        var validPassword = user.comparePassword(req.body.password);

                        if(!validPassword) {
                            res.json({
                                success : false,
                                message : 'Incorrect password.'
                            });
                        } else {
                            res.json({
                                success : true,
                                user : user
                            });

                        }
                    }
                }
            })
        }
    });

    // router to update temporary token in the database
    router.put('/sendlink', function (req,res) {

        User.findOne({username : req.body.username}).select('email username name temporarytoken').exec(function (err,user) {
            if (err) throw err;

            user.temporarytoken = jwt.sign({
                email: user.email,
                username: user.username
            }, secret, {expiresIn: '24h'});

            user.save(function (err) {
                if(err) {
                    console.log(err);
                } else {

                    var email = {
                        from: 'Polymath Registration, support@polymath.com',
                        to: user.email,
                        subject: 'Activation Link request - Polymath Registration',
                        text: 'Hello '+ user.name + 'You requested for the new activation link.Please find the below activation link Activation link Thank you Pankaj Tanwar CEO, Polymath',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the new activation link.Please find the below activation link<br><br><a href="http://localhost:8080/activate/'+ user.temporarytoken+'">Activation link</a><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    res.json({
                        success : true,
                        message : 'Link has been successfully sent to registered email.'
                    });

                }
            })
        });


    });

    // Forgot username route
    router.post('/forgotUsername', function (req,res) {

        if(!req.body.email) {
            res.json({
                success : false,
                message : 'Please ensure you fill all the entries.'
            });
        } else {
            User.findOne({email : req.body.email}).select('username email name').exec(function (err,user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Email is not registered with us.'
                    });
                } else if(user) {

                    var email = {
                        from: 'Polymath, support@polymath.com',
                        to: user.email,
                        subject: 'Forgot Username Request',
                        text: 'Hello '+ user.name + 'You requested for your username.You username is ' + user.username + 'Thank you Pankaj Tanwar CEO, Polymath',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for your username.You username is <strong>'+ user.username + '</strong><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    res.json({
                        success : true,
                        message : 'Username has been successfully sent to your email.'
                    });
                } else {
                    res.send(user);
                }

            });
        }

    });

    // Send link to email id for reset password
    router.put('/forgotPasswordLink', function (req,res) {

        if(!req.body.username) {
            res.json({
                success : false,
                message : 'Please ensure you filled the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('username email temporarytoken name').exec(function (err,user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Username not found.'
                    });
                } else {

                    console.log(user.temporarytoken);

                    user.temporarytoken = jwt.sign({
                        email: user.email,
                        username: user.username
                    }, secret, {expiresIn: '24h'});

                    console.log(user.temporarytoken);

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error accured! Please try again. '
                            })
                        } else {

                            var email = {
                                from: 'Polymath Registration, support@polymath.com',
                                to: user.email,
                                subject: 'Forgot Password Request',
                                text: 'Hello '+ user.name + 'You request for the forgot password.Please find the below link Reset password Thank you Pankaj Tanwar CEO, Polymath',
                                html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the forgot password. Please find the below link<br><br><a href="http://localhost:8080/forgotPassword/'+ user.temporarytoken+'">Reset password</a><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                            };

                            client.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                }
                                else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });

                            res.json({
                                success : true,
                                message : 'Link to reset your password has been sent to your registered email.'
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

            User.findOne({ temporarytoken : req.params.token }).select('username temporarytoken').exec(function (err,user) {

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

        console.log('api is working fine');

        if(!req.body.password) {
            res.json({
                success : false,
                message : 'New password is missing.'
            })
        } else {

            User.findOne({ temporarytoken : req.params.token }).select('name password').exec(function (err,user) {

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

                            var email = {
                                from: 'Polymath, support@polymath.com',
                                to: user.email,
                                subject: 'Password reset',
                                text: 'Hello '+ user.name + 'You request for the reset password.Your password has been reset. Thank you Pankaj Tanwar CEO, Polymath',
                                html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the reset password. Your password has been reset.<br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                            };

                            client.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                }
                                else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });

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
        User.findOne({ college_id : req.decoded.college_id }).select('college_id name').exec(function (err, user) {
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

    // get all users
    router.get('/management', function (req, res) {

        User.find({}, function (err, users) {

            if(err) throw err;
            User.findOne({ username : req.decoded.username }, function (err,mainUser) {

                if(err) throw err;
                if(!mainUser) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    if(!users) {
                        res.json({
                            success : false,
                            message : 'Users not found.'
                        });
                    } else {
                        res.json({
                            success : true,
                            users : users,
                            permission : mainUser.permission
                        })
                    }
                }
            })
        })
    });

    // delete a user form database
    router.delete('/management/:username', function (req,res) {

        var deletedUser = req.params.username;

        User.findOne({ username : req.decoded.username }, function (err,mainUser) {

            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found.'
                });
            } else {
                if(mainUser.permission !== 'admin') {
                    res.json({
                        success : false,
                        message : 'Insufficient permission'
                    });
                } else {
                    User.findOneAndRemove({ username : deletedUser }, function (err,user) {
                        if(err) throw err;

                        res.json({
                            success : true,
                        });
                    });
                }
            }
        })
    });

    // route to edit user
    router.get('/edit/:id', function (req,res) {
        var editedUser = req.params.id;

        User.findOne({ username : req.decoded.username }, function (err,mainUser) {
            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found...'
                });
            } else {
                if(mainUser.permission === 'admin') {

                    User.findOne({ _id : editedUser }, function (err, user) {

                        if(err) throw err;

                        if(!user) {
                            res.json({
                                success : false,
                                message : 'User not found.'
                            });
                        } else {
                            res.json({
                                success : true,
                                user : user
                            })
                        }

                    })

                } else {
                    res.json({
                        success : false,
                        message : 'Insufficient permission.'
                    })
                }
            }
        })
    });

    // update user details
    router.put('/edit', function (req,res) {

        var editedUser = req.body._id;

        if(req.body.name) {
            var newName = req.body.name;
        }
        if(req.body.username) {
            var newUsername = req.body.username;
        }
        if(req.body.email) {
            var newEmail = req.body.email;
        }
        if(req.body.permission) {
            var newPermission = req.body.permission;
        }

        User.findOne({ username : req.decoded.username }, function (err,mainUser) {
            if(err) throw err;

            if(!mainUser) {
                res.json({
                    success : false,
                    message : 'User not found'
                });
            } else {
                if(mainUser.permission === 'admin') {

                    // update name
                    if(newName) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                user.name = newName;
                                user.save(function (err) {
                                    if(err) {
                                        if(err.errors.name) {
                                            res.json({
                                                success : false,
                                                message : err.errors.name.message
                                            })
                                        } else {
                                            res.json({
                                                success : false,
                                                message : 'Error! Please try again.'
                                            })
                                        }
                                    }

                                    else {

                                        res.json({
                                            success : true,
                                            message : 'Name has been updated.'
                                        });
                                    }

                                })
                            }

                        })
                    }

                    // update username
                    if(newUsername) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                user.username = newUsername;
                                user.save(function (err) {
                                    if(err) {
                                        if(err.errors) {
                                            res.json({
                                                success : false,
                                                message : err.errors.username.message
                                            })
                                        } else {
                                            res.json({
                                                success : false,
                                                message : 'Username is not unique.'
                                            })
                                        }
                                    }

                                    res.json({
                                        success : true,
                                        message : 'Username has been updated.'
                                    })
                                })
                            }

                        })
                    }

                    // update email
                    if(newEmail) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                user.email = newEmail;
                                user.save(function (err) {
                                    if(err) {
                                        if(err.errors) {
                                            console.log(err.errors);
                                            res.json({
                                                success : false,
                                                message : err.errors.email.message
                                            })
                                        } else {
                                            res.json({
                                                success : false,
                                                message : 'User is already registered with us.'
                                            })
                                        }
                                    } else {
                                        res.json({
                                            success : true,
                                            message : 'Email has been updated.'
                                        });
                                    }

                                })
                            }

                        })
                    }

                    // update permission
                    if(newPermission) {
                        User.findOne({ _id : editedUser }, function (err,user) {
                            if(err) throw err;

                            if(!user) {
                                res.json({
                                    success : false,
                                    message : 'User not found.'
                                });
                            } else {
                                console.log(user.permission);
                                console.log(mainUser.permission);

                                if(user.permission === 'user' && mainUser.permission === 'admin') {
                                    user.permission = 'admin';

                                    user.save(function (err) {
                                        if(err) {
                                            res.json({
                                                success : false,
                                                message : 'Can not upgrade to admin'
                                            });
                                        } else {
                                            res.json({
                                                success : true,
                                                message : 'Successfully upgraded to admin.'
                                            })
                                        }
                                    });

                                } else if(user.permission === 'user' && mainUser.permission === 'user') {
                                    res.json({
                                        success : false,
                                        message : 'Insufficient permission.'
                                    })
                                } else if(user.permission === 'admin' && mainUser.permission === 'admin') {
                                    res.json({
                                        success : false,
                                        message : 'Role is already admin.'
                                    })
                                } else if (user.permission === 'admin' && mainUser.permission === 'user') {
                                    res.json({
                                        success : false,
                                        message : 'Insufficient permission.'
                                    })
                                } else {
                                    res.json({
                                        success : true,
                                        message : 'Please try again later.'
                                    })
                                }
                            }

                        });
                    }


                } else {
                    res.json({
                        success : false,
                        message : 'Insufficient permission.'
                    })
                }
            }
        });
    });

    return router;
};

