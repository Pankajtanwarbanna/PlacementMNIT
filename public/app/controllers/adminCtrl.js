/*
    Controller written by - Pankaj tanwar
*/
angular.module('adminController', ['adminServices'])

// Add new company controller
.controller('addNewCompanyCtrl', function (admin,$scope) {

    let app = this;

    app.successMsg = '';

    $scope.programs = [
        'UG',
        'MTech',
        'MPlan',
        'MSc',
        'PhD',
        'MBA'
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
    };

    // Add New Company
    app.postCompanyDetails = function (newCompanyData) {

        admin.postCompanyDetails(app.newCompanyData).then(function (data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
        });
    }
})

.controller('editCompanyCtrl', function ($routeParams, admin,student, $scope) {

    let app = this;

    $scope.programs = [
        'UG',
        'MTech',
        'MPlan',
        'MSc',
        'PhD',
        'MBA'
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

    // Get Company Details
    student.getCompanyDetails($routeParams.company_id).then(function (data) {
        if(data.data.success) {
            app.companyDetail = data.data.companyDetail;
            if(typeof app.companyDetail.package === 'string') {
                app.dontShowProgramWisePackage = true;
            }
            convertAllDateStringsToDateObj(app.companyDetail);
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

    // update company details
    app.updateCompanyDetails = function (company) {

        // Loading message while details are updating
        app.loading = true;

        admin.updateCompanyDetails(company).then(function (data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
                app.loading = false;
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        })
    }
})

.controller('registeredStudentsCtrl', function ($routeParams,student, admin,$scope,$window) {

    let app = this;

    // assign javascript method reference in controller
    $scope.saveAsExcel = saveAsExcel;

    // Loading Message
    app.getRegisteredStudentsLoading = true;

    // Get Total Registered Students Function
    function totalRegisteredStudent() {
        admin.getRegisteredStudents($routeParams.company_id).then(function (data) {
            if(data.data.success) {
                app.company = data.data.company;
                app.getRegisteredStudentsLoading = false;
            } else {
                app.errorMsg = data.data.message;
                app.getRegisteredStudentsLoading = false;
            }
        });
    }

    totalRegisteredStudent();

    // Delete Registration
    $scope.withdrawRegistration = function (college_id) {

        // Loading True
        app.getRegisteredStudentsLoading = true;

        // Withdraw Candidates Registration
        student.withdrawRegistration(college_id,$routeParams.company_id).then(function (data) {
            if(data.data.success) {
                totalRegisteredStudent();
            }
        })
    };

    // export
    app.exportResumesOfRegisteredStudents = function () {

        // admin exporting resumes
        admin.exportResumesOfRegisteredStudents($routeParams.company_id).then(function (data) {

            console.log(data);
            if(data.status.toString() === '200') {
                // First Method
                const a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([data.data],{type:'application/zip'}));
                a.setAttribute("download", app.company.company_name.split(' ').join('_') + "_Resumes.zip");
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

            }

            // Second Method with Object_id.zip file name
            /*
            let URL = $window.URL || $window.webkitURL || $window.mozURL || $window.msURL;

            if ( URL ) {

                let blob = new Blob([data.data],{type:'application/zip'});
                let url = URL.createObjectURL(blob);
                $window.open(url);
            }
            */

            // Third Method with Object_id.zip
            /*
            let file = new File([data.data], {type: "application/zip"});
            let exportUrl = URL.createObjectURL(file);
            window.location.assign(exportUrl);
            URL.revokeObjectURL(exportUrl);
            */
        })
    }
})

// Coordinator Controller
.controller('coordinatorCtrl', function (admin, $scope) {

    let app = this;

    // By Default - SPC Profile
    $scope.selectedRole = 'spc';

    // get all coordinators from DB
    function getAllCoordinators() {

        app.getAllCoordinatorsLoading = true;

        admin.getAllCoordinators().then(function (data) {
            if(data.data.success) {
                app.ptpCoordinators = data.data.coordinators;
                app.getAllCoordinatorsLoading = false;
            } else {
                app.errorMsg = data.data.message;
                app.getAllCoordinatorsLoading = false;
            }
        })
    }

    getAllCoordinators();

    // add coordinator form submission
    app.addCoordinator = function (coordinatorData) {
        // loading
        app.loading = true;
        app.loadingMsg = 'Hold on, adding new coordinator..';

        admin.addCoordinator(app.coordinatorData).then(function (data) {
            if(data.data.success) {

                app.loadingMsg = data.data.message + '. Notifying coordinator...';
                app.errorMsg = '';

                admin.notifyCoordinatorForRegistration(app.coordinatorData).then(function (data) {
                    console.log(data);
                    if(data.data.success) {
                        app.successMsg = data.data.message;
                        app.loading = false;
                        getAllCoordinators();
                    } else {
                        app.errorMsg = data.data.message;
                        app.loading = false;
                    }
                });
                

            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        })
    }

})

.controller('studentsManagementCtrl', function ($scope, admin) {
    var app = this;

    $scope.searchByID = function (studentID) {
        app.errorMsg = '';
        //console.log(studentID);
        app.searchingByID = false;
        admin.searchByID($scope.studentID.toUpperCase()).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.studentData = data.data.user;
                app.searchingByID = true;
            } else {
                app.errorMsg = data.data.message;
            }
        })
    };

    app.updateProfile = function (studentData) {
        app.profileUpdateSuccessMsg = false;
        app.profileUpdateErrorMsg = false;

        admin.updateStudentProfile(app.studentData).then(function (data) {
            if(data.data.success) {
                app.profileUpdateSuccessMsg = data.data.message;
            } else {
                app.profileUpdateErrorMsg = data.data.message;
            }
        })
    }
})

.controller('interviewsManagementCtrl', function (admin) {

    var app = this;

    // get all interviews
    admin.getAllInterviews().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.interviews = data.data.interviews;
        } else {
            app.errorMsg = data.data.message;
        }
    })
})

// edit experience ctrl
.controller('editExperienceCtrl', function ($routeParams, student,admin) {

    let app = this;

    // get experience
    student.getExperience($routeParams.experience_id).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.experienceData = data.data.experience;
        }
    });

    // update experience
    app.editInterviewExperience = function (experienceData) {
        admin.editInterviewExperience(app.experienceData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
            }
        })
    }

})

// feedbacks controller
.controller('feedbackCtrl', function (admin) {

    var app = this;

    admin.fetchFeedbacks().then(function (data) {
        //console.log(data);
        if(data.data.success) {
            app.feedbacks = data.data.feedbacks;
        }
    })
});

