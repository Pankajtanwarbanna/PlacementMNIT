/*
    Controller written by - Pankaj tanwar
*/
angular.module('userCtrl',['userServices'])

.controller('regCtrl', function ($scope, $http, $timeout, $location,user) {

    var app = this;

    this.regUser = function (regData) {

        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;

        console.log(app.regData);

        user.create(app.regData).then(function (data) {

            //console.log(data);
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + ' Redirecting to home page...';
                $timeout(function () {
                    $location.path('/');
                }, 2000);

            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
})

// Users Controller
.controller('usersCtrl', function (user) {
    var app = this;

    user.getUsers().then(function (data) {

        if(data.data.success) {
            console.log(app.users);
            app.users = data.data.users;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

// Company Registration Controller
.controller('companyRegistrationCtrl', function (user, $scope, $location, $anchorScroll) {

    var app = this;

    app.noUpcomingCompanies = false;
    app.noPreviousCompanies = false;

    user.getAllUpcomingCompanies().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.upcomingCompanies = data.data.companies;
            if(app.upcomingCompanies.length === 0) {
                app.noUpcomingCompanies = true;
            }
        }
    });

    user.getAllPreviousCompanies().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.previousCompanies = data.data.companies;
            if(app.previousCompanies.length === 0) {
                app.noPreviousCompanies = true;
            }
        }
    });
})

// Add new company controller
.controller('addNewCompanyCtrl', function (user,$scope) {

    var app = this;

    app.successMsg = '';

    $scope.programs = [
        'UG',
        'MTech',
        'MPlan',
        'MSc',
        'PhD'
    ];

    $scope.programsBranches = {
        ug : [
            'Civil Engineering',
            'Electrical Engineering',
            'Chemical Engineering',
            'Mechanical Engineering',
            'Computer Science & Engineering',
            'Metallurgical & Material Science',
            'Electronics & Communication Engineering',
            'Architecture & Planing Engineering'
        ],
        mtech : [
            'Electronics & Communication',
            'Computer Science & Engineering',
            'Electrical Engineering',
            'Chemical Engineering',
            'Mechanical Engineering',
            'Civil Engineering',
            'Metallurgical &Materials Engineering',
            'Materials Research Centre',
            'National Centre for Disaster Mitigation and Management',
            'Centre for Energy and Environment',
        ],
        mplan : [
            'Master of Planning: Urban Planning'
        ],
        msc : [
            'Mathematics',
            'Chemistry',
            'Physics'
        ],
        mba : [
            'Marketing',
            'Human Resource',
            'Finance',
            'Operations'
        ],
        phd : [
            'Architecture',
            'Management',
            'Engineering',
            'Sciences'
        ]
    };

    $scope.programsDiv = {
        ug : false,
        mtech : false,
        mplan : false,
        msc : false,
        mba : false,
        phd : false,
    };

    $scope.showBranchesDiv = function(program) {
        $scope.programsDiv[program.toLowerCase()] = !$scope.programsDiv[program.toLowerCase()];
    }

    app.postCompanyDetails = function (newCompanyData) {
        console.log(app.newCompanyData);
        user.postCompanyDetails(app.newCompanyData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
            }
        });
    }
})

