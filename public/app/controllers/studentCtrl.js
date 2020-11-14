/*
    Controller written by - Pankaj tanwar
*/
angular.module('studentController',['studentServices','textAngular','fileModelDirective','uploadFileService'])

// Company Registration Controller
.controller('companyRegistrationCtrl', function (student, admin, $scope) {

    let app = this;

    app.noUpcomingCompanies = false;
    app.fetchedUpcomingCompanies = false;

    // Get all upcoming companies
    function getAllUpcomingCompaniesFunction() {
        student.getAllUpcomingCompanies().then(function (data) {
            if(data.data.success) {
                app.upcomingCompanies = data.data.companies;
                app.fetchedUpcomingCompanies = true;
                app.noUpcomingCompanies = (app.upcomingCompanies.length === 0);
            }
        });
    }

    getAllUpcomingCompaniesFunction();

    // update admin's passout batch
    $scope.updateBatch = function (batch) {
        app.fetchedUpcomingCompanies = false;

        admin.updateAdminBatch(batch).then(function (data) {
            if(data.data.success) {
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
            if(data.data.success) {
                app.previousCompanies = data.data.companies;
                app.fetchedPreviousCompanies = true;
                app.noPreviousCompanies = (app.previousCompanies.length === 0);
            }
        });
    }

    // Get All Previous Companies Function
    getAllPreviousCompaniesFunction();

    // update admin's passout batch
    $scope.updateBatch = function (batch) {
        app.fetchedUpcomingCompanies = false;

        admin.updateAdminBatch(batch).then(function (data) {
            if(data.data.success) {
                getAllPreviousCompaniesFunction();
            }
        });
    }
})

// company controller
.controller('companyCtrl', function (student, $routeParams, $scope) {

    let app = this;

    app.applyStatus = false;
    app.deleteSuccessMsg = '';
    app.missedLastDate = true;
    app.fetchedCompanyDetails = false;

    function checkDateDifference(deadline) {
        let deadline_date = new Date(deadline);
        let today = new Date();

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
                        //console.log(app.companyDetail.selection_process.personal_interview.date)
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
            } else {
                app.errorMsg = data.data.message;
                app.applyStatus = false;
                document.getElementById('oneClickApplyButton').disabled = false;
                document.getElementById('oneClickApplyButton').className = 'btn btn-success btn-rounded';
                document.getElementById('oneClickApplyButton').innerHTML = 'One Click Apply';

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
    };

    app.markCompanyAttendanceSuccessMsg = '';
    app.markCompanyAttendanceErrorMsg = '';

    app.markCompanyAttendance = function (attendanceData) {
        student.markCompanyAttendance(app.attendanceData,$routeParams.company_id).then(function (data) {
            //console.log(data);
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
            //console.log(data);
            if(data.data.success) {
                getAttendanceStatus();
                /*student.sendEmailToAbsentAndMarkRedFlag($routeParams.company_id).then(function (data) {
                    //console.log(data);
                    if(data.data.success) {
                        getAttendanceStatus();
                    }
                });*/
            }
        })
    }
})

.controller('announcementsCtrl', function (student, admin,$scope) {

    let app = this;

    app.notZeroAnnouncements = false;
    app.fetchedAnnouncements = false;

    // update admin's passout batch
    $scope.updateBatch = function (batch) {
        admin.updateAdminBatch(batch).then(function (data) {
            if(data.data.success) {
                app.fetchedAnnouncements = false;
                getAnnouncementsFunction();
            }
        });
    };

    // Get all announcements
    function getAnnouncementsFunction () {
        student.getAnnouncements().then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.announcements = data.data.announcements;
                app.fetchedAnnouncements = true;
                app.notZeroAnnouncements = (data.data.announcements.length > 0);
            }
        });
    }

    getAnnouncementsFunction();

    app.successMsg = false;
    app.errorMsg = false;
    app.postingAnnouncementsLoading = false;

    // Admin Stuff of posting announcement
    app.postAnnouncement = function (announcementData) {
        //console.log(announcementData);
        app.postingAnnouncementsLoading = true;

        admin.postAnnouncement(announcementData).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
                app.postingAnnouncementsLoading = false;
                getAnnouncementsFunction();
            } else {
                app.errorMsg = data.data.message;
                app.postingAnnouncementsLoading = false;
            }
        })
    }
})


// User Profile Controller
.controller('profileCtrl', function (student, $timeout,$scope, uploadFile) {

	let app = this;

	// Success - Error Messages
	app.profileUpdateSuccessMsg = '';
	app.profileUpdateErrorMsg = '';

	// getting user profile
    function getUserProfileFunction() {
        student.getUserProfile().then(function (data) {
            //console.log(data.data.profile);
            if(data.data.success) {
                app.userProfile = data.data.profile;
            }
        });
    }

    // get Student Profile
    getUserProfileFunction();

	// User user profile
	app.updateProfile = function (profileData) {
	    // loading
        app.profileUpdateLoadingMsg = true;
        app.profileUpdateSuccessMsg = '';
        app.profileUpdateErrorMsg = '';

        // API call
		student.updateProfile(app.profileData).then(function (data) {
		    if(data.data.success) {
		        app.profileUpdateSuccessMsg = data.data.message;
                app.profileUpdateLoadingMsg = false;
                // Remove Message after 3 seconds
                $timeout(function () {
                    app.profileUpdateSuccessMsg = '';
                }, 3000);
		    } else {
		        app.profileUpdateErrorMsg = data.data.message;
                app.profileUpdateLoadingMsg = false;
		    }
		});
	};

	// Resume Loading/Error/Success Message
    app.resumeUploadLoading = false;
    app.resumeUploadErrorMsg = '';
    app.resumeUploadSuccessMsg = '';

	// Upload Student Resume
    app.updateStudentResume = function() {

        // Loading & Error Msg
        app.resumeUploadLoading = true;
        app.resumeUploadErrorMsg = '';

        // Upload Resume to Server.
        uploadFile.uploadStudentResume($scope.file).then(function (data) {
            if(data.data.success) {
                // Uploaded Resume
                app.resumeUploadSuccessMsg = data.data.message;
                app.resumeUploadLoading = false;
                getUserProfileFunction();
            } else {
                // Something went wrong!
                app.resumeUploadErrorMsg = data.data.message;
                app.resumeUploadLoading = false;
            }
        })
    };

})

// User timeline controller
.controller('timelineCtrl', function (student) {
    let app = this;

    app.timelineLengthZero = false;

    // get student timeline controller function
    student.getTimeline().then(function (data) {
        // Loading timeline message
        app.getTimelineLoadingMsg = true;

        if(data.data.success) {
            app.getTimelineLoadingMsg = false;
            app.timeline = data.data.timeline;
            if(app.timeline.length === 0) {
                app.timelineLengthZero = true;
            } else {
                app.timelineLengthZero = false;
            }
        } else {
            app.errorMsg = data.data.message;
            app.getTimelineLoadingMsg = false;
        }
    });
})

