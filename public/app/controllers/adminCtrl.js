/*
    Controller written by - Pankaj tanwar
*/
angular.module('adminController', ['adminServices'])

// Add new company controller
.controller('addNewCompanyCtrl', function (admin,$scope) {

    var app = this;

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

    var app = this;

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
            app.company = data.data.companyDetail;
            convertAllDateStringsToDateObj(app.company);
        }
    });

    // Convert all date strings to date objects for editing
    function convertAllDateStringsToDateObj(company) {

        if('selection_process' in company) {
            if('pre_placement_talk' in company.selection_process) {
                if('date' in app.company.selection_process.pre_placement_talk) {
                    app.company.selection_process.pre_placement_talk.date = new Date(company.selection_process.pre_placement_talk.date);
                }
            }
            if('aptitude_test' in company.selection_process) {
                if('date' in app.company.selection_process.aptitude_test) {
                    app.company.selection_process.aptitude_test.date = new Date(company.selection_process.aptitude_test.date);
                }
            }
            if('technical_test' in company.selection_process) {
                if('date' in app.company.selection_process.technical_test) {
                    app.company.selection_process.technical_test.date = new Date(company.selection_process.technical_test.date);
                }
            }
            if('group_discussion' in company.selection_process) {
                if('date' in app.company.selection_process.group_discussion) {
                    app.company.selection_process.group_discussion.date = new Date(company.selection_process.group_discussion.date);

                }
            }
            if('personal_interview' in company.selection_process) {
                if('date' in app.company.selection_process.personal_interview) {
                    app.company.selection_process.personal_interview.date = new Date(company.selection_process.personal_interview.date);
                }
            }
        }
        if('joining_date' in company) {
            app.company.joining_date = new Date(company.joining_date);
        }
        if(company.deadline_date) {
            app.company.deadline_date = new Date(company.deadline_date);
        }
    }

    // update company details
    app.updateCompanyDetails = function (company) {
        admin.updateCompanyDetails(company).then(function (data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
            } else {
                app.errorMsg = data.data.message;
                console.log(data.data.error);
            }
        })
    }
})

.controller('registeredStudentsCtrl', function ($routeParams,student, admin,$scope) {
    let app = this;

    function totalRegisteredStudent() {

        app.registeredStudentsData = [];

        admin.getRegisteredStudents($routeParams.company_id).then(function (data) {
            if(data.data.success) {
                app.studentsData = data.data.candidates;
                app.company_name = data.data.name;
                //console.log(app.studentsData);
                for(var i=0;i < app.studentsData.length;i++) {
                    admin.getStudentDetailsByCollegeID(app.studentsData[i].college_id).then(function (data) {
                        if(data.data.success) {
                            app.registeredStudentsData.push(data.data.user);
                        }
                    })
                }
            }
        });
    }

    totalRegisteredStudent();

    $scope.withdrawRegistration = function (college_id) {
        console.log(college_id);

        student.withdrawRegistration(college_id,$routeParams.company_id).then(function (data) {
            console.log(data);
            if(data.data.success) {
                totalRegisteredStudent();
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