// company controller
.controller('companyCtrl', function (user, $routeParams, $scope) {

    var app = this;

    app.applyStatus = false;
    app.deleteSuccessMsg = '';

    user.getCompanyDetails($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companyDetail = data.data.companyDetail;
            //console.log(app.companyDetail)
        }
    });

    // get company schedule
    user.getCompanySchedule($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companyScheduleData = data.data.schedule;
        }
    });

    // get company notifications
    user.getCompanyNotifications($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companyNotificationsData = data.data.notifications;
        }
    });

    // get all registered students
    user.getAllRegisteredStudentsInCompany($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.registeredCandidates = data.data.candidate;
        }
    });

    function getCandidateApplyStatusFunction() {
        user.getCandidateApplyStatus($routeParams.company_id).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                app.applyStatus = true;
                document.getElementById('oneClickApplyButton').className = 'btn btn-danger btn-rounded';
                document.getElementById('oneClickApplyButton').innerHTML = 'Applied successfully!'
            } else {
                app.applyStatus = false;
                document.getElementById('oneClickApplyButton').className = 'btn btn-success btn-rounded';
                document.getElementById('oneClickApplyButton').value = 'One Click Apply'
            }
        });
    }

    getCandidateApplyStatusFunction();

    app.oneClickApply = function () {
        user.oneClickApply($routeParams.company_id).then(function (data) {
            //console.log(data);
            if(data.data.success) {
                getCandidateApplyStatusFunction();
            }
        })
    };

    app.deleteCompany = function () {
        user.deleteCompany($routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.deleteSuccessMsg = data.data.message;
            }
        })
    };

    app.addScheduleSuccessMsg = '';
    app.addNotificationSuccessMsg = '';

    app.addCompanySchedule = function (scheduleData) {
        console.log(app.scheduleData)
        user.addCompanySchedule(app.scheduleData,$routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.addScheduleSuccessMsg = data.data.message;
            }
        })
    }

    app.addCompanyNotification = function (notificationData) {
        console.log(app.notificationData)
        user.addCompanyNotification(app.notificationData,$routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.addNotificationSuccessMsg = data.data.message;
            }
        })
    }

    app.selectedCandidate = [];
    app.noCandidateSelectedErrorMsg = false;
    app.addResultSuccessMsg = '';

    app.addCandidate = function (candidateId) {
        console.log(candidateId);
        if(app.selectedCandidate.indexOf(candidateId) < 0) {
            app.selectedCandidate.push(candidateId);
            app.noCandidateSelectedErrorMsg = false;
        }
    }

    app.removeCandidate = function (candidateId) {
        app.selectedCandidate.splice(app.selectedCandidate.indexOf(candidateId), 1);
    }

    $scope.alwaysTrue = true;
    $scope.ifNotSelected = function (candidateId) {
        if(app.selectedCandidate.indexOf(candidateId) < 0) {
            return true;
        } else {
            return false;
        }
    }

    // add company result
    app.addCompanyResult = function (resultData) {
        console.log(app.resultData);
        if(app.selectedCandidate.length === 0) {
            app.noCandidateSelectedErrorMsg = true;
        } else {
            app.resultData.candidates = new Array();
            app.selectedCandidate.forEach(function (item) {
                app.resultData.candidates.push(item);
            });
            user.addCompanyResult(app.resultData, $routeParams.company_id).then(function (data) {
                console.log(data);
                if(data.data.success) {
                    app.addResultSuccessMsg = data.data.message;
                }
            })
        }
    }

    // get company result
    user.getCompanyResult($routeParams.company_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companyResult = data.data.result;
        }
    })

    $scope.tabArray = [];

    $scope.activeTab = function (tabID) {
        console.log(tabID);
        console.log(app.companyResult.length)
        for(let i=1;i<=app.companyResult.length;i++) {
            if(i == tabID) {
                $scope.tabArray[i] = true;
                document.getElementById('btn'+i).className = "btn btn-primary";
            } else {
                $scope.tabArray[i] = false;
                document.getElementById('btn'+i).className = "btn btn-outline-primary";
            }
        }
    }
})

// Company Schedule Controller
.controller('companyscheduleCtrl', function (user) {

    let app = this;

    app.successMsg = false;
    app.errorMsg = false;

    user.getSchedule().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.schedule = data.data.schedule;
            //console.log(data.data.schedule);
        } else {
            app.errorMsg = data.data.message;
        }
    });

    app.scheduleEvent = function (scheduleData) {

        //console.log(scheduleData);
        user.scheduleCompany(scheduleData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }

})

.controller('announcementsCtrl', function (user) {

    var app = this;

    app.number = false;

    function updateAnnouncements () {
        user.getAnnouncements().then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.announcements = data.data.announcements;
                if(data.data.announcements.length > 0) {
                    app.number = true;
                }
            }
        });
    }

    updateAnnouncements();

    app.successMsg = false;
    app.errorMsg = false;

    app.postAnnouncement = function (announcementData) {
        console.log(announcementData);
        user.postAnnouncement(announcementData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
                updateAnnouncements();
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }
})


// User Profile Controller
.controller('profileCtrl', function (user) {

    var app = this;

    user.getUserProfile().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.userProfile = data.data.profile;
        }
    });
})

// User timeline controller
.controller('timelineCtrl', function (user) {
    var app = this;

    app.timelineLengthZero = false;

    user.getTimeline().then(function (data) {
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
});