// technical controller
.controller('technicalCtrl', function (student) {

    let app = this;

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
    };

    // Send feedback function
    app.sendFeedback = function (feedbackData) {

        app.loading = true;
        app.errorMsg = '';

        if(!app.feedbackTitle) {
            app.errorMsg = 'Select one category!';
            app.loading = false;
        } else {

            //  Set Title
            app.feedbackData.title = app.feedbackTitle;

            student.sendFeedback(app.feedbackData).then(function (data) {
                if(data.data.success) {
                    app.successMsg = data.data.message;
                    app.loading = false;
                } else {
                    app.errorMsg = data.data.message;
                    app.loading = false;
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

    let app = this;

    // get all interview experiences
    student.getAllInterviewExperiences().then(function (data) {
        if(data.data.success) {
            app.interviews = data.data.interviews;
            app.fetchedInterviewExperiences = true;
        } else {
            app.fetchedInterviewExperiences = true;
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
            console.log(data);
            if(data.data.success) {
                app.experience = data.data.experience;
                app.fetchedInterviewExperience = true;
            } else {
                app.errorMsg = data.data.message;
                app.fetchedInterviewExperience = true;
            }
        });
    }

    getInterviewExperience();

    // change status of interview experience - admin stuff
    app.changeStatus = function () {
        app.loading = true;
        admin.changeStatus($routeParams.experience_id).then(function (data) {
            //console.log(data);
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
        //console.log(data);
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
            //console.log(app.experienceData);
            student.postInterviewExperience(app.experienceData).then(function (data) {
                //console.log(data);
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
})
    
// Notifications Controller
.controller('notificationsCtrl', function(admin, student) {

    let app = this;

    // get notifications
    admin.getNotifications().then(function (data) {
        if(data.data.success) {
            app.notifications = data.data.notifications;
            wipeNotifications();
        } else {
            app.errorMsg = data.data.message;
        }
    })

    // wipe all notifications as well
    function wipeNotifications() {
        student.wipeNotifications().then(function (data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }

})

// achievements controller
.controller('achievementsCtrl', function(student) {
    let app = this;

    function getAchievements() {
        app.loading = true;
        student.getAchievements().then(function (data) {
            if(data.data.success) {
                app.loading = false;
                app.achievements = data.data.achievements;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
    }

    getAchievements();
})

// red flag history
.controller('redFlagHistoryCtrl', function (student) {

    let app = this;

    student.getMyRedFlagHistory().then(function (data) {
        if(data.data.success) {
            app.redFlagHistory = data.data.redFlagHistory;
            app.redFlags = data.data.redFlags;
            app.fetchedRedFlagHistory = true;
        } else {
            app.errorMsg = data.data.message;
        }
    })
})

// placements controller
.controller('placementsCtrl', function(admin) {
    let app = this;

    function generatePlacements(placements) {
        let companies    = [];
        let degrees      = [];
        let branches     = {};

        placements.forEach(placement => {
            companies.push(placement.company_name);

            placement.department = placement.students[0].department;
            placement.degree     = placement.students[0].degree;

            degrees.push(placement.degree);

            if(branches.hasOwnProperty(placement.degree)) {
                branches[placement.degree].push(placement.department);
                branches[placement.degree] = [...new Set(branches[placement.degree])]
            } else {
                branches[placement.degree] = [placement.department];
            }
        });

        companies = [...new Set(companies)];
        degrees = [...new Set(degrees)];

        return {
            placements,
            companies,
            degrees,
            branches
        }
    }

    function getPlacementsData() {
        app.loading = true;
        admin.getPlacementsData().then(function (data) {
            if(data.data.success) {
                app.loading = false;
                let result = generatePlacements(data.data.placements);
                app.placements = result.placements;
                app.companies = result.companies;
                app.degrees = result.degrees;
                app.branches = result.branches;
                console.log(app.placements);
                //app.placements = data.data.placements;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        })
    }

    getPlacementsData();
})

// Placement Stats Controller
.controller('placementStatsCtrl', function ($scope) {

    let app = this;

    app.placements = [
        {
            "B.Tech.": [
                {
                    "S.No.": "1",
                    "Name": "Jagriti Aggarwal",
                    "College ID": "2016ucp1413",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "PPO",
                    "Result Date": "3 July"
                },
                {
                    "S.No.": "2",
                    "Name": "Aryan Sharma",
                    "College ID": "2016ucp1458",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "PPO",
                    "Result Date": "3 July"
                },
                {
                    "S.No.": "3",
                    "Name": "Ashish Goyal",
                    "College ID": "2016ucp1100",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "PPO",
                    "Result Date": "3 July"
                },
                {
                    "S.No.": "4",
                    "Name": "Sakshi Maheshwari",
                    "College ID": "2016ucp1617",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "PPO",
                    "Result Date": "3 July"
                },
                {
                    "S.No.": "5",
                    "Name": "Sumit Kumar",
                    "College ID": "2016ucp1459",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "PPO",
                    "Result Date": "3 July"
                },
                {
                    "S.No.": "6",
                    "Name": "Swaraj Pravin Thakre",
                    "College ID": "2016ucp1663",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "PPO",
                    "Result Date": "3 July"
                },
                {
                    "S.No.": "7",
                    "Name": "Meedimale Yashwanth Reddy",
                    "College ID": "2016ucp1216",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "PPO",
                    "Result Date": "3 July"
                },
                {
                    "S.No.": "8",
                    "Name": "Tarushree Sabarwal",
                    "College ID": "2016uee1681",
                    "Branch": "EEE",
                    "Company": "Goldman Sachs",
                    "Package": "22",
                    "Company visited on": "PPO",
                    "Result Date": "7 July"
                },
                {
                    "S.No.": "9",
                    "Name": "Aditya Sinha",
                    "College ID": "2016uec1070",
                    "Branch": "ECE",
                    "Company": "Goldman Sachs",
                    "Package": "22",
                    "Company visited on": "PPO",
                    "Result Date": "7 July"
                },
                {
                    "S.No.": "10",
                    "Name": "Anmola kumari",
                    "College ID": "2016ucp1422",
                    "Branch": "CSE",
                    "Company": "Goldman Sachs",
                    "Package": "22",
                    "Company visited on": "PPO",
                    "Result Date": "7 July"
                },
                {
                    "S.No.": "11",
                    "Name": "Uditi Arora",
                    "College ID": "2016ucp1415",
                    "Branch": "CSE",
                    "Company": "Goldman Sachs",
                    "Package": "22",
                    "Company visited on": "PPO",
                    "Result Date": "7 July"
                },
                {
                    "S.No.": "12",
                    "Name": "Vandita Goyal",
                    "College ID": "2016ucp1004",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "PPO",
                    "Result Date": "22 July"
                },
                {
                    "S.No.": "13",
                    "Name": "Akshita Agrawal",
                    "College ID": "2016ucp1023",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "PPO",
                    "Result Date": "22 July"
                },
                {
                    "S.No.": "14",
                    "Name": "Kamakshi Sethi",
                    "College ID": "2016uec1714",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "PPO",
                    "Result Date": "22 July"
                },
                {
                    "S.No.": "15",
                    "Name": "Aditya Bansal",
                    "College ID": "2016ucp1456",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "PPO",
                    "Result Date": "22 July"
                },
                {
                    "S.No.": "16",
                    "Name": "Vipul Vivek",
                    "College ID": "2016uec1093",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "PPO",
                    "Result Date": "22 July"
                },
                {
                    "S.No.": "17",
                    "Name": "Harsh Bansal",
                    "College ID": "2016ucp1468",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "PPO",
                    "Result Date": "22 July"
                },
                {
                    "S.No.": "18",
                    "Name": "Kashyap Kumar Vishwakarma",
                    "College ID": "2016ucp1400",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "PPO",
                    "Result Date": "22 July"
                },
                {
                    "S.No.": "19",
                    "Name": "Ronak Gadia",
                    "College ID": "2016ucp1185",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "20",
                    "Name": "Saransh Goyal",
                    "College ID": "2016uec1049",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "21",
                    "Name": "Shambhawi Varchasva",
                    "College ID": "2016ucp1470",
                    "Branch": "CSE",
                    "Company": "Commvault",
                    "Package": "24",
                    "Company visited on": "PPO",
                    "Result Date": "23 July",
                    "Date": "22 Aug"
                },
                {
                    "S.No.": "22",
                    "Name": "Ashish Kumar",
                    "College ID": "2016uec1087",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "23",
                    "Name": "M. Satish Reddy",
                    "College ID": "2016ucp1180",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "24",
                    "Name": "Shreya Vijay",
                    "College ID": "2016uec1430",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "25",
                    "Name": "Shubham Arora",
                    "College ID": "2016ucp1388",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "26",
                    "Name": "Nidheesh Panchal",
                    "College ID": "2016ucp1008",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "27",
                    "Name": "Aditya Sinha",
                    "College ID": "2016ucp1447",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "PPO",
                    "Result Date": "23 July"
                },
                {
                    "S.No.": "28",
                    "Name": "Divya Gupta",
                    "College ID": "2016ucp1472",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Package": "30.82",
                    "Company visited on": "PPO",
                    "Result Date": "24 July"
                },
                {
                    "S.No.": "29",
                    "Name": "Aashish Goel",
                    "College ID": "2016ucp1404",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Package": "30.82",
                    "Company visited on": "PPO",
                    "Result Date": "24 July"
                },
                {
                    "S.No.": "30",
                    "Name": "Tarishi Jain",
                    "College ID": "2016ucp1443",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Package": "30.82",
                    "Company visited on": "PPO",
                    "Result Date": "24 July"
                },
                {
                    "S.No.": "31",
                    "Name": "Harshita Saraswat",
                    "College ID": "2016UCH1528",
                    "Branch": "CHEM",
                    "Company": "Saint Gobain",
                    "Package": "6.3",
                    "Company visited on": "PPO",
                    "Result Date": "25 July"
                },
                {
                    "S.No.": "32",
                    "Name": "Ramavatar Choudhary",
                    "College ID": "2016UCP1642",
                    "Branch": "CSE",
                    "Company": "Amazon India",
                    "Package": "28.75",
                    "Company visited on": "PPO",
                    "Result Date": "31 July"
                },
                {
                    "S.No.": "33",
                    "Name": "Gaurav Kabra",
                    "College ID": "2016UCP1471",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Package": "30.82",
                    "Company visited on": "31 July",
                    "Result Date": "31 July"
                },
                {
                    "S.No.": "34",
                    "Name": "Shivani Khandelwal",
                    "College ID": "2016UCP1462",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Package": "30.82",
                    "Company visited on": "31 July",
                    "Result Date": "31 July"
                },
                {
                    "S.No.": "35",
                    "Name": "Narender Kumar Yadav",
                    "College ID": "2016UCP1474",
                    "Branch": "CSE",
                    "Company": "Flipkart",
                    "Package": "23.84",
                    "Company visited on": "1 Aug",
                    "Result Date": "2 Aug"
                },
                {
                    "S.No.": "36",
                    "Name": "Aditya Raj",
                    "College ID": "2016UCP1482",
                    "Branch": "CSE",
                    "Company": "Flipkart",
                    "Package": "23.84",
                    "Company visited on": "1 Aug",
                    "Result Date": "2 Aug"
                },
                {
                    "S.No.": "37",
                    "Name": "Ankita Soni",
                    "College ID": "2016UEC1079",
                    "Branch": "ECE",
                    "Company": "Goldman Sachs",
                    "Package": "22",
                    "Company visited on": "27 Jul",
                    "Result Date": "2 Aug"
                },
                {
                    "S.No.": "38",
                    "Name": "Sumit Kumar",
                    "College ID": "2016UME1275",
                    "Branch": "MECH",
                    "Company": "Bajaj",
                    "Package": "9.08",
                    "Company visited on": "2 Aug",
                    "Result Date": "3 Aug"
                },
                {
                    "S.No.": "39",
                    "Name": "Himanshu Mangal",
                    "College ID": "2016UME1252",
                    "Branch": "MECH",
                    "Company": "Bajaj",
                    "Package": "9.08",
                    "Company visited on": "2 Aug",
                    "Result Date": "3 Aug"
                },
                {
                    "S.No.": "40",
                    "Name": "Ankur Khandelwal",
                    "College ID": "2016UME1312",
                    "Branch": "MECH",
                    "Company": "Bajaj",
                    "Package": "9.08",
                    "Company visited on": "2 Aug",
                    "Result Date": "3 Aug"
                },
                {
                    "S.No.": "41",
                    "Name": "Rahul Agarwal",
                    "College ID": "2016UME1194",
                    "Branch": "MECH",
                    "Company": "Bajaj",
                    "Package": "9.08",
                    "Company visited on": "2 Aug",
                    "Result Date": "3 Aug"
                },
                {
                    "S.No.": "42",
                    "Name": "Kapil Saini",
                    "College ID": "2016UCP1297",
                    "Branch": "CSE",
                    "Company": "ServiceNow",
                    "Package": "25",
                    "Company visited on": "3 Aug",
                    "Result Date": "4 Aug"
                },
                {
                    "S.No.": "43",
                    "Name": "Rahul Kumar",
                    "College ID": "2016UCP1412",
                    "Branch": "CSE",
                    "Company": "ServiceNow",
                    "Package": "25",
                    "Company visited on": "3 Aug",
                    "Result Date": "4 Aug"
                },
                {
                    "S.No.": "44",
                    "Name": "Rishabh Kalakoti",
                    "College ID": "2016UCP1098",
                    "Branch": "CSE",
                    "Company": "ServiceNow",
                    "Package": "25",
                    "Company visited on": "3 Aug",
                    "Result Date": "4 Aug"
                },
                {
                    "S.No.": "45",
                    "Name": "Prakriti Sankla",
                    "College ID": "2016UEC1245",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Package": "14",
                    "Company visited on": "5 Aug",
                    "Result Date": "5 Aug"
                },
                {
                    "S.No.": "46",
                    "Name": "Chandni Dewani",
                    "College ID": "2016UCH1533",
                    "Branch": "CHEM",
                    "Company": "Box8",
                    "Package": "17",
                    "Company visited on": "4 Aug",
                    "Result Date": "5 Aug"
                },
                {
                    "S.No.": "47",
                    "Name": "Srishti Agarwal",
                    "College ID": "2016UMT1568",
                    "Branch": "META",
                    "Company": "Box8",
                    "Package": "17",
                    "Company visited on": "4 Aug",
                    "Result Date": "5 Aug"
                },
                {
                    "S.No.": "48",
                    "Name": "Mukul Kumar",
                    "College ID": "2016UCP1116",
                    "Branch": "CSE",
                    "Company": "Airtel",
                    "Package": "14",
                    "Company visited on": "6 Aug",
                    "Result Date": "7 Aug"
                },
                {
                    "S.No.": "49",
                    "Name": "Gaurav Bansal",
                    "College ID": "2016UCP1345",
                    "Branch": "CSE",
                    "Company": "Airtel",
                    "Package": "14",
                    "Company visited on": "6 Aug",
                    "Result Date": "7 Aug"
                },
                {
                    "S.No.": "50",
                    "Name": "Harshita Agarwal",
                    "College ID": "2016UEC1701",
                    "Branch": "ECE",
                    "Company": "Airtel",
                    "Package": "14",
                    "Company visited on": "6 Aug",
                    "Result Date": "7 Aug"
                },
                {
                    "S.No.": "51",
                    "Name": "Ronak Gupta",
                    "College ID": "2016UEE1409",
                    "Branch": "EEE",
                    "Company": "Airtel",
                    "Package": "11",
                    "Company visited on": "6 Aug",
                    "Result Date": "7 Aug"
                },
                {
                    "S.No.": "52",
                    "Name": "Shivam Chandna",
                    "College ID": "2016uch1628",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "53",
                    "Name": "Smrity Prakash",
                    "College ID": "2016uch1546",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "54",
                    "Name": "Nishant Sharma",
                    "College ID": "2016uch1622",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "55",
                    "Name": "Devesh Agarwal",
                    "College ID": "2016uch1583",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "56",
                    "Name": "Vidhan Kumar",
                    "College ID": "2016uch1601",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "57",
                    "Name": "Shivam Tyagi",
                    "College ID": "2016uch1072",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "58",
                    "Name": "Yaashi Gupta",
                    "College ID": "2016uch1586",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "59",
                    "Name": "Nishi Saraswat",
                    "College ID": "2016uch1500",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "60",
                    "Name": "Bharat Kumar",
                    "College ID": "2016uee1127",
                    "Branch": "EEE",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "61",
                    "Name": "Kela Priyansh",
                    "College ID": "2016ume1631",
                    "Branch": "MECH",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "62",
                    "Name": "Vivek Sharma",
                    "College ID": "2016uee1442",
                    "Branch": "EEE",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "63",
                    "Name": "Chandrapal Singh",
                    "College ID": "2016uch1560",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "64",
                    "Name": "Hardik Ajmera",
                    "College ID": "2016UEC1044",
                    "Branch": "ECE",
                    "Company": "GAP",
                    "Package": "9",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug",
                    "Date": "PPO"
                },
                {
                    "S.No.": "65",
                    "Name": "Fanendra Yadlapalli ",
                    "College ID": "2016UEC1452",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "66",
                    "Name": "Shristi Singh Thakur",
                    "College ID": "2016UEC1102",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "67",
                    "Name": "Divya Golyan",
                    "College ID": "2016UEC1045",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "68",
                    "Name": "Utkarsh Dubey",
                    "College ID": "2016UEC1082",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "69",
                    "Name": "Aviral Mongra",
                    "College ID": "2016UCP1392",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "70",
                    "Name": "Matli Mohan Tejeswar Reddy",
                    "College ID": "2016UCP1338",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "71",
                    "Name": "Shubham Dubey",
                    "College ID": "2016UCP1606",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "72",
                    "Name": "Shubham Bhootra",
                    "College ID": "2016UEC1215",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Package": "12.93",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "73",
                    "Name": "Shivanshu Vyas",
                    "College ID": "2016UCP1121",
                    "Branch": "CSE",
                    "Company": "Amazon India",
                    "Package": "28.75",
                    "Company visited on": "6 Aug",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "74",
                    "Name": "Anshika Maheshwari",
                    "College ID": "2016umt1507",
                    "Branch": "META",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "PPO",
                    "Result Date": "8 Aug"
                },
                {
                    "S.No.": "75",
                    "Name": "Shubham",
                    "College ID": "2016UCP1350",
                    "Branch": "CSE",
                    "Company": "QuadEye Security",
                    "Package": "17",
                    "Company visited on": "9 Aug",
                    "Result Date": "9 Aug"
                },
                {
                    "S.No.": "76",
                    "Name": "Bhagwana Ram",
                    "College ID": "2016UCP1389",
                    "Branch": "CSE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "77",
                    "Name": "MD Saifullah",
                    "College ID": "2016UCP1369",
                    "Branch": "CSE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "78",
                    "Name": "Preet Yadav",
                    "College ID": "2016UCP1436",
                    "Branch": "CSE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "79",
                    "Name": "Shreya Jain",
                    "College ID": "2016UCP1360",
                    "Branch": "CSE",
                    "Company": "GAP",
                    "Package": "9",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug",
                    "Date": "PPO"
                },
                {
                    "S.No.": "80",
                    "Name": "Varun Kumar Verma",
                    "College ID": "2016UCP1368",
                    "Branch": "CSE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "81",
                    "Name": "Ramakrishna Bali",
                    "College ID": "2016UEC1342",
                    "Branch": "ECE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "82",
                    "Name": "Nagraj Deshmukh",
                    "College ID": "2016UEE1361",
                    "Branch": "EEE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "83",
                    "Name": "Pulkit ",
                    "College ID": "2016UCP1090",
                    "Branch": "CSE",
                    "Company": "Samsung",
                    "Package": "13",
                    "Company visited on": "7 Aug",
                    "Result Date": "11 Aug"
                },
                {
                    "S.No.": "84",
                    "Name": "Rohit Kumar bairwa",
                    "College ID": "2016UCP1295",
                    "Branch": "CSE",
                    "Company": "Samsung",
                    "Package": "13",
                    "Company visited on": "7 Aug",
                    "Result Date": "11 Aug"
                },
                {
                    "S.No.": "85",
                    "Name": "Himnshu yadav",
                    "College ID": "2016UCP1372",
                    "Branch": "CSE",
                    "Company": "Samsung",
                    "Package": "13",
                    "Company visited on": "7 Aug",
                    "Result Date": "11 Aug"
                },
                {
                    "S.No.": "86",
                    "Name": "Siddhant Gupta",
                    "College ID": "2016UCP1455",
                    "Branch": "CSE",
                    "Company": "Samsung",
                    "Package": "13",
                    "Company visited on": "7 Aug",
                    "Result Date": "11 Aug"
                },
                {
                    "S.No.": "87",
                    "Name": "MYADAM VARUNRAJ",
                    "College ID": "2016UEC1094",
                    "Branch": "ECE",
                    "Company": "Samsung",
                    "Package": "13",
                    "Company visited on": "7 Aug",
                    "Result Date": "11 Aug"
                },
                {
                    "S.No.": "88",
                    "Name": "MORLA LOKESH MANIKANTA",
                    "College ID": "2016UEC1325",
                    "Branch": "ECE",
                    "Company": "Samsung",
                    "Package": "13",
                    "Company visited on": "7 Aug",
                    "Result Date": "11 Aug"
                },
                {
                    "S.No.": "89",
                    "Name": "Aman Soni",
                    "College ID": "2016UME1558",
                    "Branch": "MECH",
                    "Company": "HERO",
                    "Package": "7",
                    "Company visited on": "9 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "90",
                    "Name": "Ujjwal Padha",
                    "College ID": "2016UME1375",
                    "Branch": "MECH",
                    "Company": "HERO",
                    "Package": "7",
                    "Company visited on": "9 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "91",
                    "Name": "Shourya Tyagi",
                    "College ID": "2016UME1256",
                    "Branch": "MECH",
                    "Company": "HERO",
                    "Package": "7",
                    "Company visited on": "9 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "92",
                    "Name": "Amit Singh Jadaun",
                    "College ID": "2016UCP1363",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "11 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "93",
                    "Name": "Parvat Jakhar",
                    "College ID": "2016UCP1699",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "11 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "94",
                    "Name": "Harshit Jain",
                    "College ID": "2016UEC1125",
                    "Branch": "ECE",
                    "Company": "Walmart Labs",
                    "Package": "19.27",
                    "Company visited on": "11 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "95",
                    "Name": "Shubhangi Agarwal",
                    "College ID": "2016UCH1585",
                    "Branch": "CHEM",
                    "Company": "AXXELA",
                    "Package": "11",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "96",
                    "Name": "Akshit Chawla",
                    "College ID": "2016UCE1154",
                    "Branch": "CIVIL",
                    "Company": "AXXELA",
                    "Package": "11",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "97",
                    "Name": "Jaideep Sharma",
                    "College ID": "2016UCP1126",
                    "Branch": "CSE",
                    "Company": "Lowe's",
                    "Package": "19.17",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug"
                },
                {
                    "S.No.": "98",
                    "Name": "Shweta Mehrolia",
                    "College ID": "2016UCP1438",
                    "Branch": "CSE",
                    "Company": "GAP",
                    "Package": "9",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug",
                    "Date": "PPO"
                },
                {
                    "S.No.": "99",
                    "Name": "Abhishek Bharti",
                    "College ID": "2016UEC1081",
                    "Branch": "ECE",
                    "Company": "Lowe's",
                    "Package": "19.17",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug"
                },
                {
                    "S.No.": "100",
                    "Name": "Vemula Viswanadh",
                    "College ID": "2016UEC1634",
                    "Branch": "ECE",
                    "Company": "Lowe's",
                    "Package": "19.17",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug"
                },
                {
                    "S.No.": "101",
                    "Name": "Shubham",
                    "College ID": "2016UEC1069",
                    "Branch": "ECE",
                    "Company": "WISIG",
                    "Package": "7.5",
                    "Company visited on": "13 Aug",
                    "Result Date": "14 Aug"
                },
                {
                    "S.No.": "102",
                    "Name": "Prithvi Shankar",
                    "College ID": "2016UEC1440",
                    "Branch": "ECE",
                    "Company": "WISIG",
                    "Package": "7.5",
                    "Company visited on": "13 Aug",
                    "Result Date": "14 Aug"
                },
                {
                    "S.No.": "103",
                    "Name": "Rajat Nagar",
                    "College ID": "2016UEE1323",
                    "Branch": "EEE",
                    "Company": "WISIG",
                    "Package": "7.5",
                    "Company visited on": "13 Aug",
                    "Result Date": "14 Aug"
                },
                {
                    "S.No.": "104",
                    "Name": "Lalit Kumar",
                    "College ID": "2016UCP1572",
                    "Branch": "CSE",
                    "Company": "Deutsche Bank",
                    "Package": "14.3",
                    "Company visited on": "14 Aug",
                    "Result Date": "14 Aug"
                },
                {
                    "S.No.": "105",
                    "Name": "Chirag Jain",
                    "College ID": "2016UCP1651",
                    "Branch": "CSE",
                    "Company": "Deutsche Bank",
                    "Package": "14.3",
                    "Company visited on": "14 Aug",
                    "Result Date": "14 Aug"
                },
                {
                    "S.No.": "106",
                    "Name": "Khusboo Choudhary",
                    "College ID": "2016UCP1469",
                    "Branch": "CSE",
                    "Company": "Deutsche Bank",
                    "Package": "14.3",
                    "Company visited on": "14 Aug",
                    "Result Date": "14 Aug"
                },
                {
                    "S.No.": "107",
                    "Name": "Nimit Agarwal",
                    "College ID": "2016uce1198",
                    "Branch": "CIVIL",
                    "Company": "Tredence",
                    "Package": "6.5",
                    "Company visited on": "16 Aug",
                    "Result Date": "16 Aug"
                },
                {
                    "S.No.": "108",
                    "Name": "Nishant Agrawal",
                    "College ID": "2016uce1166",
                    "Branch": "CIVIL",
                    "Company": "Tredence",
                    "Package": "6.5",
                    "Company visited on": "16 Aug",
                    "Result Date": "16 Aug"
                },
                {
                    "S.No.": "109",
                    "Name": "Siddharth Dash",
                    "College ID": "2016UCP1021",
                    "Branch": "CSE",
                    "Company": "GAP",
                    "Package": "9",
                    "Company visited on": "16 Aug",
                    "Result Date": "16 Aug",
                    "Date": "PPO"
                },
                {
                    "S.No.": "110",
                    "Name": "Jahnavi Agrawal",
                    "College ID": "2016uee1214",
                    "Branch": "EEE",
                    "Company": "Tredence",
                    "Package": "6.5",
                    "Company visited on": "16 Aug",
                    "Result Date": "16 Aug"
                },
                {
                    "S.No.": "111",
                    "Name": "Varun Sharma",
                    "College ID": "2016UEE1557",
                    "Branch": "EEE",
                    "Company": "Tredence",
                    "Package": "6.5",
                    "Company visited on": "16 Aug",
                    "Result Date": "16 Aug"
                },
                {
                    "S.No.": "112",
                    "Name": "Prasoon Singh",
                    "College ID": "2016umt1556",
                    "Branch": "META",
                    "Company": "Tredence",
                    "Package": "6.5",
                    "Company visited on": "16 Aug",
                    "Result Date": "16 Aug"
                },
                {
                    "S.No.": "113",
                    "Name": "Meenal Punia",
                    "College ID": "2016UCE1555",
                    "Branch": "CIVIL",
                    "Company": "L&T Construction",
                    "Package": "6",
                    "Company visited on": "PPO",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "114",
                    "Name": "Pratishtha Gupta",
                    "College ID": "2016UCE1192",
                    "Branch": "CIVIL",
                    "Company": "L&T Construction",
                    "Package": "6",
                    "Company visited on": "PPO",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "115",
                    "Name": "Shreyanshu Garg",
                    "College ID": "2016UEE1334",
                    "Branch": "EEE",
                    "Company": "L&T Construction",
                    "Package": "6",
                    "Company visited on": "PPO",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "116",
                    "Name": "Abhishek Tibrewal",
                    "College ID": "2016UCP1103",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "117",
                    "Name": "G Jahnavi VS",
                    "College ID": "2016UCP1332",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "118",
                    "Name": "Sugam",
                    "College ID": "2016UCP1305",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "119",
                    "Name": "Pratibha Choudhary",
                    "College ID": "2016UCP1426",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "120",
                    "Name": "Adit Mathur",
                    "College ID": "2016UCP1454",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "121",
                    "Name": "Aditya Raj",
                    "College ID": "2016UEC1046",
                    "Branch": "ECE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "122",
                    "Name": "Hitesh Jangir",
                    "College ID": "2016UEC1050",
                    "Branch": "ECE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "123",
                    "Name": "Kushagra Saxena",
                    "College ID": "2016UEC1091",
                    "Branch": "ECE",
                    "Company": "GAP",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug",
                    "Date": "PPO"
                },
                {
                    "S.No.": "124",
                    "Name": "K. Keerthi",
                    "College ID": "2016UEC1059",
                    "Branch": "ECE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "125",
                    "Name": "Gavara Abhishek ",
                    "College ID": "2016UEE1337",
                    "Branch": "EEE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "126",
                    "Name": "Ashish Trivedi",
                    "College ID": "2016UEC1054",
                    "Branch": "ECE",
                    "Company": "Wissen",
                    "Package": "11",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "127",
                    "Name": "Sumit Kumar",
                    "College ID": "2016uec1057",
                    "Branch": "ECE",
                    "Company": "Wissen",
                    "Package": "11",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "128",
                    "Name": "Pankaj Tanwar Banna",
                    "College ID": "2016UCP1381",
                    "Branch": "CSE",
                    "Company": "PaisaBazaar",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug",
                    "Date": "17 Aug"
                },
                {
                    "S.No.": "129",
                    "Name": "Arnav Loonker",
                    "College ID": "2016UCP1016",
                    "Branch": "CSE",
                    "Company": "MAQ ",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "130",
                    "Name": "Deepanshu Kumar Sanu",
                    "College ID": "2016UME1303",
                    "Branch": "MECH",
                    "Company": "HERO",
                    "Package": "7",
                    "Company visited on": "PPO",
                    "Result Date": "19 Aug"
                },
                {
                    "S.No.": "131",
                    "Name": "Tabish Iqbal",
                    "College ID": "2016UME1280",
                    "Branch": "MECH",
                    "Company": "HERO",
                    "Package": "7",
                    "Company visited on": "PPO",
                    "Result Date": "19 Aug"
                },
                {
                    "S.No.": "132",
                    "Name": "Twinkal Parmar",
                    "College ID": "2016UCP1700",
                    "Branch": "CSE",
                    "Company": "Philips",
                    "Package": "10",
                    "Company visited on": "19 Aug",
                    "Result Date": "19 Aug"
                },
                {
                    "S.No.": "133",
                    "Name": "Shivani Goyal",
                    "College ID": "2016UEC1080",
                    "Branch": "ECE",
                    "Company": "Philips",
                    "Package": "10",
                    "Company visited on": "19 Aug",
                    "Result Date": "19 Aug"
                },
                {
                    "S.No.": "134",
                    "Name": "Bhavishya Garg",
                    "College ID": "2016UCP1644",
                    "Branch": "CSE",
                    "Company": "InfoObjects",
                    "Package": "7",
                    "Company visited on": "20 Aug",
                    "Result Date": "20 Aug",
                    "Date": "21 Aug"
                },
                {
                    "S.No.": "135",
                    "Name": "Ramachandran Kulothungan",
                    "College ID": "2016UME1128",
                    "Branch": "MECH",
                    "Company": "Dassault Systems",
                    "Package": "7",
                    "Company visited on": "20 Aug",
                    "Result Date": "20 Aug"
                },
                {
                    "S.No.": "136",
                    "Name": "Anushree Gautam",
                    "College ID": "2016UMT1510",
                    "Branch": "META",
                    "Company": "Dassault Systems",
                    "Package": "7",
                    "Company visited on": "20 Aug",
                    "Result Date": "20 Aug"
                },
                {
                    "S.No.": "137",
                    "Name": "Ramcharan Jethu",
                    "College ID": "2016UCP1633",
                    "Branch": "CSE",
                    "Company": "Interra ",
                    "Package": "10",
                    "Company visited on": "20 Aug",
                    "Result Date": "20 Aug"
                },
                {
                    "S.No.": "138",
                    "Name": "Ravi Khandelwal",
                    "College ID": "2016UCP1653",
                    "Branch": "CSE",
                    "Company": "Optum",
                    "Package": "13.17",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug"
                },
                {
                    "S.No.": "139",
                    "Name": "Narendra Kumar",
                    "College ID": "2016UCP1476",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug",
                    "Date": "29 Jan"
                },
                {
                    "S.No.": "140",
                    "Name": "Awadhesh Kumar",
                    "College ID": "2016UCP1441",
                    "Branch": "CSE",
                    "Company": "Incture",
                    "Package": "8",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug"
                },
                {
                    "S.No.": "141",
                    "Name": "Deeksha Jangid",
                    "College ID": "2016UEC1107",
                    "Branch": "ECE",
                    "Company": "Incture",
                    "Package": "8",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug"
                },
                {
                    "S.No.": "142",
                    "Name": "Arvind Kumar",
                    "College ID": "2016UCP1448",
                    "Branch": "CSE",
                    "Company": "Incture",
                    "Package": "8",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug"
                },
                {
                    "S.No.": "143",
                    "Name": "Anshul Gupta",
                    "College ID": "2016UEC1096",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "144",
                    "Name": "Utsav Chouhan",
                    "College ID": "2016UEC1092",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "145",
                    "Name": "Priyanka Ahirwar",
                    "College ID": "2016UEC1052",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "146",
                    "Name": "Manonita Verma",
                    "College ID": "2016UEC1048",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "147",
                    "Name": "Pooja Yadav",
                    "College ID": "2016UCP1406",
                    "Branch": "CSE",
                    "Company": "Nokia",
                    "Package": "7",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "148",
                    "Name": "Abhishek Khatri",
                    "College ID": "2016UEE1467",
                    "Branch": "EEE",
                    "Company": "Nokia",
                    "Package": "7",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "149",
                    "Name": "Rekha Siyak",
                    "College ID": "2016UCE1688",
                    "Branch": "CIVIL",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "150",
                    "Name": "Anushka Sahu",
                    "College ID": "2016UCH1423",
                    "Branch": "CHEM",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "151",
                    "Name": "Amisha Jain",
                    "College ID": "2016UEC1006",
                    "Branch": "ECE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "152",
                    "Name": "Srishti V Daga",
                    "College ID": "2016UEC1056",
                    "Branch": "ECE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "153",
                    "Name": "Raghav Goswami",
                    "College ID": "2016UME1298",
                    "Branch": "MECH",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "154",
                    "Name": "Prakhar Gupta",
                    "College ID": "2016UEE1398",
                    "Branch": "EEE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "155",
                    "Name": "Siddharth Narula",
                    "College ID": "2016UME1255",
                    "Branch": "MECH",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "156",
                    "Name": "Aishwarya Pawan",
                    "College ID": "2016UCH1576",
                    "Branch": "CHEM",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "157",
                    "Name": "Sakshi Sharma",
                    "College ID": "2016UEE1330",
                    "Branch": "EEE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "158",
                    "Name": "Suraj Pant",
                    "College ID": "2016UEE1420",
                    "Branch": "EEE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "159",
                    "Name": "Astha Mary John",
                    "College ID": "2016UEE1351",
                    "Branch": "EEE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "160",
                    "Name": "Shivam Dubey",
                    "College ID": "2016UCH1605",
                    "Branch": "CHEM",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "161",
                    "Name": "Anishka Agarwal",
                    "College ID": "2016UCH1573",
                    "Branch": "CHEM",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "162",
                    "Name": "Nimesh Khandelwal",
                    "College ID": "2016UME1270",
                    "Branch": "MECH",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "163",
                    "Name": "Saurav Gautam",
                    "College ID": "2016UEC1222",
                    "Branch": "ECE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "164",
                    "Name": "Vinod Yadav",
                    "College ID": "2016UME1696",
                    "Branch": "MECH",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "165",
                    "Name": "Baallah Syed Mohammed Saqlain",
                    "College ID": "2016UME1129",
                    "Branch": "MECH",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "166",
                    "Name": "Satwik Srivastava",
                    "College ID": "2016UCE1229",
                    "Branch": "CIVIL",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "167",
                    "Name": "Abhinav Kumar Singh",
                    "College ID": "2016UCE1162",
                    "Branch": "CIVIL",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "168",
                    "Name": "Harsh jain",
                    "College ID": "2016UEC1542",
                    "Branch": "ECE",
                    "Company": "Publicis Sapient",
                    "Package": "10",
                    "Company visited on": "25 Aug",
                    "Result Date": "26 Aug"
                },
                {
                    "S.No.": "169",
                    "Name": "Birat Adhikari",
                    "College ID": "2016UCP1033",
                    "Branch": "CSE",
                    "Company": "Publicis Sapient",
                    "Package": "10",
                    "Company visited on": "25 Aug",
                    "Result Date": "26 Aug"
                },
                {
                    "S.No.": "170",
                    "Name": "Suraj Kumar",
                    "College ID": "2016UCP1220",
                    "Branch": "CSE",
                    "Company": "Publicis Sapient",
                    "Package": "10",
                    "Company visited on": "25 Aug",
                    "Result Date": "26 Aug"
                },
                {
                    "S.No.": "171",
                    "Name": "Gauri",
                    "College ID": "2016UCP1425",
                    "Branch": "CSE",
                    "Company": "Publicis Sapient",
                    "Package": "10",
                    "Company visited on": "25 Aug",
                    "Result Date": "26 Aug"
                },
                {
                    "S.No.": "172",
                    "Name": "Divya Choudhary",
                    "College ID": "2016UEC1099",
                    "Branch": "ECE",
                    "Company": "GAP",
                    "Package": "9",
                    "Company visited on": "PPO",
                    "Result Date": "26 Aug"
                },
                {
                    "S.No.": "173",
                    "Name": "Samihan Nandedkar",
                    "College ID": "2016UEC1051",
                    "Branch": "ECE",
                    "Company": "GAP",
                    "Package": "9",
                    "Company visited on": "PPO",
                    "Result Date": "26 Aug"
                },
                {
                    "S.No.": "174",
                    "Name": "Sanjay Kumar",
                    "College ID": "2016UCP1382",
                    "Branch": "CSE",
                    "Company": "PharmEasy",
                    "Package": "13.5",
                    "Company visited on": "16 Aug",
                    "Result Date": "26 Aug"
                },
                {
                    "S.No.": "175",
                    "Name": "Aileni Madhu Sudhan Reddy",
                    "College ID": "2016UEC1504",
                    "Branch": "ECE",
                    "Company": "IBM",
                    "Package": "7.25",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug",
                    "Date": "31 Aug"
                },
                {
                    "S.No.": "176",
                    "Name": "Akshat Srivastava",
                    "College ID": "2016UCH1597",
                    "Branch": "CHEM",
                    "Company": "Dufil Prima",
                    "Package": "38",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug",
                    "Date": "21 Feb"
                },
                {
                    "S.No.": "177",
                    "Name": "Ashish Pandey",
                    "College ID": "2016UCP1432",
                    "Branch": "CSE",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "178",
                    "Name": "Hitesh Mali",
                    "College ID": "2016UCE1169",
                    "Branch": "CIVIL",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "179",
                    "Name": "Piyush Garg",
                    "College ID": "2016UEE1348",
                    "Branch": "EEE",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "180",
                    "Name": "Riya Sharma",
                    "College ID": "2016UEC1067",
                    "Branch": "ECE",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "181",
                    "Name": "Shubham Goyal",
                    "College ID": "2016UEE1397",
                    "Branch": "EEE",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "182",
                    "Name": "Bhawana Sankhla",
                    "College ID": "2016UCP1457",
                    "Branch": "CSE",
                    "Company": "IBM",
                    "Package": "7.25",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug",
                    "Date": "31 Aug"
                },
                {
                    "S.No.": "183",
                    "Name": "Katam Raghuveer",
                    "College ID": "2016UEC1503",
                    "Branch": "ECE",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "184",
                    "Name": "Khushi",
                    "College ID": "2016UCH1593",
                    "Branch": "CHEM",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "185",
                    "Name": "Rohit Agrawal",
                    "College ID": "2016UMT1473",
                    "Branch": "META",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "186",
                    "Name": "Ajay Ghosh",
                    "College ID": "2016UMT1483",
                    "Branch": "META",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "187",
                    "Name": "Pooja Choudhary",
                    "College ID": "2016UMT1493",
                    "Branch": "META",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "188",
                    "Name": "Sakshi Agarwal",
                    "College ID": "2016UMT1498",
                    "Branch": "META",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "189",
                    "Name": "Utkarsh Joshi",
                    "College ID": "2016UMT1521",
                    "Branch": "META",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "190",
                    "Name": "Humayun Akbar",
                    "College ID": "2016UMT1623",
                    "Branch": "META",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "191",
                    "Name": "Sachin Soni",
                    "College ID": "2016UMT1702",
                    "Branch": "META",
                    "Company": "Capgemini",
                    "Package": "6.8",
                    "Company visited on": "28 Aug",
                    "Result Date": "29 Aug"
                },
                {
                    "S.No.": "192",
                    "Name": "Anshul Awasthi",
                    "College ID": "2016UME1274",
                    "Branch": "MECH",
                    "Company": "Addverb",
                    "Package": "10.32",
                    "Company visited on": "30 Aug",
                    "Result Date": "30 Aug"
                },
                {
                    "S.No.": "193",
                    "Name": "Manoj Sheshma",
                    "College ID": "2016UCP1599",
                    "Branch": "CSE",
                    "Company": "Accenture",
                    "Package": "8.91",
                    "Company visited on": "1 Sept",
                    "Result Date": "1 Sept"
                },
                {
                    "S.No.": "194",
                    "Name": "Kartik Mundra",
                    "College ID": "2016UEC1055",
                    "Branch": "ECE",
                    "Company": "Accenture",
                    "Package": "8.91",
                    "Company visited on": "1 Sept",
                    "Result Date": "1 Sept"
                },
                {
                    "S.No.": "195",
                    "Name": "Ankur Singh",
                    "College ID": "2016UCE1177",
                    "Branch": "CIVIL",
                    "Company": "Accenture",
                    "Package": "8.91",
                    "Company visited on": "1 Sept",
                    "Result Date": "1 Sept"
                },
                {
                    "S.No.": "196",
                    "Name": "Jaskaran Singh Thakkar",
                    "College ID": "2016UEE1249",
                    "Branch": "EEE",
                    "Company": "TransOrg",
                    "Package": "7",
                    "Company visited on": "3 Sept",
                    "Result Date": "3 Sept"
                },
                {
                    "S.No.": "197",
                    "Name": "Ram Karan Rinwa",
                    "College ID": "2016UCH1488",
                    "Branch": "CHEM",
                    "Company": "TransOrg",
                    "Package": "7",
                    "Company visited on": "3 Sept",
                    "Result Date": "4 Sept"
                },
                {
                    "S.No.": "198",
                    "Name": "Shruti Yadav",
                    "College ID": "2015UAR1719",
                    "Branch": "ARCHI",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "3 Sept",
                    "Result Date": "4 Sept"
                },
                {
                    "S.No.": "199",
                    "Name": "Aditya",
                    "College ID": "2015UAR1173",
                    "Branch": "ARCHI",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "3 Sept",
                    "Result Date": "4 Sept"
                },
                {
                    "S.No.": "200",
                    "Name": "Vidushi Kajla",
                    "College ID": "2015UAR1224",
                    "Branch": "ARCHI",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "3 Sept",
                    "Result Date": "4 Sept"
                },
                {
                    "S.No.": "201",
                    "Name": "ANKURANJAN SAIKIA",
                    "College ID": "2015UAR1088",
                    "Branch": "ARCHI",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "3 Sept",
                    "Result Date": "4 Sept"
                },
                {
                    "S.No.": "202",
                    "Name": "Sumeet Nandi",
                    "College ID": "2016UMT1095",
                    "Branch": "META",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "203",
                    "Name": "Poulomi Mukherjee",
                    "College ID": "2016UMT1417",
                    "Branch": "META",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "204",
                    "Name": "Patel Mohammed Usama Zakir",
                    "College ID": "2016UEE1371",
                    "Branch": "EEE",
                    "Company": "Siemens",
                    "Package": "5",
                    "Company visited on": "4 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "205",
                    "Name": "Anurag",
                    "College ID": "2016UEE1418",
                    "Branch": "EEE",
                    "Company": "Siemens",
                    "Package": "5",
                    "Company visited on": "4 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "206",
                    "Name": "Gaurav Kumar",
                    "College ID": "2016UME1191",
                    "Branch": "MECH",
                    "Company": "Siemens",
                    "Package": "5",
                    "Company visited on": "4 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "207",
                    "Name": "Bablu Sangwan",
                    "College ID": "2016UME1273",
                    "Branch": "MECH",
                    "Company": "Siemens",
                    "Package": "5",
                    "Company visited on": "4 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "208",
                    "Name": "Aman Sharma",
                    "College ID": "2016UEE1610",
                    "Branch": "EEE",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "209",
                    "Name": "Kush Kumar",
                    "College ID": "2016UME1261",
                    "Branch": "MECH",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "210",
                    "Name": "Rishabh Gupta",
                    "College ID": "2016UEE1421",
                    "Branch": "EEE",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "211",
                    "Name": "Ritik Anand",
                    "College ID": "2016UCE1399",
                    "Branch": "CIVIL",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "212",
                    "Name": "Tinkoo Bansal",
                    "College ID": "2016UCH1512",
                    "Branch": "CHEM",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "213",
                    "Name": "Chirag Gupta",
                    "College ID": "2016UEE1250",
                    "Branch": "EEE",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "214",
                    "Name": "Kuldeep Chaturvedi",
                    "College ID": "2016UEE1356",
                    "Branch": "EEE",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "5 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "215",
                    "Name": "Surodwar Krishna",
                    "College ID": "2016UCP1479",
                    "Branch": "CSE",
                    "Company": "Analytics Quotient",
                    "Package": "6.5",
                    "Company visited on": "29 Aug",
                    "Result Date": "9 Sept"
                },
                {
                    "S.No.": "216",
                    "Name": "Utsav Goyal",
                    "College ID": "2016UCH1596",
                    "Branch": "CHEM",
                    "Company": "Analytics Quotient",
                    "Package": "6.5",
                    "Company visited on": "29 Aug",
                    "Result Date": "9 Sept"
                },
                {
                    "S.No.": "217",
                    "Name": "Nishant Agarwal",
                    "College ID": "2016UMT1516",
                    "Branch": "META",
                    "Company": "Analytics Quotient",
                    "Package": "6.5",
                    "Company visited on": "29 Aug",
                    "Result Date": "9 Sept"
                },
                {
                    "S.No.": "218",
                    "Name": "Yanda Jagadeesh Kumar",
                    "College ID": "2016UMT1339",
                    "Branch": "META",
                    "Company": "Byju's",
                    "Package": "10",
                    "Company visited on": "5 Sept",
                    "Result Date": "10 Sept"
                },
                {
                    "S.No.": "219",
                    "Name": "Ajay Singh",
                    "College ID": "2016UEE1017",
                    "Branch": "EEE",
                    "Company": "Byju's",
                    "Package": "10",
                    "Company visited on": "5 Sept",
                    "Result Date": "10 Sept"
                },
                {
                    "S.No.": "220",
                    "Name": "Rohan Shreedhar Badiger",
                    "College ID": "2016UME1010",
                    "Branch": "MECH",
                    "Company": "Byju's",
                    "Package": "10",
                    "Company visited on": "5 Sept",
                    "Result Date": "10 Sept"
                },
                {
                    "S.No.": "221",
                    "Name": "Hariom Jangid",
                    "College ID": "2016UEE1370",
                    "Branch": "EEE",
                    "Company": "DCM Shriram",
                    "Package": "5",
                    "Company visited on": "10 Sept",
                    "Result Date": "10 Sept"
                },
                {
                    "S.No.": "222",
                    "Name": "Sahil Sihag",
                    "College ID": "2016UME1679",
                    "Branch": "MECH",
                    "Company": "DCM Shriram",
                    "Package": "5",
                    "Company visited on": "10 Sept",
                    "Result Date": "10 Sept"
                },
                {
                    "S.No.": "223",
                    "Name": "Shailesh Kumar",
                    "College ID": "2016UME1271",
                    "Branch": "MECH",
                    "Company": "DCM Shriram",
                    "Package": "5",
                    "Company visited on": "10 Sept",
                    "Result Date": "10 Sept"
                },
                {
                    "S.No.": "224",
                    "Name": "Pankaj Kumar",
                    "College ID": "2016UCP1564",
                    "Branch": "CSE",
                    "Company": "SCA Technologies",
                    "Package": "8.3",
                    "Company visited on": "13 Sept",
                    "Result Date": "13 Sept"
                },
                {
                    "S.No.": "225",
                    "Name": "Sanghamitra Nath",
                    "College ID": "2016UCP1009",
                    "Branch": "CSE",
                    "Company": "People Strong",
                    "Package": "6.6",
                    "Company visited on": "13 Sept",
                    "Result Date": "13 Sept"
                },
                {
                    "S.No.": "226",
                    "Name": "Sankhya Kumar Mitra",
                    "College ID": "2016UCP1145",
                    "Branch": "CSE",
                    "Company": "People Strong",
                    "Package": "6.6",
                    "Company visited on": "13 Sept",
                    "Result Date": "13 Sept"
                },
                {
                    "S.No.": "227",
                    "Name": "Sonam Jangid",
                    "College ID": "2016UEC1582",
                    "Branch": "ECE",
                    "Company": "People Strong",
                    "Package": "6.6",
                    "Company visited on": "13 Sept",
                    "Result Date": "13 Sept"
                },
                {
                    "S.No.": "228",
                    "Name": "Rahul Jangir",
                    "College ID": "2016UCP1396",
                    "Branch": "CSE",
                    "Company": "Wipro",
                    "Package": "6.5",
                    "Company visited on": "14 Sept",
                    "Result Date": "14 Sept"
                },
                {
                    "S.No.": "229",
                    "Name": "Ananya Sharma",
                    "College ID": "2016UEC1563",
                    "Branch": "ECE",
                    "Company": "Wipro",
                    "Package": "6.5",
                    "Company visited on": "14 Sept",
                    "Result Date": "14 Sept"
                },
                {
                    "S.No.": "230",
                    "Name": "Parvez Khan",
                    "College ID": "2016UME1136",
                    "Branch": "MECH",
                    "Company": "L&T Limited",
                    "Package": "6",
                    "Company visited on": "10 Sept",
                    "Result Date": "14 Sept"
                },
                {
                    "S.No.": "231",
                    "Name": "Sagar Singhal",
                    "College ID": "2016UME1236",
                    "Branch": "MECH",
                    "Company": "L&T Limited",
                    "Package": "6",
                    "Company visited on": "10 Sept",
                    "Result Date": "14 Sept"
                },
                {
                    "S.No.": "232",
                    "Name": "Saurabh Jindal",
                    "College ID": "2016UME1311",
                    "Branch": "MECH",
                    "Company": "L&T Limited",
                    "Package": "6",
                    "Company visited on": "10 Sept",
                    "Result Date": "14 Sept"
                },
                {
                    "S.No.": "233",
                    "Name": "Megha Soni",
                    "College ID": "2016uee1331",
                    "Branch": "EEE",
                    "Company": "Cartesian Consulting",
                    "Package": "5",
                    "Company visited on": "17 Sept",
                    "Result Date": "17 Sept"
                },
                {
                    "S.No.": "234",
                    "Name": "Simran Vijayvargiya",
                    "College ID": "2016uce1296",
                    "Branch": "CIVIL",
                    "Company": "Cartesian Consulting",
                    "Package": "5",
                    "Company visited on": "17 Sept",
                    "Result Date": "17 Sept"
                },
                {
                    "S.No.": "235",
                    "Name": "Sai Teja Bandam",
                    "College ID": "2016uec1086",
                    "Branch": "ECE",
                    "Company": "ATCS Jaipur",
                    "Package": "6.34",
                    "Company visited on": "16 Sept",
                    "Result Date": "17 Sept"
                },
                {
                    "S.No.": "236",
                    "Name": "Arpit Gupta",
                    "College ID": "2016umt1527",
                    "Branch": "META",
                    "Company": "Cartesian Consulting",
                    "Package": "5",
                    "Company visited on": "17 Sept",
                    "Result Date": "17 Sept"
                },
                {
                    "S.No.": "237",
                    "Name": "Balwant Singh",
                    "College ID": "2016ucp1411",
                    "Branch": "CSE",
                    "Company": "Toshiba",
                    "Package": "8",
                    "Company visited on": "18 Sept",
                    "Result Date": "18 Sept",
                    "Date": "18 Sept"
                },
                {
                    "S.No.": "238",
                    "Name": "Girish kumar ",
                    "College ID": "2016UCP1706",
                    "Branch": "CSE",
                    "Company": "Toshiba",
                    "Package": "8",
                    "Company visited on": "18 Sept",
                    "Result Date": "18 Sept"
                },
                {
                    "S.No.": "239",
                    "Name": "Boggarapu Naresh Kumar",
                    "College ID": "2016UEC1619",
                    "Branch": "ECE",
                    "Company": "Cipher Research Group",
                    "Package": "8.4",
                    "Company visited on": "21 Sept",
                    "Result Date": "21 Sept"
                },
                {
                    "S.No.": "240",
                    "Name": "Russel Mondayapurath",
                    "College ID": "2016UEC1031",
                    "Branch": "ECE",
                    "Company": "Cipher Research Group",
                    "Package": "8.4",
                    "Company visited on": "21 Sept",
                    "Result Date": "21 Sept"
                },
                {
                    "S.No.": "241",
                    "Name": "Ambesh Gupta",
                    "College ID": "2016UMT1357",
                    "Branch": "META",
                    "Company": "Affine",
                    "Package": "6",
                    "Company visited on": "11 Oct",
                    "Result Date": "11 Oct"
                },
                {
                    "S.No.": "242",
                    "Name": "Thondala Sai Kumar",
                    "College ID": "2016UEC1106",
                    "Branch": "ECE",
                    "Company": "Samsung R&D Noida",
                    "Package": "12",
                    "Company visited on": "11 Oct",
                    "Result Date": "11 Oct"
                },
                {
                    "S.No.": "243",
                    "Name": "Aakash Gautam",
                    "College ID": "2016UMT1545",
                    "Branch": "META",
                    "Company": "Affine",
                    "Package": "6",
                    "Company visited on": "11 Oct",
                    "Result Date": "11 Oct"
                },
                {
                    "S.No.": "244",
                    "Name": "Kamal Dev Kumar",
                    "College ID": "2016UMT1286",
                    "Branch": "META",
                    "Company": "Cubastion Consulting",
                    "Package": "7.19",
                    "Company visited on": "12 Oct",
                    "Result Date": "12 Oct"
                },
                {
                    "S.No.": "245",
                    "Name": "Akshay Rawat",
                    "College ID": "2016UCP1026",
                    "Branch": "CSE",
                    "Company": "Cubastion Consulting",
                    "Package": "7.19",
                    "Company visited on": "12 Oct",
                    "Result Date": "12 Oct"
                },
                {
                    "S.No.": "246",
                    "Name": "Srisha Gupta",
                    "College ID": "2016UCE1719",
                    "Branch": "CIVIL",
                    "Company": "Cubastion Consulting",
                    "Package": "7.19",
                    "Company visited on": "12 Oct",
                    "Result Date": "12 Oct"
                },
                {
                    "S.No.": "247",
                    "Name": "Shubhankit Sirvaya",
                    "College ID": "2016UMT1703",
                    "Branch": "META",
                    "Company": "Cubastion Consulting",
                    "Package": "7.19",
                    "Company visited on": "12 Oct",
                    "Result Date": "12 Oct"
                },
                {
                    "S.No.": "248",
                    "Name": "Sunil Kumar",
                    "College ID": "2016UMT1225",
                    "Branch": "META",
                    "Company": "Nestaway",
                    "Package": "6.28",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "S.No.": "249",
                    "Name": "Rollin Fernandes",
                    "College ID": "2016UME1032",
                    "Branch": "MECH",
                    "Company": "Nestaway",
                    "Package": "6.28",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "S.No.": "250",
                    "Name": "Nitin Verma",
                    "College ID": "2016UMT1505",
                    "Branch": "META",
                    "Company": "Nestaway",
                    "Package": "6.28",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "S.No.": "251",
                    "Name": "Jayesh Garg",
                    "College ID": "2016UEE1656",
                    "Branch": "EEE",
                    "Company": "Nestaway",
                    "Package": "6.28",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "S.No.": "252",
                    "Name": "Ankit Shukla",
                    "College ID": "2015UAR1390",
                    "Branch": "ARCHI",
                    "Company": "Nestaway",
                    "Package": "6.28",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "S.No.": "253",
                    "Name": "Shaswat Kashyap",
                    "College ID": "2016UMT1562",
                    "Branch": "META",
                    "Company": "Nestaway",
                    "Package": "6.28",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "S.No.": "254",
                    "Name": "Harsh Vardhan Rao",
                    "College ID": "2016UEC1111",
                    "Branch": "ECE",
                    "Company": "Ericsson",
                    "Package": "6.5",
                    "Company visited on": "15 Oct",
                    "Result Date": "15 Oct"
                },
                {
                    "S.No.": "255",
                    "Name": "Bijay Mehta",
                    "College ID": "2016UEC1027",
                    "Branch": "ECE",
                    "Company": "Ericsson",
                    "Package": "6.5",
                    "Company visited on": "15 Oct",
                    "Result Date": "15 Oct"
                },
                {
                    "S.No.": "256",
                    "Name": "Anshul Jangid",
                    "College ID": "2016UME1208",
                    "Branch": "MECH",
                    "Company": "DCM Shriram",
                    "Package": "5.15",
                    "Company visited on": "18 Oct",
                    "Result Date": "18 Oct"
                },
                {
                    "S.No.": "257",
                    "Name": "Ravi Ghewani",
                    "College ID": "2016UCH1373",
                    "Branch": "CHEM",
                    "Company": "DCM Shriram",
                    "Package": "5.15",
                    "Company visited on": "18 Oct",
                    "Result Date": "18 Oct"
                },
                {
                    "S.No.": "258",
                    "Name": "Mouli Chithabathina",
                    "College ID": "2016UEC1647",
                    "Branch": "ECE",
                    "Company": "DMI Finance",
                    "Package": "6.5",
                    "Company visited on": "18 Oct",
                    "Result Date": "18 Oct"
                },
                {
                    "S.No.": "259",
                    "Name": "Vipin Kumar",
                    "College ID": "2016UEC1074",
                    "Branch": "ECE",
                    "Company": "DMI Finance",
                    "Package": "6.5",
                    "Company visited on": "18 Oct",
                    "Result Date": "18 Oct"
                },
                {
                    "S.No.": "260",
                    "Name": "Bharat Joshi",
                    "College ID": "2016UMT1531",
                    "Branch": "META",
                    "Company": "DCM Shriram",
                    "Package": "5.15",
                    "Company visited on": "18 Oct",
                    "Result Date": "18 Oct"
                },
                {
                    "S.No.": "261",
                    "Name": "Somesh Maurya",
                    "College ID": "2016UCE1178",
                    "Branch": "CIVIL",
                    "Company": "Samsung Engineering",
                    "Package": "6",
                    "Company visited on": "14 Oct",
                    "Result Date": "21 Oct"
                },
                {
                    "S.No.": "262",
                    "Name": "Vikalp Saini",
                    "College ID": "2016UME1206",
                    "Branch": "MECH",
                    "Company": "Samsung Engineering",
                    "Package": "6",
                    "Company visited on": "14 Oct",
                    "Result Date": "21 Oct"
                },
                {
                    "S.No.": "263",
                    "Name": "Avnish Aannd",
                    "College ID": "2016UME1190",
                    "Branch": "MECH",
                    "Company": "Samsung Engineering",
                    "Package": "6",
                    "Company visited on": "14 Oct",
                    "Result Date": "21 Oct"
                },
                {
                    "S.No.": "264",
                    "Name": "Vrinda Gupta",
                    "College ID": "2016UCH1540",
                    "Branch": "CHEM",
                    "Company": "Samsung Engineering",
                    "Package": "6",
                    "Company visited on": "14 Oct",
                    "Result Date": "21 Oct"
                },
                {
                    "S.No.": "265",
                    "Name": "Pranshu Pandey",
                    "College ID": "2016UEE1160",
                    "Branch": "EEE",
                    "Company": "Samsung Engineering",
                    "Package": "6",
                    "Company visited on": "14 Oct",
                    "Result Date": "21 Oct"
                },
                {
                    "S.No.": "266",
                    "Name": "Ridhika Kothari",
                    "College ID": "2016UCH1609",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "22 Oct",
                    "Result Date": "22 Oct"
                },
                {
                    "S.No.": "267",
                    "Name": "Leena Bhatia",
                    "College ID": "2016UCH1608",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "22 Oct",
                    "Result Date": "22 Oct"
                },
                {
                    "S.No.": "268",
                    "Name": "Shruti Jain",
                    "College ID": "2016UCH1673",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "22 Oct",
                    "Result Date": "22 Oct"
                },
                {
                    "S.No.": "269",
                    "Name": "Anshu Mehta",
                    "College ID": "2016UCH1200",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "22 Oct",
                    "Result Date": "22 Oct"
                },
                {
                    "S.No.": "270",
                    "Name": "Pushpinder Goyal",
                    "College ID": "2016UCH1640",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "22 Oct",
                    "Result Date": "22 Oct"
                },
                {
                    "S.No.": "271",
                    "Name": "Raushan Kumar",
                    "College ID": "2016UME1262",
                    "Branch": "MECH",
                    "Company": "Voylla Fashions Pvt Ltd",
                    "Package": "5",
                    "Company visited on": "22 Oct",
                    "Result Date": "23 Oct"
                },
                {
                    "S.No.": "272",
                    "Name": "Amit Kumar",
                    "College ID": "2016UEE1613",
                    "Branch": "EEE",
                    "Company": "Voylla Fashions Pvt Ltd",
                    "Package": "5",
                    "Company visited on": "23 Oct",
                    "Result Date": "24 Oct"
                },
                {
                    "S.No.": "273",
                    "Name": "Vivek Kumar",
                    "College ID": "2016UME1201",
                    "Branch": "MECH",
                    "Company": "TCE",
                    "Package": "4.5",
                    "Company visited on": "24 Oct",
                    "Result Date": "25 Oct"
                },
                {
                    "S.No.": "274",
                    "Name": "Ankit Mittal",
                    "College ID": "2016UCE1202",
                    "Branch": "CIVIL",
                    "Company": "L&T Construction",
                    "Package": "6",
                    "Company visited on": "24 Oct",
                    "Result Date": "25 Oct",
                    "Date": "1 Nov"
                },
                {
                    "S.No.": "275",
                    "Name": "Abhinandan Adarsh Lalit",
                    "College ID": "2016UCE1176",
                    "Branch": "CIVIL",
                    "Company": "TCE",
                    "Package": "4.5",
                    "Company visited on": "24 Oct",
                    "Result Date": "25 Oct"
                },
                {
                    "S.No.": "276",
                    "Name": "Brijesh Kumar",
                    "College ID": "2016UEE1140",
                    "Branch": "EEE",
                    "Company": "TCE",
                    "Package": "4.5",
                    "Company visited on": "24 Oct",
                    "Result Date": "25 Oct"
                },
                {
                    "S.No.": "277",
                    "Name": "Vivek Kumar",
                    "College ID": "2016UEE1405",
                    "Branch": "EEE",
                    "Company": "TCE",
                    "Package": "4.5",
                    "Company visited on": "24 Oct",
                    "Result Date": "25 Oct"
                },
                {
                    "S.No.": "278",
                    "Name": "Prashant Kumar",
                    "College ID": "2016UCP1132",
                    "Branch": "CSE",
                    "Company": "L&T Infotech",
                    "Package": "9",
                    "Company visited on": "11 Oct",
                    "Result Date": "25 Oct"
                },
                {
                    "S.No.": "279",
                    "Name": "Abhimanyu Abhimanyu",
                    "College ID": "2016UCE1535",
                    "Branch": "CIVIL",
                    "Company": "L&T Construction",
                    "Package": "6",
                    "Company visited on": "19 Oct",
                    "Result Date": "1 Nov"
                },
                {
                    "S.No.": "280",
                    "Name": "Sanat Dutta",
                    "College ID": "2016UCE1204",
                    "Branch": "CIVIL",
                    "Company": "L&T Construction",
                    "Package": "6",
                    "Company visited on": "19 Oct",
                    "Result Date": "1 Nov"
                },
                {
                    "S.No.": "281",
                    "Name": "Sunil Kumar",
                    "College ID": "2016UME1193",
                    "Branch": "MECH",
                    "Company": "L&T Construction",
                    "Package": "6",
                    "Company visited on": "19 Oct",
                    "Result Date": "1 Nov"
                },
                {
                    "S.No.": "282",
                    "Name": "Ashwini Godghate",
                    "College ID": "2016UEE1077",
                    "Branch": "EEE",
                    "Company": "Q3 Technologies",
                    "Package": "8.5",
                    "Company visited on": "6 Nov",
                    "Result Date": "6 Nov"
                },
                {
                    "S.No.": "283",
                    "Name": "Mayank Gupta",
                    "College ID": "2016UMT1491",
                    "Branch": "META",
                    "Company": "JSL",
                    "Package": "6",
                    "Company visited on": "7 Nov",
                    "Result Date": "7 Nov"
                },
                {
                    "S.No.": "284",
                    "Name": "Ajay Sain",
                    "College ID": "2016UME1218",
                    "Branch": "MECH",
                    "Company": "JSL",
                    "Package": "6",
                    "Company visited on": "7 Nov",
                    "Result Date": "7 Nov"
                },
                {
                    "S.No.": "285",
                    "Name": "Siddarth Singh",
                    "College ID": "2016UME1165",
                    "Branch": "MECH",
                    "Company": "JSL",
                    "Package": "6",
                    "Company visited on": "7 Nov",
                    "Result Date": "7 Nov"
                },
                {
                    "S.No.": "286",
                    "Name": "Saurya Raj Gupta",
                    "College ID": "2016UEE1199",
                    "Branch": "EEE",
                    "Company": "JSL",
                    "Package": "6",
                    "Company visited on": "7 Nov",
                    "Result Date": "7 Nov"
                },
                {
                    "S.No.": "287",
                    "Name": "Mahendra Pratap Singh Meena",
                    "College ID": "2016UMT1480",
                    "Branch": "META",
                    "Company": "JSL",
                    "Package": "6",
                    "Company visited on": "7 Nov",
                    "Result Date": "7 Nov"
                },
                {
                    "S.No.": "288",
                    "Name": "Shivam Singh",
                    "College ID": "2016UCE1541",
                    "Branch": "CIVIL",
                    "Company": "Xion",
                    "Package": "8.5",
                    "Company visited on": "9 Nov",
                    "Result Date": "9 Nov"
                },
                {
                    "S.No.": "289",
                    "Name": "Rahul Kumar Dubey",
                    "College ID": "2016UEC1083",
                    "Branch": "ECE",
                    "Company": "Truminds Software Systems",
                    "Package": "5.5",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "290",
                    "Name": "Vaibhav Vashishth",
                    "College ID": "2016UME1299",
                    "Branch": "MECH",
                    "Company": "Suzuki Motor Gujarat",
                    "Package": "5.75",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "291",
                    "Name": "Amit Chauhan",
                    "College ID": "2016UME1268",
                    "Branch": "MECH",
                    "Company": "Suzuki Motor Gujarat",
                    "Package": "5.75",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "292",
                    "Name": "Muskan Sethi",
                    "College ID": "2016UCH1614",
                    "Branch": "CHEM",
                    "Company": "Suzuki Motor Gujarat",
                    "Package": "5.75",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "293",
                    "Name": "Annu Nain",
                    "College ID": "2016UCH1689",
                    "Branch": "CHEM",
                    "Company": "Suzuki Motor Gujarat",
                    "Package": "5.75",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "294",
                    "Name": "Amarapalli Sai Charan Naidu",
                    "College ID": "2016UME1156",
                    "Branch": "MECH",
                    "Company": "Oyo Life",
                    "Package": "5",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "295",
                    "Name": "Garima Chaudhary",
                    "College ID": "2015UAR1145",
                    "Branch": "ARCHI",
                    "Company": "Oyo Life",
                    "Package": "5",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "296",
                    "Name": "Preeti Nagar",
                    "College ID": "2016UCE1478",
                    "Branch": "CIVIL",
                    "Company": "Oyo Life",
                    "Package": "5",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "297",
                    "Name": "Akshat Mathur",
                    "College ID": "2016UMT1627",
                    "Branch": "META",
                    "Company": "Oyo Life",
                    "Package": "5",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "298",
                    "Name": "Monu Kumar ",
                    "College ID": "2016UMT1670",
                    "Branch": "META",
                    "Company": "Oyo Life",
                    "Package": "5",
                    "Company visited on": "15 Nov",
                    "Result Date": "15 Nov"
                },
                {
                    "S.No.": "299",
                    "Name": "Prasann Baldua",
                    "College ID": "2016UMT1515",
                    "Branch": "META",
                    "Company": "NAV Back Office",
                    "Package": "7.5",
                    "Company visited on": "18 Nov",
                    "Result Date": "20 Nov"
                },
                {
                    "S.No.": "300",
                    "Name": "Suraj Sharma",
                    "College ID": "2016UME1284",
                    "Branch": "MECH",
                    "Company": "Applied materials",
                    "Package": "8.53",
                    "Company visited on": "19 Nov",
                    "Result Date": "20 Nov"
                },
                {
                    "S.No.": "301",
                    "Name": "Ashok Singh Chauhan",
                    "College ID": "2016UME1282",
                    "Branch": "MECH",
                    "Company": "Applied materials",
                    "Package": "8.53",
                    "Company visited on": "19 Nov",
                    "Result Date": "20 Nov"
                },
                {
                    "S.No.": "302",
                    "Name": "Rohan Mittal",
                    "College ID": "2016UME1248",
                    "Branch": "MECH",
                    "Company": "Applied materials",
                    "Package": "8.53",
                    "Company visited on": "19 Nov",
                    "Result Date": "20 Nov"
                },
                {
                    "S.No.": "303",
                    "Name": "Rahul Parewa",
                    "College ID": "2016UCH1110",
                    "Branch": "CHEM",
                    "Company": "NAV Back Office",
                    "Package": "7.5",
                    "Company visited on": "18 Nov",
                    "Result Date": "20 Nov"
                },
                {
                    "S.No.": "304",
                    "Name": "Ajit Kumar Rai",
                    "College ID": "2016UCP1433",
                    "Branch": "CSE",
                    "Company": "NAV Back Office",
                    "Package": "7.5",
                    "Company visited on": "18 Nov",
                    "Result Date": "20 Nov"
                },
                {
                    "S.No.": "305",
                    "Name": "Abhay singh panwar",
                    "College ID": "2016UEE1671",
                    "Branch": "EEE",
                    "Company": "Tata Steel BSL Limited",
                    "Package": "4.8",
                    "Company visited on": "21 Nov",
                    "Result Date": "21 Nov"
                },
                {
                    "S.No.": "306",
                    "Name": "Ravi Sharma",
                    "College ID": "2016UME1224",
                    "Branch": "MECH",
                    "Company": "Tata Steel BSL Limited",
                    "Package": "4.8",
                    "Company visited on": "21 Nov",
                    "Result Date": "21 Nov"
                },
                {
                    "S.No.": "307",
                    "Name": "Akash Gupta",
                    "College ID": "2016UME1588",
                    "Branch": "MECH",
                    "Company": "Tata Steel BSL Limited",
                    "Package": "4.8",
                    "Company visited on": "21 Nov",
                    "Result Date": "21 Nov"
                },
                {
                    "S.No.": "308",
                    "Name": "Shubham Kumar",
                    "College ID": "2016UEE1366",
                    "Branch": "EEE",
                    "Company": "Polestar Solutions",
                    "Package": "6.9",
                    "Company visited on": "16 Nov",
                    "Result Date": "22 Nov"
                },
                {
                    "S.No.": "309",
                    "Name": "Mohit Pratap Singh Kushwaha",
                    "College ID": "2016UMT1602",
                    "Branch": "META",
                    "Company": "Polestar Solutions",
                    "Package": "6.9",
                    "Company visited on": "16 Nov",
                    "Result Date": "22 Nov"
                },
                {
                    "S.No.": "310",
                    "Name": "Prerna Palawat",
                    "College ID": "2015UAR1164",
                    "Branch": "ARCHI",
                    "Company": "Godrej",
                    "Package": "5.5",
                    "Company visited on": "23 Nov",
                    "Result Date": "23 Nov"
                },
                {
                    "S.No.": "311",
                    "Name": "Swarup Singh",
                    "College ID": "2016UME1283",
                    "Branch": "MECH",
                    "Company": "Godrej",
                    "Package": "5.5",
                    "Company visited on": "23 Nov",
                    "Result Date": "23 Nov"
                },
                {
                    "S.No.": "312",
                    "Name": "Shreya Gupta ",
                    "College ID": "2016UEE1428",
                    "Branch": "EEE",
                    "Company": "Texas Instruments ",
                    "Package": "20.88",
                    "Company visited on": "PPO",
                    "Result Date": "30 Nov"
                },
                {
                    "S.No.": "313",
                    "Name": "Tushar Singh Chauhan",
                    "College ID": "2016UME1519",
                    "Branch": "MECH",
                    "Company": "Maruti Suzuki",
                    "Package": "8.4",
                    "Company visited on": "12 Dec",
                    "Result Date": "12 Dec"
                },
                {
                    "S.No.": "314",
                    "Name": "Lohit Anaparthi",
                    "College ID": "2016UME1347",
                    "Branch": "MECH",
                    "Company": "Maruti Suzuki",
                    "Package": "8.4",
                    "Company visited on": "12 Dec",
                    "Result Date": "12 Dec"
                },
                {
                    "S.No.": "315",
                    "Name": "Punit Kumar",
                    "College ID": "2016UME1269",
                    "Branch": "MECH",
                    "Company": "Maruti Suzuki",
                    "Package": "8.4",
                    "Company visited on": "12 Dec",
                    "Result Date": "12 Dec"
                },
                {
                    "S.No.": "316",
                    "Name": "Manish Kumar",
                    "College ID": "2016UME1259",
                    "Branch": "MECH",
                    "Company": "Maruti Suzuki",
                    "Package": "8.4",
                    "Company visited on": "12 Dec",
                    "Result Date": "12 Dec"
                },
                {
                    "S.No.": "317",
                    "Name": "Prabhakar Tripathy",
                    "College ID": "2016UME1362",
                    "Branch": "MECH",
                    "Company": "Maruti Suzuki",
                    "Package": "8.4",
                    "Company visited on": "12 Dec",
                    "Result Date": "12 Dec"
                },
                {
                    "S.No.": "318",
                    "Name": "Raju Raj Purohit",
                    "College ID": "2016UEC1146",
                    "Branch": "ECE",
                    "Company": "ResearchWire",
                    "Package": "5",
                    "Company visited on": "10 Dec",
                    "Result Date": "13 Dec"
                },
                {
                    "S.No.": "319",
                    "Name": "Kriti Manocha",
                    "College ID": "2016UCH1551",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "13 Dec",
                    "Result Date": "13 Dec"
                },
                {
                    "S.No.": "320",
                    "Name": "Sachin Singh Naruka",
                    "College ID": "2016UCH1592",
                    "Branch": "CHEM",
                    "Company": "Reliance Industries",
                    "Package": "10.5",
                    "Company visited on": "13 Dec",
                    "Result Date": "13 Dec"
                },
                {
                    "S.No.": "321",
                    "Name": "Gajendra Nagar",
                    "College ID": "2016UME1308",
                    "Branch": "MECH",
                    "Company": "Avanti Learning",
                    "Package": "5",
                    "Company visited on": "11 Dec",
                    "Result Date": "14 Dec"
                },
                {
                    "S.No.": "322",
                    "Name": "Sadab Khan",
                    "College ID": "2016UMT1581",
                    "Branch": "META",
                    "Company": "Avanti Learning",
                    "Package": "5",
                    "Company visited on": "11 Dec",
                    "Result Date": "14 Dec"
                },
                {
                    "S.No.": "323",
                    "Name": "Devnath Nair",
                    "College ID": "2016UME1015",
                    "Branch": "MECH",
                    "Company": "Addverb",
                    "Package": "10.32",
                    "Company visited on": "PPO",
                    "Result Date": "6 Dec"
                },
                {
                    "S.No.": "324",
                    "Name": "Jayesh Sharma",
                    "College ID": "2016UMT1499",
                    "Branch": "META",
                    "Company": "Futures First",
                    "Package": "11",
                    "Company visited on": "PPO",
                    "Result Date": "18 Dec"
                },
                {
                    "S.No.": "325",
                    "Name": "Deepanshu Vijay",
                    "College ID": "2016UCP1439",
                    "Branch": "CSE",
                    "Company": "Nucleus software",
                    "Package": "6.5",
                    "Company visited on": "4 Nov",
                    "Result Date": "23 Dec"
                },
                {
                    "S.No.": "326",
                    "Name": "Shivam Kumar",
                    "College ID": "2016UEE1341",
                    "Branch": "EEE",
                    "Company": "CESC Rajasthan",
                    "Package": "5",
                    "Company visited on": "3 Feb",
                    "Result Date": "3 Jan"
                },
                {
                    "S.No.": "327",
                    "Name": "Nitin Sharma",
                    "College ID": "2016UEE1380",
                    "Branch": "EEE",
                    "Company": "CESC Rajasthan",
                    "Package": "5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Jan"
                },
                {
                    "S.No.": "328",
                    "Name": "Siddharath Ranjan",
                    "College ID": "2016UMT1408",
                    "Branch": "META",
                    "Company": "SKF",
                    "Package": "5.2",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan",
                    "Date": "7 Jan"
                },
                {
                    "S.No.": "329",
                    "Name": "Devada Mahesh",
                    "College ID": "2016UMT1435",
                    "Branch": "META",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "330",
                    "Name": "Praagya Shringi",
                    "College ID": "2016UMT1494",
                    "Branch": "META",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "331",
                    "Name": "Sandeep Kumar ",
                    "College ID": "2016UME1682",
                    "Branch": "MECH",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "332",
                    "Name": "Rahul Meena",
                    "College ID": "2016UME1207",
                    "Branch": "MECH",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "333",
                    "Name": "Kajol Meena",
                    "College ID": "2016UME1686",
                    "Branch": "MECH",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "334",
                    "Name": "Ashish Kumawat",
                    "College ID": "2016UME1272",
                    "Branch": "MECH",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "335",
                    "Name": "Shankar Lal Yadav",
                    "College ID": "2016UEE1691",
                    "Branch": "EEE",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "336",
                    "Name": "Rubal Siyag",
                    "College ID": "2016UMT1638",
                    "Branch": "META",
                    "Company": "ArcelorMittal Nipon Steel",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "337",
                    "Name": "Rahul Joshi",
                    "College ID": "2016UME1466",
                    "Branch": "MECH",
                    "Company": "SKF",
                    "Package": "5.2",
                    "Company visited on": "7 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "338",
                    "Name": "Sheetal Minz",
                    "College ID": "2016UCH1518",
                    "Branch": "META",
                    "Company": "Raam Group",
                    "Package": "4.8",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "339",
                    "Name": "Mayank Mittal",
                    "College ID": "2016UEE1496",
                    "Branch": "EEE",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "340",
                    "Name": "Raviranjan Kumar",
                    "College ID": "2016UEE1434",
                    "Branch": "EEE",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "341",
                    "Name": "Anjali Jaiswal",
                    "College ID": "2016UEE1669",
                    "Branch": "EEE",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "342",
                    "Name": "Paras Agarwal",
                    "College ID": "2016UCE1242",
                    "Branch": "CIVIL",
                    "Company": "JWIL",
                    "Package": "4.5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan",
                    "Date": "14 Jan"
                },
                {
                    "S.No.": "343",
                    "Name": "Uday Chandra Kumar",
                    "College ID": "2016UCE1616",
                    "Branch": "CIVIL",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "344",
                    "Name": "Prashant Sankhala",
                    "College ID": "2016UME1566",
                    "Branch": "MECH",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "345",
                    "Name": "K.S.R Sai Praveen Reddy",
                    "College ID": "2016UME1307",
                    "Branch": "MECH",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "346",
                    "Name": "Krishna Kant Nayak",
                    "College ID": "2016UCH1239",
                    "Branch": "CHEM",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "347",
                    "Name": "Mohit Gupta",
                    "College ID": "2016UCH1461",
                    "Branch": "CHEM",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "348",
                    "Name": "Vinayshree",
                    "College ID": "2016UCH1567",
                    "Branch": "CHEM",
                    "Company": "Heidelberg Cement",
                    "Package": "5",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan"
                },
                {
                    "S.No.": "349",
                    "Name": "Jitendra Choudhary",
                    "College ID": "2016UME1665",
                    "Branch": "MECH",
                    "Company": "JWIL",
                    "Package": "4.5",
                    "Company visited on": "10 Dec",
                    "Result Date": "14 Jan"
                },
                {
                    "S.No.": "350",
                    "Name": "Vikas Sharma",
                    "College ID": "2016UEE1365",
                    "Branch": "EEE",
                    "Company": "Coromandel",
                    "Package": "6",
                    "Company visited on": "10 Jan",
                    "Result Date": "16 Jan"
                },
                {
                    "S.No.": "351",
                    "Name": "Sumit Choudhary",
                    "College ID": "2016UCH1553",
                    "Branch": "CHEM",
                    "Company": "McDermott",
                    "Package": "6",
                    "Company visited on": "17 Jan",
                    "Result Date": "17 Jan"
                },
                {
                    "S.No.": "352",
                    "Name": "Ravi Fulwa",
                    "College ID": "2016UCH1228",
                    "Branch": "CHEM",
                    "Company": "McDermott",
                    "Package": "6",
                    "Company visited on": "17 Jan",
                    "Result Date": "17 Jan"
                },
                {
                    "S.No.": "353",
                    "Name": "Khushabu Yadav",
                    "College ID": "2016UCH1624",
                    "Branch": "CHEM",
                    "Company": "Pie Infocomm",
                    "Package": "4.5",
                    "Company visited on": "23 Jan",
                    "Result Date": "24 Jan"
                },
                {
                    "S.No.": "354",
                    "Name": "RAJESH KANAUJIA",
                    "College ID": "2015uar1523",
                    "Branch": "ARCHI",
                    "Company": "Pie Infocomm",
                    "Package": "4.5",
                    "Company visited on": "23 Jan",
                    "Result Date": "24 Jan"
                },
                {
                    "S.No.": "355",
                    "Name": "SANGHPRIY GAUTAM",
                    "College ID": "2015uar1048",
                    "Branch": "ARCHI",
                    "Company": "Pie Infocomm",
                    "Package": "4.5",
                    "Company visited on": "23 Jan",
                    "Result Date": "24 Jan"
                },
                {
                    "S.No.": "356",
                    "Name": "SUSHANT KUMAR",
                    "College ID": "2015UAR1585",
                    "Branch": "ARCHI",
                    "Company": "Pie Infocomm",
                    "Package": "4.5",
                    "Company visited on": "23 Jan",
                    "Result Date": "24 Jan"
                },
                {
                    "S.No.": "357",
                    "Name": "Aasim Anis",
                    "College ID": "2016UME1028",
                    "Branch": "MECH",
                    "Company": "JCB",
                    "Package": "5.5",
                    "Result Date": "29 Jan"
                },
                {
                    "S.No.": "358",
                    "Name": "Parag Devendra Pise",
                    "College ID": "2016UMT1464",
                    "Branch": "META",
                    "Company": "Escorts Agri Machinery",
                    "Package": "5",
                    "Company visited on": "3 Feb",
                    "Result Date": "3 Feb"
                },
                {
                    "S.No.": "359",
                    "Name": "Ankita Pastor",
                    "College ID": "2016UMT1569",
                    "Branch": "META",
                    "Company": "Escorts Agri Machinery",
                    "Package": "5",
                    "Company visited on": "3 Feb",
                    "Result Date": "3 Feb"
                },
                {
                    "S.No.": "360",
                    "Name": "Priyanshu Singh",
                    "College ID": "2016UCP1393",
                    "Branch": "CSE",
                    "Company": "Intellipaat",
                    "Package": "5.4",
                    "Company visited on": "27 Jan",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "361",
                    "Name": "Harshit Goel",
                    "College ID": "2016UME1188",
                    "Branch": "MECH",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "362",
                    "Name": "Pradeep Kumar",
                    "College ID": "2016UEE1264",
                    "Branch": "EEE",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "363",
                    "Name": "Ragini Gupta",
                    "College ID": "2016UEE1386",
                    "Branch": "EEE",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "364",
                    "Name": "Divya Sharma",
                    "College ID": "2016UCH1517",
                    "Branch": "CHEM",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "365",
                    "Name": "Abhishek Kumar",
                    "College ID": "2016UCH1584",
                    "Branch": "CHEM",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "366",
                    "Name": "Shubhanshu Bansal",
                    "College ID": "2016UCH1580",
                    "Branch": "CHEM",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "367",
                    "Name": "Deepak Kumar",
                    "College ID": "2016UCH1579",
                    "Branch": "CHEM",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "368",
                    "Name": "Pradhum Mishra",
                    "College ID": "2016UCH1465",
                    "Branch": "CHEM",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "369",
                    "Name": "Chinmey Bohra",
                    "College ID": "2016UCH1598",
                    "Branch": "CHEM",
                    "Company": "Aarti Industries Limited",
                    "Package": "5.5",
                    "Company visited on": "3 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "370",
                    "Name": "Soumya Kumar Rai",
                    "College ID": "2016UMT1497",
                    "Branch": "META",
                    "Company": "HMEL",
                    "Package": "6.5",
                    "Company visited on": "4 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "371",
                    "Name": "Chandrika Meena",
                    "College ID": "2016UCH1251",
                    "Branch": "CHEM",
                    "Company": "HMEL",
                    "Package": "6.5",
                    "Company visited on": "4 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "372",
                    "Name": "Robin Sonkar",
                    "College ID": "2016UCH1574",
                    "Branch": "CHEM",
                    "Company": "HMEL",
                    "Package": "6.5",
                    "Company visited on": "4 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "373",
                    "Name": "Vivek Kumar",
                    "College ID": "2016UCH1575",
                    "Branch": "CHEM",
                    "Company": "HMEL",
                    "Package": "6.5",
                    "Company visited on": "4 Feb",
                    "Result Date": "4 Feb"
                },
                {
                    "S.No.": "374",
                    "Name": "Leenasharee Chaudhary",
                    "College ID": "2016UEC1013",
                    "Branch": "ECE",
                    "Company": "SAGACIOUS IP",
                    "Package": "4.2",
                    "Company visited on": "28 Jan",
                    "Result Date": "7 Feb"
                },
                {
                    "S.No.": "375",
                    "Name": "Jitendra Kumar Maurya",
                    "College ID": "2016UME1289",
                    "Branch": "MECH",
                    "Company": "TATA iQ",
                    "Package": "6.5",
                    "Company visited on": "9 Jan",
                    "Result Date": "15 Feb"
                },
                {
                    "S.No.": "376",
                    "Name": "Shivang Mishra",
                    "College ID": "2016UMT1559",
                    "Branch": "META",
                    "Company": "SpeedLabs",
                    "Package": "7.46",
                    "Company visited on": "20 Feb",
                    "Result Date": "21 Feb"
                },
                {
                    "S.No.": "377",
                    "Name": "Sanyam Mehta",
                    "College ID": "2016UMT1668",
                    "Branch": "META",
                    "Company": "SpeedLabs",
                    "Package": "7.46",
                    "Company visited on": "20 Feb",
                    "Result Date": "21 Feb"
                },
                {
                    "S.No.": "378",
                    "Name": "Yash Bhardwaj",
                    "College ID": "2016UEE1179",
                    "Branch": "EEE",
                    "Company": "Maruti Suzuki",
                    "Package": "8.4",
                    "Company visited on": "19 Feb (MSIL Office)",
                    "Result Date": "21 Feb"
                },
                {
                    "S.No.": "379",
                    "Name": "Kunal Agarwal",
                    "College ID": "2016UEE1344",
                    "Branch": "EEE",
                    "Company": "Maruti Suzuki",
                    "Package": "8.4",
                    "Company visited on": "19 Feb (MSIL Office)",
                    "Result Date": "21 Feb"
                },
                {
                    "S.No.": "380",
                    "Name": "RAVI KUMAR SHARMA",
                    "College ID": "2016UCE1161",
                    "Branch": "CIVIL",
                    "Company": "GRIL",
                    "Package": "4",
                    "Company visited on": "11 Feb",
                    "Result Date": "25 Feb"
                },
                {
                    "S.No.": "381",
                    "Name": "ANKIT KUMAR GOYAL",
                    "College ID": "2016UCE1258",
                    "Branch": "CIVIL",
                    "Company": "GRIL",
                    "Package": "4",
                    "Company visited on": "11 Feb",
                    "Result Date": "25 Feb"
                },
                {
                    "S.No.": "382",
                    "Name": "MANU SINGH MEENA",
                    "College ID": "2016UCE1543",
                    "Branch": "CIVIL",
                    "Company": "GRIL",
                    "Package": "4",
                    "Company visited on": "11 Feb",
                    "Result Date": "25 Feb"
                },
                {
                    "S.No.": "383",
                    "Name": "Chhavi Agarwal",
                    "College ID": "2016UCH1053",
                    "Branch": "CHEM",
                    "Company": "BORL",
                    "Package": "5.4",
                    "Company visited on": "18 Feb (BORL Office)",
                    "Result Date": "26 Feb"
                },
                {
                    "S.No.": "384",
                    "Name": "Deepak Kushwaha",
                    "College ID": "2016UCH1484",
                    "Branch": "CHEM",
                    "Company": "JK Group",
                    "Package": "6.25",
                    "Company visited on": "18 Feb",
                    "Result Date": "2 Mar"
                },
                {
                    "S.No.": "385",
                    "Name": "Nilma Dewat",
                    "College ID": "2016UCE1620",
                    "Branch": "CIVIL",
                    "Company": "KEC",
                    "Package": "4.75",
                    "Company visited on": "6 Mar",
                    "Result Date": "11 Mar"
                },
                {
                    "S.No.": "386",
                    "Name": "Shivam Singh",
                    "College ID": "2016UCE1541",
                    "Branch": "CIVIL",
                    "Company": "KEC",
                    "Package": "4.75",
                    "Company visited on": "6 Mar",
                    "Result Date": "11 Mar"
                },
                {
                    "S.No.": "387",
                    "Name": "Anuj Kumar Pancal",
                    "College ID": "2016UCE1502",
                    "Branch": "CIVIL",
                    "Company": "KEC",
                    "Package": "4.75",
                    "Company visited on": "6 Mar",
                    "Result Date": "11 Mar"
                },
                {
                    "S.No.": "388",
                    "Name": "Shubham Verma",
                    "College ID": "2016UEE1387",
                    "Branch": "EEE",
                    "Company": "TATA POWER",
                    "Package": "5.5",
                    "Company visited on": "17 Mar (VC)",
                    "Result Date": "21 Mar"
                },
                {
                    "S.No.": "389",
                    "Name": "Ruchi Goswami",
                    "College ID": "2016UEE1343",
                    "Branch": "EEE",
                    "Company": "TATA POWER",
                    "Package": "5.5",
                    "Company visited on": "17 Mar (VC)",
                    "Result Date": "21 Mar"
                },
                {
                    "S.No.": "390",
                    "Name": "Asha Jyoti",
                    "College ID": "2016UEC1492",
                    "Branch": "ECE",
                    "Company": "BJYUS",
                    "Package": "10",
                    "Company visited on": "24 Apr",
                    "Result Date": "24 Apr"
                },
                {
                    "S.No.": "391",
                    "Name": "Harsh Kumar Saini",
                    "College ID": "2016UME1246",
                    "Branch": "MECH",
                    "Company": "UNSCHOOL",
                    "Package": "5",
                    "Company visited on": "27 Apr",
                    "Result Date": "27 Apr"
                },
                {
                    "S.No.": "392",
                    "Name": "Himani Jain",
                    "College ID": "2016UEC1683",
                    "Branch": "ECE",
                    "Company": "UNSCHOOL",
                    "Package": "5",
                    "Company visited on": "27 Apr",
                    "Result Date": "27 Apr"
                }
            ]
        },
        {
            "B.Tech. - Internship": [
                {
                    "S.No.": "1",
                    "Name": "Surya Prakash ",
                    "College ID": "2017uec1231",
                    "Branch": "ECE",
                    "Company": "De Shaw",
                    "Stipend": "1.5L",
                    "Company visited on": "31 July",
                    "Result Date": "1 August",
                    "Duration": "2 months",
                    "Internship Start Date": "20 April",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "2",
                    "Name": "Ritika Mor",
                    "College ID": "2017uec1194",
                    "Branch": "ECE",
                    "Company": "De Shaw",
                    "Stipend": "1.5L",
                    "Company visited on": "31 July",
                    "Result Date": "1 August",
                    "Duration": "2 months",
                    "Internship Start Date": "20 April",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "3",
                    "Name": "Himanshu Gwalani",
                    "College ID": "2017ucp1356",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Stipend": "75k",
                    "Company visited on": "31 July",
                    "Result Date": "1st August",
                    "Duration": "2 months",
                    "Internship Start Date": "25 May",
                    "Remarks": "Notified directly to students"
                },
                {
                    "S.No.": "4",
                    "Name": "Divya Sodani",
                    "College ID": "2017ucp1188",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Stipend": "75k",
                    "Company visited on": "31 July",
                    "Result Date": "1st August",
                    "Duration": "2 months",
                    "Internship Start Date": "25 May",
                    "Remarks": "Notified directly to students"
                },
                {
                    "S.No.": "5",
                    "Name": "Saloni Goyal",
                    "College ID": "2017ucp1061",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Stipend": "75k",
                    "Company visited on": "31 July",
                    "Result Date": "1st August",
                    "Duration": "2 months",
                    "Internship Start Date": "25 May",
                    "Remarks": "Notified directly to students"
                },
                {
                    "S.No.": "6",
                    "Name": "PRANSHU KHANDELWAL",
                    "College ID": "2017ucp1200",
                    "Branch": "CSE",
                    "Company": "Salesforce",
                    "Stipend": "75k",
                    "Company visited on": "31 July",
                    "Result Date": "1st August",
                    "Duration": "2 months",
                    "Internship Start Date": "25 May",
                    "Remarks": "Notified directly to students"
                },
                {
                    "S.No.": "7",
                    "Name": "Dixit Kumar Jain",
                    "College ID": "2017UCP1401",
                    "Branch": "CSE",
                    "Company": "Flipkart",
                    "Stipend": "50k",
                    "Company visited on": "1st August",
                    "Result Date": "2nd August",
                    "Duration": "2  months",
                    "Internship Start Date": "25 May",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "8",
                    "Name": "Tapan Goyal",
                    "College ID": "2017ucp1582",
                    "Branch": "CSE",
                    "Company": "Arcesium",
                    "Stipend": "1L",
                    "Company visited on": "1st August",
                    "Result Date": "1st August",
                    "Duration": "2 months",
                    "Internship Start Date": "4 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "9",
                    "Name": "Pratiksha",
                    "College ID": "2017uec1619",
                    "Branch": "ECE",
                    "Company": "Arcesium",
                    "Stipend": "1L",
                    "Company visited on": "1st August",
                    "Result Date": "1st August",
                    "Duration": "2 months",
                    "Internship Start Date": "4 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "10",
                    "Name": "Devang Mittal",
                    "College ID": "2017ume1503",
                    "Branch": "MECH",
                    "Company": "Bajaj",
                    "Stipend": "20k",
                    "Company visited on": "3rd August",
                    "Result Date": "3rd August",
                    "Duration": "2 months",
                    "Remarks": "No information; Remote Internship from June 1."
                },
                {
                    "S.No.": "11",
                    "Name": "Harshit Soni",
                    "College ID": "2017ucp1029",
                    "Branch": "CSE",
                    "Company": "Goldman",
                    "Stipend": "75k",
                    "Company visited on": "3rd August",
                    "Result Date": "3rd August",
                    "Duration": "2 months",
                    "Internship Start Date": "18 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "12",
                    "Name": "Kaustubh Mani Kanaujia",
                    "College ID": "2017uec1604",
                    "Branch": "ECE",
                    "Company": "Goldman",
                    "Stipend": "75k",
                    "Company visited on": "3rd August",
                    "Result Date": "3rd August",
                    "Duration": "2 months",
                    "Internship Start Date": "18 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "13",
                    "Name": "Ishika",
                    "College ID": "2017ucp1566",
                    "Branch": "CSE",
                    "Company": "Goldman",
                    "Stipend": "75k",
                    "Company visited on": "3rd August",
                    "Result Date": "3rd August",
                    "Duration": "2 months",
                    "Internship Start Date": "18 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "14",
                    "Name": "Bhuvanagiri Venkata Srividya",
                    "College ID": "2017ucp1011",
                    "Branch": "CSE",
                    "Company": "Goldman",
                    "Stipend": "75k",
                    "Company visited on": "3rd August",
                    "Result Date": "3rd August",
                    "Duration": "2 months",
                    "Internship Start Date": "18 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "15",
                    "Name": "Krishna Agarwal",
                    "College ID": "2017uec1055",
                    "Branch": "ECE",
                    "Company": "Goldman",
                    "Stipend": "75k",
                    "Company visited on": "3rd August",
                    "Result Date": "3rd August",
                    "Duration": "2 months",
                    "Internship Start Date": "18 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "16",
                    "Name": "Vasu Verma",
                    "College ID": "2017uec1236",
                    "Branch": "ECE",
                    "Company": "Texas",
                    "Stipend": "45k",
                    "Company visited on": "2nd & 4th August",
                    "Result Date": "4th August",
                    "Duration": "6 months",
                    "Internship Start Date": "4 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "17",
                    "Name": "Ayush Mangla",
                    "College ID": "2017uec1623",
                    "Branch": "ECE",
                    "Company": "Texas",
                    "Stipend": "45k",
                    "Company visited on": "2nd & 4th August",
                    "Result Date": "4th August",
                    "Duration": "6 months",
                    "Internship Start Date": "4 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "18",
                    "Name": "Gaurab Dahit",
                    "College ID": "2017ucp1313",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "19",
                    "Name": "Akshat Garg",
                    "College ID": "2017uec1537",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "20",
                    "Name": "Dhruv Golani",
                    "College ID": "2017uec1056",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "21",
                    "Name": "Rahul Goswami",
                    "College ID": "2017ucp1209",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "22",
                    "Name": "Mandeep Singh Goyat",
                    "College ID": "2017ucp1580",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "23",
                    "Name": "Ayush Jain",
                    "College ID": "2017ucp1168",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "24",
                    "Name": "Yukti Khurana",
                    "College ID": "2017ucp1234",
                    "Branch": "CSE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "25",
                    "Name": "Dilpreet Singh",
                    "College ID": "2017uec1286",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "5 Aug",
                    "Result Date": "6 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "26",
                    "Name": "Ravi Saraswat",
                    "College ID": "2017uec1633",
                    "Branch": "ECE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "27",
                    "Name": "Anand Soni",
                    "College ID": "2017ucp1114",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "28",
                    "Name": "Aniket Jain",
                    "College ID": "2017ucp1469",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "29",
                    "Name": "Akshit Mehta",
                    "College ID": "2017ucp1432",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "30",
                    "Name": "Khimraj ",
                    "College ID": "2017ucp1706",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "31",
                    "Name": "Preeti G",
                    "College ID": "2017uec1057",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2 month",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "32",
                    "Name": "Mayank Chhipa",
                    "College ID": "2017ume1161",
                    "Branch": "MECH",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "33",
                    "Name": "Amish raj",
                    "College ID": "2017ucp1009",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "34",
                    "Name": "Priya Kanodia",
                    "College ID": "2017uch1367",
                    "Branch": "CHEM",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "35",
                    "Name": "Aakash Gopal Vachhani",
                    "College ID": "2017ucp1001",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "36",
                    "Name": "Pratibha Yadav",
                    "College ID": "2017uec1083",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "37",
                    "Name": "Akash Srivastav",
                    "College ID": "2017ucp1003",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "38",
                    "Name": "Shivansh Bhardwaj",
                    "College ID": "2017ucp1515",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "Pillarplus(winter)",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "39",
                    "Name": "Yash Agarwal",
                    "College ID": "2017uce1763",
                    "Branch": "CIVIL",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "40",
                    "Name": "Rajat Gedam",
                    "College ID": "2017ucp1254",
                    "Branch": "CSE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "41",
                    "Name": "Hardik Pandya",
                    "College ID": "2017uec1641",
                    "Branch": "ECE",
                    "Company": "WiSig",
                    "Stipend": "15K",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "42",
                    "Name": "Akshit Sharma",
                    "College ID": "2017uee1037",
                    "Branch": "EEE",
                    "Company": "WiSig",
                    "Stipend": "15K",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "43",
                    "Name": "Muskaan Samtani",
                    "College ID": "2017uec1008",
                    "Branch": "ECE",
                    "Company": "WiSig",
                    "Stipend": "15K",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "44",
                    "Name": "Ridhima",
                    "College ID": "2017uec1504",
                    "Branch": "ECE",
                    "Company": "WiSig",
                    "Stipend": "15K",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "45",
                    "Name": "Mayurh Shankar",
                    "College ID": "2017uec1688",
                    "Branch": "ECE",
                    "Company": "WiSig",
                    "Stipend": "15K",
                    "Company visited on": "13 Aug",
                    "Result Date": "13 Aug",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "46",
                    "Name": "Arjun Singh",
                    "College ID": "2017uec1586",
                    "Branch": "ECE",
                    "Company": "Walmart",
                    "Stipend": "50K",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "19 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "47",
                    "Name": "Sahil Khandelwal",
                    "College ID": "2017uec1359",
                    "Branch": "ECE",
                    "Company": "Walmart",
                    "Stipend": "50K",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "19 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "48",
                    "Name": "Kunal Agarwal",
                    "College ID": "2017uec1545",
                    "Branch": "ECE",
                    "Company": "Walmart",
                    "Stipend": "50K",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "19 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "49",
                    "Name": "Jitesh Meghwal",
                    "College ID": "2017ucp1689",
                    "Branch": "CSE",
                    "Company": "Walmart",
                    "Stipend": "50K",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "19 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "50",
                    "Name": "Abhinav Bansal",
                    "College ID": "2017ucp1036",
                    "Branch": "CSE",
                    "Company": "Walmart",
                    "Stipend": "50K",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "19 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "51",
                    "Name": "Shivanshu Gupta",
                    "College ID": "2017ucp1617",
                    "Branch": "CSE",
                    "Company": "Walmart",
                    "Stipend": "50K",
                    "Company visited on": "12 Aug",
                    "Result Date": "12 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "19 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "52",
                    "Name": "Amisha Singla",
                    "College ID": "2017ucp1436",
                    "Branch": "CSE",
                    "Company": "Deutsche Bank",
                    "Stipend": "50K",
                    "Company visited on": "14 Aug",
                    "Result Date": "14 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "11 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "53",
                    "Name": "Himanshu Lal",
                    "College ID": "2017uec1671",
                    "Branch": "ECE",
                    "Company": "Deutsche Bank",
                    "Stipend": "50K",
                    "Company visited on": "14 Aug",
                    "Result Date": "14 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "11 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "54",
                    "Name": "Jayesh Chouhan ",
                    "College ID": "2017uec1575",
                    "Branch": "ECE",
                    "Company": "Deutsche Bank",
                    "Stipend": "50K",
                    "Company visited on": "14 Aug",
                    "Result Date": "14 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "11 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "55",
                    "Name": "Shreya Modi",
                    "College ID": "2017ucp1028",
                    "Branch": "CSE",
                    "Company": "Deutsche Bank",
                    "Stipend": "50K",
                    "Company visited on": "14 Aug",
                    "Result Date": "14 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "11 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "56",
                    "Name": "Samik Mehta",
                    "College ID": "2017UCP1513",
                    "Branch": "CSE",
                    "Company": "Optum",
                    "Stipend": "35K",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "57",
                    "Name": "Sumit ",
                    "College ID": "2017UCP1323",
                    "Branch": "CSE",
                    "Company": "Optum",
                    "Stipend": "35K",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "58",
                    "Name": "Shubham Kalla",
                    "College ID": "2017UEE1085",
                    "Branch": "EEE",
                    "Company": "Optum",
                    "Stipend": "35K",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "59",
                    "Name": "Hardik Banthia",
                    "College ID": "2017UEC1587",
                    "Branch": "ECE",
                    "Company": "Optum",
                    "Stipend": "35K",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "60",
                    "Name": "Himanshu Rawat",
                    "College ID": "2017UCP1230",
                    "Branch": "CSE",
                    "Company": "Optum",
                    "Stipend": "35K",
                    "Company visited on": "21 Aug",
                    "Result Date": "21 Aug",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "61",
                    "Name": "Sanjay Kumar",
                    "College ID": "2016UCP1382",
                    "Branch": "CSE",
                    "Company": "Commvault ",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug",
                    "Duration": "6 months",
                    "Remarks": "Internship over"
                },
                {
                    "S.No.": "62",
                    "Name": "Ravi Khandelwal",
                    "College ID": "2016UCP1653",
                    "Branch": "CSE",
                    "Company": "Commvault ",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug",
                    "Duration": "6 months",
                    "Remarks": "Internship over"
                },
                {
                    "S.No.": "63",
                    "Name": "Purvansh Gourh",
                    "College ID": "2017UCP1032",
                    "Branch": "CSE",
                    "Company": "PharmEasy",
                    "Stipend": "25K",
                    "Company visited on": "16 Aug",
                    "Result Date": "26 Aug",
                    "Duration": "2  months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "64",
                    "Name": "Radhika Juneja",
                    "College ID": "2017UEC1540",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "30 Aug",
                    "Result Date": "30 Aug",
                    "Duration": "6 months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "65",
                    "Name": "Akshat Gulkhandia",
                    "College ID": "2017UEC1662",
                    "Branch": "ECE",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "30 Aug",
                    "Result Date": "30 Aug",
                    "Duration": "6 months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "66",
                    "Name": "Manvendra Rathore",
                    "College ID": "2017UCH1654",
                    "Branch": "CHEM",
                    "Company": "JP Morgan",
                    "Stipend": "50K",
                    "Company visited on": "30 Aug",
                    "Result Date": "30 Aug",
                    "Duration": "6 months",
                    "Internship Start Date": "11 May",
                    "Remarks": "Notify students"
                },
                {
                    "S.No.": "67",
                    "Name": "Aditya Kumar",
                    "College ID": "2017UCP1204",
                    "Branch": "CSE",
                    "Company": "Droom",
                    "Stipend": "15K",
                    "Company visited on": "30 Aug",
                    "Result Date": "30 Aug",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "68",
                    "Name": "Aeshna Anand",
                    "College ID": "2017UEE1288",
                    "Branch": "EEE",
                    "Company": "Addverb",
                    "Stipend": "25K",
                    "Company visited on": "30 Aug",
                    "Result Date": "2 Sep",
                    "Duration": "2 months",
                    "Remarks": "Internship Postponded"
                },
                {
                    "S.No.": "69",
                    "Name": "Jai Kumar Upadhyay",
                    "College ID": "2017UME1195",
                    "Branch": "MECH",
                    "Company": "Addverb",
                    "Stipend": "25K",
                    "Company visited on": "30 Aug",
                    "Result Date": "2 Sep",
                    "Duration": "2 months",
                    "Remarks": "Internship Postponded"
                },
                {
                    "S.No.": "70",
                    "Name": "Tanishk Dudi",
                    "College ID": "2017UME1366",
                    "Branch": "MECH",
                    "Company": "Addverb",
                    "Stipend": "25K",
                    "Company visited on": "30 Aug",
                    "Result Date": "2 Sep",
                    "Duration": "2 months",
                    "Remarks": "Internship Postponded"
                },
                {
                    "S.No.": "71",
                    "Name": "Tanmay Agarwal",
                    "College ID": "2017UEC1547",
                    "Branch": "ECE",
                    "Company": "Toshiba",
                    "Stipend": "25k",
                    "Company visited on": "18 Sept",
                    "Result Date": "18 Sept",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "72",
                    "Name": "Naman Soni",
                    "College ID": "2017UEC1392",
                    "Branch": "ECE",
                    "Company": "Toshiba",
                    "Stipend": "25k",
                    "Company visited on": "18 Sept",
                    "Result Date": "18 Sept",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "73",
                    "Name": "kunal wani",
                    "College ID": "2017UEC1651",
                    "Branch": "ECE",
                    "Company": "Toshiba",
                    "Stipend": "25k",
                    "Company visited on": "18 Sept",
                    "Result Date": "18 Sept",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "74",
                    "Name": "Paarth Bir",
                    "College ID": "2017UEC1096",
                    "Branch": "ECE",
                    "Company": "Toshiba",
                    "Stipend": "25k",
                    "Company visited on": "18 Sept",
                    "Result Date": "18 Sept",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "75",
                    "Name": "Vatsal Jain",
                    "College ID": "2017UME1030",
                    "Branch": "MECH",
                    "Company": "Saint Gobain",
                    "Stipend": "35.5k",
                    "Company visited on": "16-17 Oct",
                    "Result Date": "17 Oct",
                    "Duration": "2 months",
                    "Remarks": "In conversation"
                },
                {
                    "S.No.": "76",
                    "Name": "Samyak Srivastava",
                    "College ID": "2017UMT1716",
                    "Branch": "META",
                    "Company": "L&T Infotech",
                    "Stipend": "18K",
                    "Company visited on": "11 Oct",
                    "Result Date": "25 Oct",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "77",
                    "Name": "Jitendra Singh",
                    "College ID": "2017UMT1291",
                    "Branch": "META",
                    "Company": "JSL",
                    "Stipend": "20K",
                    "Company visited on": "7 Nov",
                    "Result Date": "7 Nov",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "78",
                    "Name": "Dikshant Khatri",
                    "College ID": "2017UMT1206",
                    "Branch": "META",
                    "Company": "JSL",
                    "Stipend": "20K",
                    "Company visited on": "7 Nov",
                    "Result Date": "7 Nov",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "79",
                    "Name": "Anshul Parate",
                    "College ID": "2017UME1347",
                    "Branch": "MECH",
                    "Company": "Hero Motocorp",
                    "Stipend": "8K",
                    "Company visited on": "7 Nov",
                    "Result Date": "13 Nov",
                    "Duration": "6 month",
                    "Internship Start Date": "1 June",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "80",
                    "Name": "Rajesh Nitharwal",
                    "College ID": "2017UME1608",
                    "Branch": "MECH",
                    "Company": "Hero Motocorp",
                    "Stipend": "8K",
                    "Company visited on": "7 Nov",
                    "Result Date": "13 Nov",
                    "Duration": "6 month",
                    "Internship Start Date": "1 June",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "81",
                    "Name": "Mahendra Choudhary",
                    "College ID": "2017UME1609",
                    "Branch": "MECH",
                    "Company": "Hero Motocorp",
                    "Stipend": "8K",
                    "Company visited on": "7 Nov",
                    "Result Date": "13 Nov",
                    "Duration": "6 month",
                    "Internship Start Date": "1 June",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "82",
                    "Name": "Arjun Jakhar",
                    "College ID": "2017UME1068",
                    "Branch": "MECH",
                    "Company": "Hero Motocorp",
                    "Stipend": "8K",
                    "Company visited on": "7 Nov",
                    "Result Date": "13 Nov",
                    "Duration": "6 month",
                    "Internship Start Date": "1 June",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "83",
                    "Name": "Vipul Raj Singh",
                    "College ID": "2017UEC1207",
                    "Branch": "ECE",
                    "Company": "TechShlok",
                    "Company visited on": "13 Nov",
                    "Result Date": "13 Nov",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "84",
                    "Name": "IndraJeet Singh",
                    "College ID": "2017UEC1197",
                    "Branch": "ECE",
                    "Company": "Pillarplus(winter)",
                    "Stipend": "15K",
                    "Company visited on": "26 Nov",
                    "Result Date": "26 Nov",
                    "Duration": "1 month",
                    "Remarks": "Internship over"
                },
                {
                    "S.No.": "85",
                    "Name": "Jasmeet",
                    "College ID": "2017UEC1568",
                    "Branch": "ECE",
                    "Company": "Pillarplus(winter)",
                    "Stipend": "15K",
                    "Company visited on": "26 Nov",
                    "Result Date": "26 Nov",
                    "Duration": "1 month",
                    "Remarks": "Internship over"
                },
                {
                    "S.No.": "86",
                    "Name": "Vipul Chauhan",
                    "College ID": "2017UCP1269",
                    "Branch": "CSE",
                    "Company": "Digite",
                    "Stipend": "20K",
                    "Company visited on": "27 Nov",
                    "Result Date": "18 Dec",
                    "Duration": "2 months",
                    "Remarks": "Internship cancelled"
                },
                {
                    "S.No.": "87",
                    "Name": "Rahul Tuteja",
                    "College ID": "2017ucp1479",
                    "Branch": "CSE",
                    "Company": "Digite",
                    "Stipend": "20K",
                    "Company visited on": "27 Nov",
                    "Result Date": "18 Dec",
                    "Duration": "2 months",
                    "Remarks": "Internship cancelled"
                },
                {
                    "S.No.": "88",
                    "Name": "Jayneesh Vyas",
                    "College ID": "2017uee1148",
                    "Branch": "EEE",
                    "Company": "Digite",
                    "Stipend": "20K",
                    "Company visited on": "27 Nov",
                    "Result Date": "18 Dec",
                    "Duration": "2 months",
                    "Remarks": "Internship cancelled"
                },
                {
                    "S.No.": "89",
                    "Name": "Snigdha Prasad",
                    "College ID": "2017uch1511",
                    "Branch": "CHEM",
                    "Company": "Glocal",
                    "Stipend": "20K",
                    "Company visited on": "7 Dec",
                    "Result Date": "7 Dec",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "90",
                    "Name": "Parth Goyal",
                    "College ID": "2017uec1150",
                    "Branch": "ECE",
                    "Company": "Glocal",
                    "Stipend": "20K",
                    "Company visited on": "7 Dec",
                    "Result Date": "7 Dec",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "91",
                    "Name": "Madhav Wadhawan",
                    "College ID": "2017umt1419",
                    "Branch": "META",
                    "Company": "Raam Group",
                    "Stipend": "15K",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "92",
                    "Name": "Jaswanth Chakravarthi",
                    "College ID": "2017uec1449",
                    "Branch": "ECE",
                    "Company": "Raam Group",
                    "Stipend": "15K",
                    "Company visited on": "8 Jan",
                    "Result Date": "8 Jan",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "93",
                    "Name": "Aditi Singhal",
                    "College ID": "2017uec1289",
                    "Branch": "ECE",
                    "Company": "Fidelity",
                    "Stipend": "40K",
                    "Company visited on": "8 Aug",
                    "Result Date": "8 Aug",
                    "Duration": "2 months",
                    "Internship Start Date": "4/5 May",
                    "Remarks": "No action needed"
                },
                {
                    "S.No.": "94",
                    "Name": "Divyanshu Kumar",
                    "College ID": "2017ume1081",
                    "Branch": "MECH",
                    "Company": "HLS Asia Ltd",
                    "Company visited on": "22 Jan",
                    "Result Date": "23 Jan",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "95",
                    "Name": "Anshul Ratnu",
                    "College ID": "2017ume1631",
                    "Branch": "MECH",
                    "Company": "HLS Asia Ltd",
                    "Company visited on": "22 Jan",
                    "Result Date": "23 Jan",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "96",
                    "Name": "Rahul Goyal",
                    "College ID": "2017uee1765",
                    "Branch": "EEE",
                    "Company": "HLS Asia Ltd",
                    "Company visited on": "22 Jan",
                    "Result Date": "23 Jan",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "97",
                    "Name": "Shri Krishna Singh Yadav",
                    "College ID": "2017uee1399",
                    "Branch": "EEE",
                    "Company": "HLS Asia Ltd",
                    "Company visited on": "22 Jan",
                    "Result Date": "23 Jan",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "98",
                    "Name": "Shataksha Singh",
                    "College ID": "2017UCH1435",
                    "Branch": "CHEM",
                    "Company": "JAIPUR RUGS",
                    "Stipend": "6K",
                    "Company visited on": "7 Jan",
                    "Result Date": "22 Jan",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "99",
                    "Name": "Sunil Dhayar",
                    "College ID": "2017UCP1041",
                    "Branch": "CSE",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "12 Feb",
                    "Result Date": "12 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "100",
                    "Name": "Neeraj Kumar",
                    "College ID": "2017UCP1027",
                    "Branch": "CSE",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "12 Feb",
                    "Result Date": "12 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "101",
                    "Name": "Divy Bansal",
                    "College ID": "2017UCP",
                    "Branch": "CSE",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "12 Feb",
                    "Result Date": "12 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "102",
                    "Name": "Nikhil Sharma",
                    "College ID": "2017UCP",
                    "Branch": "CSE",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "12 Feb",
                    "Result Date": "12 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "Name": "Deepak Kumar Verma",
                    "College ID": "2017UME1199",
                    "Branch": "MECH",
                    "Company": "Daikin",
                    "Stipend": "NIL",
                    "Company visited on": "10 Feb (Manipal)",
                    "Result Date": "14 Feb",
                    "Duration": "2 months",
                    "Remarks": "Postponed and will be conducted virtuallu"
                },
                {
                    "Name": "Mohit Kumar",
                    "College ID": "2017UME1527",
                    "Branch": "MECH",
                    "Company": "Daikin",
                    "Stipend": "NIL",
                    "Company visited on": "10 Feb (Manipal)",
                    "Result Date": "14 Feb",
                    "Duration": "2 months",
                    "Remarks": "Postponed and will be conducted virtuallu"
                },
                {
                    "S.No.": "103",
                    "Name": "Himanshu Yaduv",
                    "College ID": "2017UCH1059",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "104",
                    "Name": "Paramjeet Singh Walia",
                    "College ID": "2017UCH1445",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "105",
                    "Name": "Ankit Ojha",
                    "College ID": "2017UCH1668",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "106",
                    "Name": "Nischay Gupta",
                    "College ID": "2017UCH1240",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "107",
                    "Name": "Priyanka Rani Chauhan",
                    "College ID": "2017UCH1523",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "108",
                    "Name": "Riya S. Nath",
                    "College ID": "2017UCH1643",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "109",
                    "Name": "Kanishka Gupta",
                    "College ID": "2017UCH1753",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "110",
                    "Name": "Shraddha Mehta",
                    "College ID": "2017UCH1453",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "111",
                    "Name": "Chhavi Shukla",
                    "College ID": "2017UCH1275",
                    "Branch": "CHEM",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "112",
                    "Name": "Deepesh Yaduv",
                    "College ID": "2017UME1428",
                    "Branch": "MECH",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "18 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "113",
                    "Name": "Dhanraj Meghvanshi",
                    "College ID": "2017UME1094",
                    "Branch": "MECH",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "25 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "114",
                    "Name": "Himanshu Jain",
                    "College ID": "2017UME1769",
                    "Branch": "MECH",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "25 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "115",
                    "Name": "Devansh Jindal",
                    "College ID": "2017UME1709",
                    "Branch": "MECH",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "25 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "116",
                    "Name": "Yash Garg",
                    "College ID": "2017UMT1116",
                    "Branch": "META",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "25 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "117",
                    "Name": "Yashank Dixit",
                    "College ID": "2017UMT1108",
                    "Branch": "META",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "25 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "118",
                    "Name": "Sanjay",
                    "College ID": "2017UEE1413",
                    "Branch": "EEE",
                    "Company": "Reliance",
                    "Stipend": "30k",
                    "Company visited on": "18 Feb",
                    "Result Date": "25 Feb",
                    "Duration": "2 months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "119",
                    "Name": "Amit Agarwal",
                    "College ID": "2017UCP1101",
                    "Branch": "CSE",
                    "Company": "Servicenow",
                    "Stipend": "45k",
                    "Company visited on": "6 Mar",
                    "Result Date": "6 Mar",
                    "Duration": "6 Months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "120",
                    "Name": "Saurabh",
                    "Branch": "CSE",
                    "Company": "Servicenow",
                    "Stipend": "45k",
                    "Company visited on": "6 Mar",
                    "Result Date": "6 Mar",
                    "Duration": "6 Months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "121",
                    "Name": "Inderjeet Singh",
                    "College ID": "2017UEC1197",
                    "Branch": "ECE",
                    "Company": "Servicenow",
                    "Stipend": "45k",
                    "Company visited on": "6 Mar",
                    "Result Date": "6 Mar",
                    "Duration": "6 Months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "122",
                    "Name": "Pranjal Patel",
                    "College ID": "2017UEC1621",
                    "Branch": "ECE",
                    "Company": "Servicenow",
                    "Stipend": "45k",
                    "Company visited on": "6 Mar",
                    "Result Date": "6 Mar",
                    "Duration": "6 Months",
                    "Remarks": "No information"
                },
                {
                    "S.No.": "123",
                    "Name": "Sumit ",
                    "Company": "Servicenow",
                    "Stipend": "45k",
                    "Company visited on": "6 Mar",
                    "Result Date": "6 Mar",
                    "Duration": "6 Months",
                    "Remarks": "No information"
                }
            ]
        },
        {
            "M.Tech.": [
                {
                    "S.No.": "1",
                    "Name": "Kawaldeep Kaur",
                    "College ID": "2018PIS5431",
                    "Branch": "CSE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "2",
                    "Name": "Prateek Sharma",
                    "College ID": "2018PIS5157",
                    "Branch": "CSE",
                    "Company": "Societe Generale",
                    "Package": "13.13",
                    "Company visited on": "10 Aug",
                    "Result Date": "10 Aug"
                },
                {
                    "S.No.": "3",
                    "Name": "Sai Sreekar",
                    "College ID": "2018PIS5024",
                    "Branch": "CSE",
                    "Company": "Walmart Labs",
                    "Package": "20.67",
                    "Company visited on": "11 Aug",
                    "Result Date": "12 Aug"
                },
                {
                    "S.No.": "4",
                    "Name": "Vishal Teotia",
                    "College ID": "2018PCP5212",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9.5",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "5",
                    "Name": "Sneha",
                    "College ID": "2018PCP5055",
                    "Branch": "CSE",
                    "Company": "MAQ Software",
                    "Package": "9",
                    "Company visited on": "17 Aug",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "6",
                    "Name": "shivankshi khandelwal",
                    "College ID": "2018PIS5393",
                    "Branch": "CSE",
                    "Company": "Wissen",
                    "Package": "11",
                    "Company visited on": "17 Aug",
                    "Result Date": "17Aug"
                },
                {
                    "S.No.": "7",
                    "Name": "Pooja Kumari",
                    "College ID": "2018PIS5159",
                    "Branch": "CSE",
                    "Company": "Philips",
                    "Package": "11",
                    "Company visited on": "19 Aug",
                    "Result Date": "19 Aug"
                },
                {
                    "S.No.": "8",
                    "Name": "Ram Vaishnav",
                    "College ID": "2018PCP5047",
                    "Branch": "CSE",
                    "Company": "Philips",
                    "Package": "11",
                    "Company visited on": "19 Aug",
                    "Result Date": "19 Aug"
                },
                {
                    "S.No.": "9",
                    "Name": "Prerana Kajla",
                    "College ID": "2018PIS5368",
                    "Branch": "CSE",
                    "Company": "Philips",
                    "Package": "11",
                    "Company visited on": "19 Aug",
                    "Result Date": "19 Aug"
                },
                {
                    "S.No.": "10",
                    "Name": "Kapil Mangal",
                    "College ID": "2018PCP5112",
                    "Branch": "CSE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "11",
                    "Name": "Mohammad Iqbal",
                    "College ID": "2018PCP5500",
                    "Branch": "CSE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "12",
                    "Name": "Sonam Vyas",
                    "College ID": "2018PCP5210",
                    "Branch": "CSE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "13",
                    "Name": "Nidhi Agrawal",
                    "College ID": "2018PEB5095",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "14",
                    "Name": "Rishabh Sahu",
                    "College ID": "2018PCP5344",
                    "Branch": "CSE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "15",
                    "Name": "Prachi Sharma",
                    "College ID": "2018PWC5339",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "16",
                    "Name": "Shalu",
                    "College ID": "2018PEC5473",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "17",
                    "Name": "Anvin Thomas John",
                    "College ID": "2018PEB5007",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "18",
                    "Name": "Shweta Patidar",
                    "College ID": "2018PCP5018",
                    "Branch": "CSE",
                    "Company": "Deloitte",
                    "Package": "8.1",
                    "Company visited on": "23 Aug",
                    "Result Date": "23 Aug"
                },
                {
                    "S.No.": "19",
                    "Name": "Sumandeep Kour",
                    "College ID": "2018PWC5167",
                    "Branch": "ECE",
                    "Company": "Nokia",
                    "Package": "7.5",
                    "Company visited on": "22 Aug",
                    "Result Date": "22 Aug"
                },
                {
                    "S.No.": "20",
                    "Name": "Shubha Pandey",
                    "College ID": "2018PWC5514",
                    "Branch": "ECE",
                    "Company": "IBM",
                    "Package": "7.85",
                    "Company visited on": "27 Aug",
                    "Result Date": "31 Aug"
                },
                {
                    "S.No.": "21",
                    "Name": "Riya Jain",
                    "College ID": "2018PPD5081",
                    "Branch": "EEE",
                    "Company": "Addverb",
                    "Package": "10.22",
                    "Company visited on": "30 Aug",
                    "Result Date": "30 Aug"
                },
                {
                    "S.No.": "22",
                    "Name": "Israr Mohammed",
                    "College ID": "2018PPE5150",
                    "Branch": "MECH",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "6 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "23",
                    "Name": "Mohini Tiwari",
                    "College ID": "2018PMT5128",
                    "Branch": "META",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "6 Sept",
                    "Result Date": "6 Sept"
                },
                {
                    "S.No.": "24",
                    "Name": "Rajat Tiwari",
                    "College ID": "2018PCH5513",
                    "Branch": "CHEM",
                    "Company": "Byju's",
                    "Package": "7",
                    "Company visited on": "6 Sept",
                    "Result Date": "6 Sept",
                    "undefined": "21 Feb"
                },
                {
                    "S.No.": "25",
                    "Name": "Chandramani Adil",
                    "College ID": "2018PCP5420",
                    "Branch": "CSE",
                    "Company": "Accops",
                    "Package": "8",
                    "Company visited on": "Online",
                    "Result Date": "10 Sept"
                },
                {
                    "S.No.": "26",
                    "Name": "Abhishek Rajput",
                    "College ID": "2018PIE5328",
                    "Branch": "MECH",
                    "Company": "Affine",
                    "Package": "6",
                    "Company visited on": "11 Oct",
                    "Result Date": "11 Oct"
                },
                {
                    "S.No.": "27",
                    "Name": "Asmita Karn",
                    "College ID": "2018PCH5496",
                    "Branch": "CHEM",
                    "Company": "TCE",
                    "Package": "5",
                    "Company visited on": "24 Oct",
                    "Result Date": "25 Oct"
                },
                {
                    "S.No.": "28",
                    "Name": "Pratiksha",
                    "College ID": "2018PEB5417",
                    "Branch": "ECE",
                    "Company": "Invenio",
                    "Package": "4.5",
                    "Company visited on": "13 Nov",
                    "Result Date": "20 Nov"
                },
                {
                    "S.No.": "29",
                    "Name": "Roshni Ray",
                    "College ID": "2018PCH5006",
                    "Branch": "CHEM",
                    "Company": "Aakash institute",
                    "Package": "6.25-8.25",
                    "Company visited on": "21 Nov",
                    "Result Date": "30 Nov"
                },
                {
                    "S.No.": "30",
                    "Name": "Narendra Sharma",
                    "College ID": "2018PDE5417",
                    "Branch": "MECH",
                    "Company": "Aakash institute",
                    "Package": "6.25-8.25",
                    "Company visited on": "21 Nov",
                    "Result Date": "30 Nov"
                },
                {
                    "S.No.": "31",
                    "Name": "Parveen Kumar Chaudhary",
                    "College ID": "2018PPE5028",
                    "Branch": "MECH",
                    "Company": "Aakash institute",
                    "Package": "6.25-8.25",
                    "Company visited on": "21 Nov",
                    "Result Date": "30 Nov"
                },
                {
                    "S.No.": "32",
                    "Name": "Monu",
                    "College ID": "2018PTE5060",
                    "Branch": "MECH",
                    "Company": "Aakash institute",
                    "Package": "6.25-8.25",
                    "Company visited on": "21 Nov",
                    "Result Date": "30 Nov"
                },
                {
                    "S.No.": "33",
                    "Name": "Asim Yousuf",
                    "College ID": "2018PDE5182",
                    "Branch": "MECH",
                    "Company": "Avanti Learning",
                    "Package": "5",
                    "Company visited on": "11 Dec",
                    "Result Date": "14 Dec"
                },
                {
                    "S.No.": "34",
                    "Name": "Neeraj Jaat",
                    "College ID": "2018PPE5162 ",
                    "Branch": "MECH",
                    "Company": "Resonance",
                    "Package": "4.8",
                    "Company visited on": "15 Dec",
                    "Result Date": "15 Dec"
                },
                {
                    "S.No.": "35",
                    "Name": "Peeyush Sharma",
                    "College ID": "2018PPE5488",
                    "Branch": "MECH",
                    "Company": "L&T Construction",
                    "Package": "7",
                    "Company visited on": "30 Nov",
                    "Result Date": "26 Dec"
                },
                {
                    "S.No.": "36",
                    "Name": "Hardik Thinger",
                    "College ID": "2018PCS5085",
                    "Branch": "CIVIL",
                    "Company": "L&T Construction",
                    "Package": "7",
                    "Company visited on": "30 Nov",
                    "Result Date": "26 Dec"
                },
                {
                    "S.No.": "37",
                    "Name": "Krishan Kumar",
                    "College ID": "2018PCS5189",
                    "Branch": "CIVIL",
                    "Company": "L&T Construction",
                    "Package": "7",
                    "Company visited on": "30 Nov",
                    "Result Date": "26 Dec"
                },
                {
                    "S.No.": "38",
                    "Name": "Ashish Sharma",
                    "College ID": "2018pms5520",
                    "Branch": "MRC",
                    "Company": "AMNS",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "39",
                    "Name": "Rohit Yadav",
                    "College ID": "2018pms5452",
                    "Branch": "MRC",
                    "Company": "AMNS",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "40",
                    "Name": "Basit Ansari",
                    "College ID": "2018pmt5521",
                    "Branch": "META",
                    "Company": "AMNS",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "41",
                    "Name": "Ashish Jangir",
                    "College ID": "2018pie5340",
                    "Branch": "MECH",
                    "Company": "AMNS",
                    "Package": "5",
                    "Company visited on": "6 Jan",
                    "Result Date": "7 Jan"
                },
                {
                    "S.No.": "42",
                    "Name": "Shivam Joshi",
                    "College ID": "2018ppe5206",
                    "Branch": "MECH",
                    "Company": "JWIL",
                    "Package": "4.5",
                    "Company visited on": "10 Dec",
                    "Result Date": "14 Jan"
                },
                {
                    "S.No.": "43",
                    "Name": "Mahendra Kumar Meena",
                    "College ID": "2018pcp5186",
                    "Branch": "CSE",
                    "Company": "Parul University",
                    "Package": "5",
                    "Company visited on": "16 Dec",
                    "Result Date": "21 Jan"
                },
                {
                    "S.No.": "44",
                    "Name": "PIYUSH MISHRA",
                    "College ID": "2018PIS5487",
                    "Branch": "CSE",
                    "Company": "MINI ORANGE",
                    "Package": "8",
                    "Company visited on": "22 Jan",
                    "Result Date": "22 Jan"
                },
                {
                    "S.No.": "45",
                    "Name": "PRASHANT SUVALKA",
                    "College ID": "2018PEB5491",
                    "Branch": "ECE",
                    "Company": "MINI ORANGE",
                    "Package": "8",
                    "Company visited on": "22 Jan",
                    "Result Date": "22 Jan"
                },
                {
                    "S.No.": "46",
                    "Name": "Anindita Saha",
                    "College ID": "2018PCH5059",
                    "Branch": "CHEM",
                    "Company": "JAIPUR RUGS",
                    "Package": "5",
                    "Company visited on": "7 Jan",
                    "Result Date": "22 Jan"
                },
                {
                    "S.No.": "47",
                    "Name": "Lilesh Jinger",
                    "College ID": "2018pcp5123",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9.5",
                    "Company visited on": "29 Jan",
                    "Result Date": "29 Jan"
                },
                {
                    "S.No.": "48",
                    "Name": "Anu Ayyappan",
                    "College ID": "2018pis5474",
                    "Branch": "CSE",
                    "Company": "Oracle",
                    "Package": "9.5",
                    "Company visited on": "29 Jan",
                    "Result Date": "29 Jan"
                },
                {
                    "S.No.": "49",
                    "Name": "Avinash Kumar",
                    "College ID": "2018PEV5137",
                    "Branch": "ECE",
                    "Company": "ORANGE BUSINESS",
                    "Package": "6.5",
                    "Company visited on": "30 Jan",
                    "Result Date": "30 Jan"
                },
                {
                    "S.No.": "50",
                    "Name": "Shubham Shukla",
                    "College ID": "2018PEB5495",
                    "Branch": "ECE",
                    "Company": "Analog Devices",
                    "Package": "13.5",
                    "Company visited on": "PPO"
                },
                {
                    "S.No.": "51",
                    "Name": "Abhishek Parihar",
                    "College ID": "2018PEB5463",
                    "Branch": "ECE",
                    "Company": "Analog Devices",
                    "Package": "13.5",
                    "Company visited on": "PPO"
                },
                {
                    "S.No.": "52",
                    "Name": "Shubham Gupta",
                    "College ID": "2018PES5013",
                    "Branch": "EEE",
                    "Company": "Sciative Solutions",
                    "Package": "5",
                    "Company visited on": "5 Feb",
                    "Result Date": "5 Feb"
                },
                {
                    "S.No.": "53",
                    "Name": "Rajita Kasliwal",
                    "College ID": "2018PWC5012",
                    "Branch": "ECE",
                    "Company": "Sagacious IP",
                    "Package": "4.5",
                    "Company visited on": "28 Jan",
                    "Result Date": "7 Feb"
                },
                {
                    "S.No.": "54",
                    "Name": "Priya verma",
                    "College ID": "2018PEB5051",
                    "Branch": "ECE",
                    "Company": "Sagacious IP",
                    "Package": "4.5",
                    "Company visited on": "28 Jan",
                    "Result Date": "7 Feb"
                },
                {
                    "S.No.": "55",
                    "Name": "Rashmi Raj",
                    "College ID": "2018PIS5418",
                    "Branch": "CSE",
                    "Company": "Ericsson Global",
                    "Package": "6.5",
                    "Company visited on": "9 Feb",
                    "Result Date": "Off Campus"
                },
                {
                    "S.No.": "56",
                    "Name": "kanishka",
                    "College ID": "2018ppd5178",
                    "Branch": "EEE",
                    "Company": "Avaada Energy",
                    "Package": "5",
                    "Company visited on": "3 Feb",
                    "Result Date": "18 Feb"
                },
                {
                    "S.No.": "57",
                    "Name": "Surabhi",
                    "College ID": "2018ppd5134",
                    "Branch": "EEE",
                    "Company": "KEC",
                    "Package": "5.25",
                    "Company visited on": "6 Mar",
                    "Result Date": "11 Mar"
                },
                {
                    "S.No.": "58",
                    "Name": "Praveen Pal",
                    "College ID": "2018ppd5004",
                    "Branch": "EEE",
                    "Company": "KEC",
                    "Package": "5.25",
                    "Company visited on": "6 Mar",
                    "Result Date": "11 Mar"
                },
                {
                    "S.No.": "59",
                    "Name": "Aditya Sharma",
                    "College ID": "2018pcd5479",
                    "Branch": "CIVIL",
                    "Company": "KEC",
                    "Package": "5.25",
                    "Company visited on": "6 Mar",
                    "Result Date": "11 Mar"
                },
                {
                    "S.No.": "60",
                    "Name": "Parankush Dangar",
                    "College ID": "2018pcd5493",
                    "Branch": "CIVIL",
                    "Company": "KEC",
                    "Package": "5.25",
                    "Company visited on": "6 Mar",
                    "Result Date": "11 Mar"
                }
            ]
        },
        {
            "M.Tech. - Internship": [
            {
                "S.No.": "1",
                "Name": "Pooja Goswami",
                "College ID": "2018PIS5352",
                "Branch": "CSE",
                "Company": "MAQ Software",
                "Stipend": "36K",
                "Company visited on": "17 Aug",
                "Result Date": "17 Aug"
            },
            {
                "S.No.": "2",
                "Name": "Sneha",
                "College ID": "2018PCP5055",
                "Branch": "CSE",
                "Company": "MAQ Software",
                "Stipend": "36K",
                "Company visited on": "17 Aug",
                "Result Date": "17 Aug"
            },
            {
                "S.No.": "3",
                "Name": "Rahul Lahre",
                "College ID": "2019PIS5479",
                "Branch": "CSE",
                "Company": "Dell",
                "Stipend": "35K",
                "Company visited on": "10 Oct",
                "Result Date": "10 Oct"
            },
            {
                "S.No.": "4",
                "Name": "Reha Bagda",
                "College ID": "2019PWC5381",
                "Branch": "ECE",
                "Company": "Dell",
                "Stipend": "35K",
                "Company visited on": "10 Oct",
                "Result Date": "10 Oct"
            },
            {
                "S.No.": "5",
                "Name": "Sakshi Parashar",
                "College ID": "2019PCP5028",
                "Branch": "CSE",
                "Company": "Dell",
                "Stipend": "35K",
                "Company visited on": "10 Oct",
                "Result Date": "10 Oct"
            },
            {
                "S.No.": "6",
                "Name": "Shruti Saini",
                "College ID": "2019PIS5478",
                "Branch": "CSE",
                "Company": "Dell",
                "Stipend": "35K",
                "Company visited on": "10 Oct",
                "Result Date": "10 Oct"
            },
            {
                "S.No.": "7",
                "Name": "Prerna Kajla",
                "College ID": "2018PIS5368",
                "Branch": "CSE",
                "Company": "Samsung Noida",
                "Stipend": "35K",
                "Company visited on": "11 Oct",
                "Result Date": "11 Oct"
            },
            {
                "S.No.": "8",
                "Name": "Pranali Prabhakr Kokate",
                "College ID": "2019PEB5431",
                "Branch": "ECE",
                "Company": "TechShlok",
                "Stipend": "15K",
                "Company visited on": "11 Nov",
                "Result Date": "11 Nov"
            },
            {
                "S.No.": "9",
                "Name": "Hardic Sharma",
                "College ID": "2019PEB5508",
                "Branch": "ECE",
                "Company": "TechShlok",
                "Stipend": "15K",
                "Company visited on": "11 Nov",
                "Result Date": "11 Nov",
                "undefined": "Waiting"
            }
        ]
        },
        {
            "MBA": [
                {
                    "S.No.": "1",
                    "Name": "Theetharappan Aswin",
                    "College ID": "2018PBM5274",
                    "Branch": "MBA",
                    "Company": "Jaipur Rugs Company Pvt. Ltd",
                    "Package": "3.82",
                    "Company visited on": "PPO",
                    "Result Date": "17 Aug"
                },
                {
                    "S.No.": "2",
                    "Name": "Anushka Gupta",
                    "College ID": "2018PBM5284",
                    "Branch": "MBA",
                    "Company": "Voylla Fashions",
                    "Package": "5",
                    "Company visited on": "22 Oct",
                    "Result Date": "23 Oct"
                },
                {
                    "S.No.": "3",
                    "Name": "Henna Khanwani",
                    "College ID": "2018PBM5254",
                    "Branch": "MBA",
                    "Company": "Voylla Fashions",
                    "Package": "5",
                    "Company visited on": "22 Oct",
                    "Result Date": "23 Oct"
                },
                {
                    "S.No.": "4",
                    "Name": "Saket Kumar",
                    "College ID": "2018PBM5300",
                    "Branch": "MBA",
                    "Company": "Evosys",
                    "Package": "5.5",
                    "Company visited on": "8 Nov",
                    "Result Date": "8 Nov"
                },
                {
                    "S.No.": "5",
                    "Name": "Diksha",
                    "College ID": "2018PBM5247",
                    "Branch": "MBA",
                    "Company": "Evosys",
                    "Package": "5.5",
                    "Company visited on": "8 Nov",
                    "Result Date": "8 Nov"
                },
                {
                    "S.No.": "6",
                    "Name": "Konda Sabitha",
                    "College ID": "2018PBM5255",
                    "Branch": "MBA",
                    "Company": "TCS ",
                    "Package": "5.79",
                    "Company visited on": "Off Campus",
                    "Result Date": "29 Nov"
                },
                {
                    "S.No.": "7",
                    "Name": "Sukoon Mishra",
                    "College ID": "2018PBM5267",
                    "Branch": "MBA",
                    "Company": "S&P Global",
                    "Package": "3.38",
                    "Company visited on": "Off Campus",
                    "Result Date": "11 Dec",
                    "undefined": "1"
                },
                {
                    "S.No.": "8",
                    "Name": "Bhavana Patni",
                    "College ID": "2018PBM5264",
                    "Branch": "MBA",
                    "Company": "S&P Global",
                    "Package": "3.38",
                    "Company visited on": "Off Campus",
                    "Result Date": "11 Dec"
                },
                {
                    "S.No.": "9",
                    "Name": "Neelansh Yadav",
                    "College ID": "2018PBM5447",
                    "Branch": "MBA",
                    "Company": "S&P Global",
                    "Package": "3.38",
                    "Company visited on": "Off Campus",
                    "Result Date": "11 Dec"
                },
                {
                    "S.No.": "10",
                    "Name": "Gulisha Vijayvergia",
                    "College ID": "2018PBM5270",
                    "Branch": "MBA",
                    "Company": "S&P Global",
                    "Package": "3.12",
                    "Company visited on": "Off Campus",
                    "Result Date": "11 Dec"
                },
                {
                    "S.No.": "11",
                    "Name": "Aditi",
                    "College ID": "2018PBM5292",
                    "Branch": "MBA",
                    "Company": "Vodafone-Idea",
                    "Package": "4.5",
                    "Company visited on": "10 Dec",
                    "Result Date": "23 Dec"
                },
                {
                    "S.No.": "12",
                    "Name": "Shrish Niwas",
                    "College ID": "2018PBM5262",
                    "Branch": "MBA",
                    "Company": "Intellipaat",
                    "Package": "5.4",
                    "Company visited on": "27 Jan",
                    "Result Date": "04 Feb"
                },
                {
                    "S.No.": "13",
                    "Name": "Sai Krishna VNV",
                    "College ID": "2018PBM5285",
                    "Branch": "MBA",
                    "Company": "Credentek",
                    "Package": "5.0-5.5",
                    "Company visited on": "Off Campus",
                    "Result Date": "20 Feb"
                },
                {
                    "S.No.": "14",
                    "Name": "Parul Khandelwal",
                    "College ID": "2018PBM5277",
                    "Branch": "MBA",
                    "Company": "Credentek",
                    "Package": "5.0-5.5",
                    "Company visited on": "Off Campus",
                    "Result Date": "20 Feb"
                },
                {
                    "S.No.": "15",
                    "Name": "Karan Singh Purwar",
                    "College ID": "2018PBM5301",
                    "Branch": "MBA",
                    "Company": "Credentek",
                    "Package": "5.0-5.5",
                    "Company visited on": "Off Campus",
                    "Result Date": "20 Feb"
                },
                {
                    "S.No.": "16",
                    "Name": "Divya Rana",
                    "College ID": "2018PBM5299",
                    "Branch": "MBA",
                    "Company": " Axis Bank",
                    "Company visited on": "Off Campus",
                    "Result Date": "13 Mar"
                },
                {
                    "S.No.": "17",
                    "Name": "Pragati Sengar",
                    "College ID": "2018PBM5266",
                    "Branch": "MBA",
                    "Company": "Axis Bank",
                    "Company visited on": "Off Campus",
                    "Result Date": "13 Mar"
                }
            ]
        },
        {
            "MBA - Internship": [
                {
                    "SNO": "1",
                    "Name": "Saket Kumar Rai",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "2",
                    "Name": "Neha Lal",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "3",
                    "Name": "Shilpa",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "4",
                    "Name": "Kaushagra Soam",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "5",
                    "Name": "Akshat Tiwari",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "6",
                    "Name": "Archita Dubey",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "7",
                    "Name": "Yadavendra Singh",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "8",
                    "Name": "Yash Kumar",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "9",
                    "Name": "Anjali Diwakar",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "10",
                    "Name": "Mayank Srivastava",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "11",
                    "Name": "Akansha Sharma",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "12",
                    "Name": "Shubhi Singhal",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "INSPLORE CONSULATANTS",
                    "Internship Type": "Winter",
                    "Stipend": "4K-15 K",
                    "Company visited on": "14 Oct",
                    "Result Date": "14 Oct"
                },
                {
                    "SNO": "13",
                    "Name": "SANGEETA KHURANA",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "14",
                    "Name": "NEETI KEWALA",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "15",
                    "Name": "MMAYANK SRIVASTAVA",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "16",
                    "Name": "NEHA LAL",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "17",
                    "Name": "AKARH KUMAR RAWAT",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "18",
                    "Name": "FAYAS N",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "19",
                    "Name": "YASH KUMARABHISHEK CHAUDHARY",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "20",
                    "Name": "ADITYA SRIVASTAVA",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "21",
                    "Name": "AKSHITA KANSAL",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "OUTLOOK INDIA",
                    "Internship Type": "Winter",
                    "Stipend": "10 K",
                    "Company visited on": "19 Sep",
                    "Result Date": "03 Oct"
                },
                {
                    "SNO": "22",
                    "Name": "Soniya Yadav",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "23",
                    "Name": "Siddhant Jain",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "24",
                    "Name": "Qayant",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "25",
                    "Name": "Ankita Kumari",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "26",
                    "Name": "Abhishek Chaudari",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "27",
                    "Name": "Yash Kumar",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "28",
                    "Name": "Adil Imam",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "29",
                    "Name": "Nandini Soni",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "30",
                    "Name": "Karmana Kishore",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "31",
                    "Name": "Priyanka Vijay",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "32",
                    "Name": "Akshita Kansal",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "AMUL INDIA",
                    "Internship Type": "Summer",
                    "Stipend": "3K",
                    "Company visited on": "11 Nov",
                    "Result Date": "11 Nov"
                },
                {
                    "SNO": "33",
                    "Name": "Soniya Yadav",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "HIRE TALES",
                    "Internship Type": "Winter",
                    "Stipend": "8K",
                    "Company visited on": "07 Dec",
                    "Result Date": "07 Dec"
                },
                {
                    "SNO": "34",
                    "Name": "Anukruti Gaur",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Bridgegroup Soultions",
                    "Internship Type": "Summer",
                    "Stipend": "8K",
                    "Company visited on": "13 Jan",
                    "Result Date": "13 Jan"
                },
                {
                    "SNO": "35",
                    "Name": "Priyanka Kumari",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Bridgegroup Soultions",
                    "Internship Type": "Summer",
                    "Stipend": "8K",
                    "Company visited on": "13 Jan",
                    "Result Date": "13 Jan"
                },
                {
                    "SNO": "36",
                    "Name": "Deepali",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Bridgegroup Soultions",
                    "Internship Type": "Summer",
                    "Stipend": "8K",
                    "Company visited on": "13 Jan",
                    "Result Date": "13 Jan"
                },
                {
                    "SNO": "37",
                    "Name": "Tuhina Rana",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Capital Box ",
                    "Internship Type": "Summer",
                    "Stipend": "8K",
                    "Company visited on": "17 Jan",
                    "Result Date": "17 Jan"
                },
                {
                    "SNO": "38",
                    "Name": "Sheetal Kulshrestha",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Capital Box ",
                    "Internship Type": "Summer",
                    "Stipend": "8K",
                    "Company visited on": "17 Jan",
                    "Result Date": "17 Jan"
                },
                {
                    "SNO": "39",
                    "Name": "Ayushi Uniyal",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Capital Box ",
                    "Internship Type": "Summer",
                    "Stipend": "8K",
                    "Company visited on": "17 Jan",
                    "Result Date": "17 Jan"
                },
                {
                    "SNO": "40",
                    "Name": "Gunjan Kumar",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Capital Box ",
                    "Internship Type": "Summer",
                    "Stipend": "8K",
                    "Company visited on": "17 Jan",
                    "Result Date": "17 Jan"
                },
                {
                    "SNO": "41",
                    "Name": "Triksha Nigam",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "RBI",
                    "Internship Type": "Summer",
                    "Stipend": "20K ",
                    "Company visited on": "10 Dec",
                    "Result Date": "17 Jan"
                },
                {
                    "SNO": "42",
                    "Name": "Shubhi Singhal",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Hiretales",
                    "Internship Type": "Summer",
                    "Stipend": "20 K",
                    "Company visited on": "22 Jan",
                    "Result Date": "22 Jan"
                },
                {
                    "SNO": "43",
                    "Name": "SANGEETA KHURANA",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Reliance",
                    "Internship Type": "Summer",
                    "Stipend": "15 K",
                    "Company visited on": "29 Jan",
                    "Result Date": "30 Jan"
                },
                {
                    "SNO": "44",
                    "Name": "Shilpa",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Reliance",
                    "Internship Type": "Summer",
                    "Stipend": "15 K",
                    "Company visited on": "29 Jan",
                    "Result Date": "30 Jan"
                },
                {
                    "SNO": "45",
                    "Name": "Yash Kumar",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Reliance",
                    "Internship Type": "Summer",
                    "Stipend": "11 K",
                    "Company visited on": "29 Jan",
                    "Result Date": "30 Jan"
                },
                {
                    "SNO": "46",
                    "Name": "Yadavendra Singh",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "Reliance",
                    "Internship Type": "Summer",
                    "Stipend": "11K",
                    "Company visited on": "29 Jan",
                    "Result Date": "30 Jan"
                },
                {
                    "SNO": "47",
                    "Name": "Krishna Raj",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "PNB Met Metlife",
                    "Internship Type": "Summer"
                },
                {
                    "SNO": "48",
                    "Name": "NEETI KEWALA",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "PNB Met Metlife",
                    "Internship Type": "Summer"
                },
                {
                    "SNO": "49",
                    "Name": "Aditya Kumar Jha",
                    "Branch ": "MANAGEMENT STUDIES ",
                    "Company": "PNB Met Metlife",
                    "Internship Type": "Summer"
                }
            ]
        },
        {
            "M.Sc.": [
                {
                    "S.No.": "1",
                    "Name": "Savi",
                    "College ID": "2018PCY5318",
                    "Branch": "CHEMISTRY",
                    "Company": "Aakash institute",
                    "Package": "6.25-8.25",
                    "Company visited on": "21 Nov",
                    "Result Date": "30 Nov"
                },
                {
                    "S.No.": "2",
                    "Name": "Piyush Maheshwari",
                    "College ID": "2018PCY5486",
                    "Branch": "CHEMISTRY",
                    "Company": "Avanti Learning",
                    "Package": "5",
                    "Company visited on": "11 Dec",
                    "Result Date": "14 Dec"
                },
                {
                    "S.No.": "3",
                    "Name": " Govind ",
                    "College ID": "2018PCY5402 ",
                    "Branch": "CHEMISTRY",
                    "Company": "Resonance",
                    "Package": "4.8",
                    "Company visited on": "15 Dec",
                    "Result Date": "15 Dec"
                }
            ]
        },
        {
            "IIIT Kota": [
                {
                    "Name": "Gaurav Khandelwal",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "MAQ",
                    "Package": "9",
                    "Test Date": "14 August",
                    "Result Date": "17 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Rajesh Kumar",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "MAQ",
                    "Package": "9",
                    "Test Date": "14 August",
                    "Result Date": "17 August",
                    "Offer": "FTE",
                    "undefined": "GAP PPO"
                },
                {
                    "Name": "PARRIPATI V S D N A CHAKRAVARTHI",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "MAQ",
                    "Package": "9",
                    "Test Date": "14 August",
                    "Result Date": "17 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Tribhuvan Singh Rathore",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "Interra Systems",
                    "Package": "10",
                    "Test Date": "20 August",
                    "Result Date": "20 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Shashank Joshi",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "Interra Systems",
                    "Package": "10",
                    "Test Date": "20 August",
                    "Result Date": "20 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Priya Thakur",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "Interra Systems",
                    "Package": "10",
                    "Test Date": "20 August",
                    "Result Date": "20 August",
                    "Offer": "FTE",
                    "undefined": "GAP PPO"
                },
                {
                    "Name": "Sachin Chouhan",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "Interra Systems",
                    "Package": "10",
                    "Test Date": "20 August",
                    "Result Date": "20 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Saksham Jain",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "OYO",
                    "Package": "10.5",
                    "Test Date": "19 Aug",
                    "Result Date": "21 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Rohan Chouhan",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "OYO",
                    "Package": "10.5",
                    "Test Date": "19 Aug",
                    "Result Date": "21 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Ayush Sharma",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "OYO",
                    "Package": "10.5",
                    "Test Date": "19 Aug",
                    "Result Date": "21 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Kunal Mittal",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "OYO",
                    "Package": "10.5",
                    "Test Date": "19 Aug",
                    "Result Date": "21 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Vipasha Chandwani",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "Goldman Sachs",
                    "Package": "23",
                    "Test Date": "2 August",
                    "Result Date": "3 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Pratik Pandey",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "Servicenow",
                    "Package": "25",
                    "Test Date": "4 August",
                    "Result Date": "5 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Disha Kala",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "Servicenow",
                    "Package": "25",
                    "Test Date": "4 August",
                    "Result Date": "5 August",
                    "Offer": "0"
                },
                {
                    "Name": "Manas Garg",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "QuadEye",
                    "Package": "17",
                    "Test Date": "9 August",
                    "Result Date": "9 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Kanika Jain",
                    "ID": "2016KUCP10",
                    "Branch": "CSE",
                    "Company": "QuadEye",
                    "Package": "17",
                    "Test Date": "9 August",
                    "Result Date": "9 August",
                    "Offer": "FTE"
                },
                {
                    "Name": "Akarshit Gupta",
                    "ID": "2016KUCP11",
                    "Branch": "ECE",
                    "Company": "DROOM",
                    "Package": "7.5",
                    "Test Date": "29 Aug",
                    "Result Date": "29 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Anjali Garg",
                    "ID": "2016KUCP12",
                    "Branch": "ECE",
                    "Company": "DROOM",
                    "Package": "7.5",
                    "Test Date": "29 Aug",
                    "Result Date": "29 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Roopal Agarwal",
                    "ID": "2016KUCP13",
                    "Branch": "ECE",
                    "Company": "DROOM",
                    "Package": "7.5",
                    "Test Date": "29 Aug",
                    "Result Date": "29 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Siva Kumar",
                    "ID": "2016KUCP14",
                    "Branch": "ECE",
                    "Company": "DROOM",
                    "Package": "7.5",
                    "Test Date": "29 Aug",
                    "Result Date": "29 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Astha Gurjar",
                    "ID": "2016KUCP15",
                    "Branch": "CSE",
                    "Company": "DROOM",
                    "Package": "7.5",
                    "Test Date": "29 Aug",
                    "Result Date": "29 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Apoorv agarwal",
                    "ID": "2016KUCP16",
                    "Branch": "CSE",
                    "Company": "INDUS VALLEY",
                    "Package": "8",
                    "Test Date": "22 Aug",
                    "Result Date": "23 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Urvashi Agarwal",
                    "ID": "2016KUCP17",
                    "Branch": "CSE",
                    "Company": "INDUS VALLEY",
                    "Package": "8",
                    "Test Date": "22 Aug",
                    "Result Date": "23 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Arpit Gupta",
                    "ID": "2016KUCP18",
                    "Branch": "ECE",
                    "Company": "INDUS VALLEY",
                    "Package": "8",
                    "Test Date": "22 Aug",
                    "Result Date": "23 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Utkarsh Yadav",
                    "ID": "2016KUCP19",
                    "Branch": "CSE",
                    "Company": "INFOSYS",
                    "Package": "8",
                    "Test Date": "31 Aug",
                    "Result Date": "31 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Nidhi Mantri",
                    "ID": "2016KUCP20",
                    "Branch": "CSE",
                    "Company": "INFOSYS",
                    "Package": "8",
                    "Test Date": "31 Aug",
                    "Result Date": "31 Aug",
                    "Offer": "FTE"
                },
                {
                    "Name": "Mayank Kumar",
                    "ID": "2016KUCP21",
                    "Branch": "ECE",
                    "Company": "Toshiba",
                    "Package": "6",
                    "Offer": "FTE"
                },
                {
                    "Name": "Tejeshwar Saini",
                    "ID": "2016KUCP22",
                    "Branch": "CSE",
                    "Company": "FlipKart",
                    "Package": "24",
                    "Offer": "FTE"
                },
                {
                    "Name": "Shivani",
                    "ID": "2016KUCP23",
                    "Branch": "CSE",
                    "Company": "Analytics Quotient",
                    "Package": "6.5",
                    "Test Date": "29 Aug",
                    "Result Date": "9 Spt",
                    "Offer": "FTE"
                },
                {
                    "Name": "Harshita Seth",
                    "ID": "2016KUCP24",
                    "Branch": "CSE",
                    "Company": "Analytics Quotient",
                    "Package": "6.5",
                    "Test Date": "29 Aug",
                    "Result Date": "9 Sept",
                    "Offer": "FTE"
                },
                {
                    "Name": "Aman Anand",
                    "ID": "2016KUEC25",
                    "Branch": "ECE",
                    "Company": "Analytics Quotient",
                    "Package": "6.5",
                    "Test Date": "29 Aug",
                    "Result Date": "9 Sept",
                    "Offer": "FTE"
                },
                {
                    "Name": "Samreen Fatma",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "ATCS",
                    "Package": "6.3",
                    "Test Date": "16 Sept",
                    "Result Date": "18 Sept",
                    "Offer": "FTE"
                },
                {
                    "Name": "Shivani Singhal",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "ATCS",
                    "Package": "6.3",
                    "Test Date": "16 Sept",
                    "Result Date": "18 Sept",
                    "Offer": "FTE"
                },
                {
                    "Name": "Saransh Jain",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "ATCS",
                    "Package": "6.3",
                    "Test Date": "16 Sept",
                    "Result Date": "18 Sept",
                    "Offer": "FTE",
                    "undefined": "PPO"
                },
                {
                    "Name": "Shubham Guglani",
                    "ID": "2016KUCP",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Package": "29.25",
                    "Test Date": "PPO",
                    "Offer": "FTE"
                },
                {
                    "Name": "Mohit Garg",
                    "ID": "2016KUEC2050",
                    "Branch": "ECE",
                    "Company": "QA infotech",
                    "Package": "3.75",
                    "Test Date": "20 Sep",
                    "Result Date": "20Sep",
                    "Offer": "FTE"
                },
                {
                    "Name": "Mohit",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "Affine",
                    "Package": "6",
                    "Offer": "FTE"
                },
                {
                    "Name": "Nisha",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "Ericsson",
                    "Package": "5.75",
                    "Offer": "FTE"
                },
                {
                    "Name": "Mishant",
                    "ID": "2016KUEC20",
                    "Branch": "ECE",
                    "Company": "Ericsson",
                    "Package": "5.75",
                    "Offer": "FTE"
                },
                {
                    "Name": "Sanjay Goswami",
                    "ID": "2016KUEC21",
                    "Branch": "ECE",
                    "Company": "Virtusa",
                    "Package": "5",
                    "Offer": "FTE"
                },
                {
                    "Name": "Dileep Kumar",
                    "ID": "2016KUEC22",
                    "Branch": "ECE",
                    "Company": "Virtusa",
                    "Package": "5",
                    "Offer": "FTE"
                },
                {
                    "Name": "Ankit swamii",
                    "ID": "2016KUEC23",
                    "Branch": "ECE",
                    "Company": "Virtusa",
                    "Package": "5",
                    "Offer": "FTE"
                },
                {
                    "Name": "Deepika joshi",
                    "ID": "2016KUEC2013",
                    "Branch": "ECE",
                    "Company": "Q3 Technologies",
                    "Package": "8",
                    "Test Date": "6 Nov",
                    "Result Date": "6 Nov",
                    "Offer": "FTE"
                },
                {
                    "Name": "Ashutosh rajput",
                    "ID": "2016KUEC2020",
                    "Branch": "ECE",
                    "Company": "Q3 Technologies",
                    "Package": "8",
                    "Test Date": "6 Nov",
                    "Result Date": "6 Nov",
                    "Offer": "FTE"
                },
                {
                    "Name": "Saurav raj",
                    "ID": "2016KUEC2051",
                    "Branch": "ECE",
                    "Company": "Q3 Technologies",
                    "Package": "8",
                    "Test Date": "6 Nov",
                    "Result Date": "6 Nov",
                    "Offer": "FTE"
                },
                {
                    "Name": "Manoj Kumar",
                    "ID": "2016KUCP2016",
                    "Branch": "CSE",
                    "Company": "Q3 Technologies",
                    "Package": "8",
                    "Test Date": "6 Nov",
                    "Result Date": "6 Nov",
                    "Offer": "FTE"
                },
                {
                    "Name": "Nidhi",
                    "Branch": "ECE",
                    "Company": "Pie Infocomm",
                    "Package": "4.5",
                    "Test Date": "23 Jan",
                    "Result Date": "24 Jan",
                    "Offer": "FTE"
                },
                {
                    "Name": "Mahmohan Kumar",
                    "Branch": "ECE",
                    "Company": "Sagacious IP",
                    "Package": "4.2",
                    "Test Date": "28 Jan",
                    "Result Date": "7 Feb",
                    "Offer": "FTE"
                }
            ]
        },
        {
            "IIIT Kota - Internship" : [
                {
                    "Name": "Shivam Garg",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Test Date": "8 Aug",
                    "Result Date": "8 Aug",
                    "Offer": "Interns"
                },
                {
                    "Name": "Jayansh Goyal",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Test Date": "8 Aug",
                    "Result Date": "8 Aug",
                    "Offer": "Interns"
                },
                {
                    "Name": "Vibhor Rawal",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Test Date": "8 Aug",
                    "Result Date": "8 Aug",
                    "Offer": "Interns"
                },
                {
                    "Name": "Ayush Rawal",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Test Date": "8 Aug",
                    "Result Date": "8 Aug",
                    "Offer": "Interns"
                },
                {
                    "Name": "Madhur Sharma",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Amazon",
                    "Stipend": "50K",
                    "Test Date": "8 Aug",
                    "Result Date": "8 Aug",
                    "Offer": "Interns"
                },
                {
                    "Name": "Ridhi Agrawal",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Droom",
                    "Stipend": "15k"
                },
                {
                    "Name": "Himanshu Sharma",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Droom",
                    "Stipend": "15k"
                },
                {
                    "Name": "Ashish Uniyal",
                    "ID": "2017kucp",
                    "Branch": "CSE",
                    "Company": "Droom",
                    "Stipend": "15k"
                }
            ]
        }
    ];

    // status
    app.selectedProgram = 'B.Tech.';
    app.selectedBranch = '';
    app.programs = [];
    app.branches = [];
    app.students = [];

    // all programs
    app.placements.forEach(function (program) {
        app.programs.push(Object.keys(program)[0]);
    });

    app.programs = [...new Set(app.programs)];

    // change branch method
    $scope.changedProgram = function() {

        app.placements.forEach(function (program) {
            if(Object.keys(program)[0] === app.selectedProgram) {
                app.students = [...new Set(Object.values(program)[0])];
                //console.log(app.students);
                app.branches = [];

                app.students.forEach(function(student) {
                    //console.log(student.Branch);
                    app.branches.push(student.Branch);
                });
                app.branches = [...new Set(app.branches)];
                //console.log(app.branches);
            }
        });
    };

    $scope.changedProgram();

    // change branch
    $scope.changeBranch = function () {

        $scope.changedProgram();

        if(app.selectedBranch.length > 0) {
            app.students = app.students.filter(function (student) {
                return student.Branch === app.selectedBranch;
            });
        }
    }
});
