/*
    Controller written by - Pankaj tanwar
*/
angular.module('studentController',['studentServices','textAngular'])

// Company Registration Controller
.controller('companyRegistrationCtrl', function (student, admin, $scope) {

    var app = this;

    app.noUpcomingCompanies = false;
    app.fetchedUpcomingCompanies = false;
    app.profileComplete = false;

    // Get all upcoming companies
    function getAllUpcomingCompaniesFunction() {
        student.getAllUpcomingCompanies().then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.upcomingCompanies = data.data.companies;
                app.fetchedUpcomingCompanies = true;
                if(app.upcomingCompanies.length === 0) {
                    app.noUpcomingCompanies = true;
                } else {
                    app.noUpcomingCompanies = false;
                }
            }
        });
    }

    // Check Profile
    student.checkCompleteProfile().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.profileComplete = true;
            getAllUpcomingCompaniesFunction();
        } else {
            app.profileComplete = false;
            // No need to fetch companies details
            app.fetchedUpcomingCompanies = true;
            app.fetchedPreviousCompanies = true;
        }
    });

    // update admin's passout batch
    $scope.updateBatch = function (batch) {
        admin.updateAdminBatch(batch).then(function (data) {
            if(data.data.success) {
                app.fetchedUpcomingCompanies = false;
                getAllUpcomingCompaniesFunction();
            }
        });
    }
})


// Previous Companies controller
.controller('previousCompaniesCtrl', function (student, $scope,admin) {

    let app = this;

    app.noPreviousCompanies = false;
    app.fetchedPreviousCompanies = false;

    function getAllPreviousCompaniesFunction () {
        student.getAllPreviousCompanies().then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.previousCompanies = data.data.companies;
                app.fetchedPreviousCompanies = true;
                if(app.previousCompanies.length === 0) {
                    app.noPreviousCompanies = true;
                } else {
                    app.noPreviousCompanies = false;
                }
            }
        });
    }

    // Get All Previous Companies Function
    getAllPreviousCompaniesFunction();

    // update admin's passout batch
    $scope.updateBatch = function (batch) {
        admin.updateAdminBatch(batch).then(function (data) {
            if(data.data.success) {
                app.fetchedUpcomingCompanies = false;
                getAllPreviousCompaniesFunction();
            }
        });
    }
})

