/*
    Controller written by - Pankaj tanwar
*/
angular.module('studentController',['studentServices'])

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
        if(data.data.success) {
            app.companyDetail = data.data.companyDetail;
            app.fetchedCompanyDetails = true;
            if(checkDateDifference(app.companyDetail.deadline_date) === true) {
                app.missedLastDate = true;
            } else {
                app.missedLastDate = false;
            }
        }
    });

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
});