// company controller
.controller('companyCtrl', function (student, $routeParams, $scope) {

    var app = this;

    app.applyStatus = false;
    app.deleteSuccessMsg = '';
    app.missedLastDate = true;
    app.fetchedCompanyDetails = false;

    function checkDateDifference(deadline) {
        var deadline_date = new Date(deadline);
        var today = new Date();

        //console.log(deadline_date.getTime());
        //console.log(today.getTime());

        if(deadline_date.getTime() <= today.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    student.getCompanyDetails($routeParams.company_id).then(function (data) {
        console.log(data)
        if(data.data.success) {
            app.companyDetail = data.data.companyDetail;
            convertAllDateStringsToDateObj(app.companyDetail);
            app.fetchedCompanyDetails = true;
            if(checkDateDifference(app.companyDetail.deadline_date) === true) {
                app.missedLastDate = true;
            } else {
                app.missedLastDate = false;
            }
        }
    });

    // Convert all date strings to date objects for editing
    function convertAllDateStringsToDateObj(company) {
        if('selection_process' in company) {
            if('pre_placement_talk' in company.selection_process) {
                if('date' in company.selection_process.pre_placement_talk) {
                    if(company.selection_process.pre_placement_talk.date == null) {
                        app.companyDetail.selection_process.pre_placement_talk.date = '';
                    } else {
                        app.companyDetail.selection_process.pre_placement_talk.date = new Date(company.selection_process.pre_placement_talk.date);
                    }
                }
            }
            if('aptitude_test' in company.selection_process) {
                if('date' in company.selection_process.aptitude_test) {
                    if(company.selection_process.aptitude_test.date == null) {
                        app.companyDetail.selection_process.aptitude_test.date = '';
                    } else {
                        app.companyDetail.selection_process.aptitude_test.date = new Date(company.selection_process.aptitude_test.date);
                    }
                }
            }
            if('technical_test' in company.selection_process) {
                if('date' in company.selection_process.technical_test) {

                    if(company.selection_process.technical_test.date == null) {
                        app.companyDetail.selection_process.technical_test.date = '';
                    } else {
                        app.companyDetail.selection_process.technical_test.date = new Date(company.selection_process.technical_test.date);
                    }
                }
            }
            if('group_discussion' in company.selection_process) {
                if('date' in company.selection_process.group_discussion) {
                    if(company.selection_process.group_discussion.date == null) {
                        app.companyDetail.selection_process.group_discussion.date = '';
                    } else {
                        app.companyDetail.selection_process.group_discussion.date = new Date(company.selection_process.group_discussion.date);
                    }
                }
            }
            if('personal_interview' in company.selection_process) {
                if('date' in company.selection_process.personal_interview) {

                    if(company.selection_process.personal_interview.date == null) {
                        app.companyDetail.selection_process.personal_interview.date = '';
                        console.log(app.companyDetail.selection_process.personal_interview.date)
                    } else {
                        app.companyDetail.selection_process.personal_interview.date = new Date(company.selection_process.personal_interview.date);
                    }

                    app.companyDetail.selection_process.personal_interview.date = new Date(company.selection_process.personal_interview.date);
                }
            }
        }
        if('joining_date' in company) {
            if('joining_date' in company) {

                if(company.joining_date == null) {
                    app.companyDetail.joining_date = '';
                } else {
                    app.companyDetail.joining_date = new Date(company.joining_date);
                }

            }
        }
        if(company.deadline_date) {
            app.companyDetail.deadline_date = new Date(company.deadline_date);
        }
    }

    app.notMarkedAttendance = false;

    function getCandidateApplyStatusFunction() {
        student.getCandidateApplyStatus($routeParams.company_id).then(function (data) {
            if(data.data.success) {
                app.applyStatus = true;
                document.getElementById('oneClickApplyButton').className = 'btn btn-danger btn-rounded';
                document.getElementById('oneClickApplyButton').innerHTML = data.data.status + ' Successfully!';
                if(data.data.status === 'Applied') {
                    app.notMarkedAttendance = true;
                } else {
                    app.notMarkedAttendance = false;
                }
            } else {
                app.applyStatus = false;
                document.getElementById('oneClickApplyButton').className = 'btn btn-success btn-rounded';
                document.getElementById('oneClickApplyButton').innerHTML = 'One Click Apply';
            }
        });
    }

    getCandidateApplyStatusFunction();

    app.oneClickApply = function () {
        document.getElementById('oneClickApplyButton').className = 'btn btn-primary btn-rounded';
        document.getElementById('oneClickApplyButton').innerHTML = 'Applying.....Please wait!!';
        document.getElementById('oneClickApplyButton').disabled = true;
        student.oneClickApply($routeParams.company_id).then(function (data) {
            if(data.data.success) {
                getCandidateApplyStatusFunction();
            }
        })
    };

    app.withdrawApplication = function() {
        student.withdrawApplication($routeParams.company_id).then(function (data) {
            if(data.data.success) {
                getCandidateApplyStatusFunction();
            }
        })
    };

    app.attendanceStatus = false;
    app.company_otp = '';

    function getAttendanceStatus () {
        student.getAttendanceStatus($routeParams.company_id).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.attendanceStatus = data.data.attendanceStatus;
                app.company_otp = data.data.company_otp;
            }
        });
    }

    getAttendanceStatus();

    app.updateAttendanceStatus = function () {
        student.updateAttendanceStatus($routeParams.company_id).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                getAttendanceStatus();
            }
        })
    }

    app.markCompanyAttendanceSuccessMsg = '';
    app.markCompanyAttendanceErrorMsg = '';

    app.markCompanyAttendance = function (attendanceData) {
        student.markCompanyAttendance(app.attendanceData,$routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.markCompanyAttendanceSuccessMsg =  data.data.message;
                getCandidateApplyStatusFunction();
            } else {
                app.markCompanyAttendanceErrorMsg = data.data.message;
            }
        })
    };

    app.doneWithAttendance = function () {
        student.doneWithAttendance($routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                student.sendEmailToAbsentAndMarkRedFlag($routeParams.company_id).then(function (data) {
                    console.log(data);
                    if(data.data.success) {
                        getAttendanceStatus();
                    }
                });
            }
        })
    }
})

.controller('announcementsCtrl', function (student, admin) {

    var app = this;

    app.number = false;
    app.fetchedAnnouncements = false;

    function getAnnouncementsFunction () {
        student.getAnnouncements().then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.announcements = data.data.announcements;
                app.fetchedAnnouncements = true;
                if(data.data.announcements.length > 0) {
                    app.number = true;
                }
            }
        });
    }

    getAnnouncementsFunction();

    app.successMsg = false;
    app.errorMsg = false;

    // Admin Stuff of posting announcement
    app.postAnnouncement = function (announcementData) {
        //console.log(announcementData);
        admin.postAnnouncement(announcementData).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
                getAnnouncementsFunction();
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }
})


// User Profile Controller
.controller('profileCtrl', function (student) {

	var app = this;

	app.profileUpdateSuccessMsg = '';
	app.profileUpdateErrorMsg = '';

	// getting user profile
	student.getUserProfile().then(function (data) {
		if(data.data.success) {
		    app.userProfile = data.data.profile;
		}
	});

	// User user profile
	app.updateProfile = function (profileData) {
		console.log(app.profileData);
		student.updateProfile(app.profileData).then(function (data) {
		    console.log(data);
		    if(data.data.success) {
		        app.profileUpdateSuccessMsg = data.data.message;
		    } else {
		        app.profileUpdateErrorMsg = data.data.message;
		    }
		});
	}
})

// User timeline controller
.controller('timelineCtrl', function (student) {
    var app = this;

    app.timelineLengthZero = false;

    student.getTimeline().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.timelineData = data.data.candidateTimeline;
            if(app.timelineData.length === 0) {
                app.timelineLengthZero = true;
            } else {
                app.timelineLengthZero = false;
            }
        }
    })
})

// technical controller
.controller('technicalCtrl', function (student) {

    var app = this;

    app.feedbackTitle = '';
    app.successMsg = '';
    app.errorMsg = '';

    app.selectFeedbackBox = function (id) {
        document.getElementById(id).className = 'btn btn-' + id;
        if(id==='danger') {
            app.feedbackTitle = 'bug';
            document.getElementById('info').className = 'btn btn-outline-info';
            document.getElementById('primary').className = 'btn btn-outline-primary';
        } else if(id==='info') {
            app.feedbackTitle = 'suggestion';
            document.getElementById('danger').className = 'btn btn-outline-danger';
            document.getElementById('primary').className = 'btn btn-outline-primary';
        } else {
            app.feedbackTitle = 'compliment';
            document.getElementById('info').className = 'btn btn-outline-info';
            document.getElementById('danger').className = 'btn btn-outline-danger';
        }
    }

    app.sendFeedback = function (feedbackData) {
        console.log(app.feedbackData);
        if(!app.feedbackTitle) {
            app.errorMsg = 'Select one category!'
        } else {
            app.feedbackData.title = app.feedbackTitle;
            student.sendFeedback(app.feedbackData).then(function (data) {
                console.log(data);
                if(data.data.success) {
                    app.successMsg = data.data.message;
                } else {
                    app.errorMsg = data.data.message;
                }
            })
        }
    }
})

.controller('settingsCtrl', function (student) {

    let app = this;

    app.loading = false;

    app.changePassword = function (passwordData) {

        app.loading = true;
        app.successMsg = '';
        app.errorMsg = '';

        if(app.passwordData.new_password === app.passwordData.confirm_password) {
            student.changePassword(app.passwordData).then(function (data) {
                if(data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message;
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            })
        } else {
            app.loading = false;
            app.errorMsg = 'Confirm password did not match.'
        }
    }
})

.controller('interviewCtrl', function (student) {

    var app = this;

    // get all interview experiences
    student.getAllInterviewExperiences().then(function (data) {
        if(data.data.success) {
            app.interviews = data.data.interviews;
        } else {
            app.errorMsg = data.data.message;
        }
    })
})

// read experience ctrl
.controller('experienceCtrl', function (student, $routeParams, admin) {

    let app = this;

    // get interview experience function
    function getInterviewExperience() {
        student.getExperience($routeParams.experience_id).then(function (data) {
            if(data.data.success) {
                app.experience = data.data.experience;
            } else {
                app.errorMsg = data.data.message;
            }
        });
    }

    getInterviewExperience();

    // change status of interview experience - admin stuff
    app.changeStatus = function () {
        app.loading = true;
        admin.changeStatus($routeParams.experience_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.loading = false;
                app.errorMsg = '';
                app.successMsg = data.data.message;
                getInterviewExperience();
            } else {
                app.loading = false;
                app.successMsg = '';
                app.errorMsg = data.data.message;
            }
        })
    }

})

.controller('contributionsCtrl', function (student) {
    let app = this;

    // get all contributions of student
    student.getContributions().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.interviews = data.data.interviews;
        } else {
            app.errorMsg = data.data.message;
        }
    })
})

.controller('composeCtrl', function ($scope, student) {

    let app = this;

    // Tags array
    app.tags = [];

    // Add tag to an array
    app.addTag = function (tag) {
        if(tag) {
            if(app.tags.indexOf(tag.toLowerCase()) === -1) {
                app.tags.push(tag.toLowerCase());
                $scope.tag = '';
                app.errorMsg = '';
            } else {
                app.errorMsg = 'Tag already selected.'
            }
        } else {
            app.errorMsg = "Tag can't be empty!"
        }
    };

    // remove tag
    app.removeTag = function (tag) {
        app.tags.splice(app.tags.indexOf(tag.toLowerCase()),1);
    };

    // add interview experience
    app.postInterviewExperience = function (experienceData) {
        if(app.tags.length === 0) {
            app.errorMsg = "Tags can't be empty!"
        } else {
            app.loading = true;
            app.experienceData.tags = app.tags;
            console.log(app.experienceData);
            student.postInterviewExperience(app.experienceData).then(function (data) {
                console.log(data);
                if(data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message;
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        }
    }
});
