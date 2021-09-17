/*
    Controller written by - Pankaj Tanwar
*/
angular
  .module("adminController", ["adminServices"])

  // Add new company controller
  .controller("addNewCompanyCtrl", function (admin, $scope) {
    let app = this;

    app.successMsg = "";

    $scope.programs = ["UG", "MTech", "MPlan", "MSc", "PhD", "MBA"];

    $scope.programsBranches = {
      ug: [
        "Civil Engineering",
        "Electrical Engineering",
        "Chemical Engineering",
        "Mechanical Engineering",
        "Computer Science & Engineering",
        "Metallurgical & Material Science",
        "Electronics & Communication Engineering",
        "Architecture & Planing Engineering",
      ],
      mtech: [
        "Electronics & Communication",
        "Computer Science & Engineering",
        "Electrical Engineering",
        "Chemical Engineering",
        "Mechanical Engineering",
        "Civil Engineering",
        "Metallurgical &Materials Engineering",
        "Materials Research Centre",
        "National Centre for Disaster Mitigation and Management",
        "Centre for Energy and Environment",
      ],
      mplan: ["Master of Planning: Urban Planning"],
      msc: ["Mathematics", "Chemistry", "Physics"],
      mba: ["Marketing", "Human Resource", "Finance", "Operations"],
      phd: ["Architecture", "Management", "Engineering", "Sciences"],
    };

    $scope.programsDiv = {
      ug: false,
      mtech: false,
      mplan: false,
      msc: false,
      mba: false,
      phd: false,
    };

    $scope.showBranchesDiv = function (program) {
      $scope.programsDiv[program.toLowerCase()] =
        !$scope.programsDiv[program.toLowerCase()];
    };

    // Add New Company
    app.postCompanyDetails = function (newCompanyData) {
      admin.postCompanyDetails(app.newCompanyData).then(function (data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };
  })

  .controller(
    "editCompanyCtrl",
    function ($routeParams, admin, student, $scope) {
      let app = this;

      $scope.programs = ["UG", "MTech", "MPlan", "MSc", "PhD", "MBA"];

      $scope.programsBranches = {
        ug: [
          "Civil Engineering",
          "Electrical Engineering",
          "Chemical Engineering",
          "Mechanical Engineering",
          "Computer Science & Engineering",
          "Metallurgical & Material Science",
          "Electronics & Communication Engineering",
          "Architecture & Planing Engineering",
        ],
        mtech: [
          "Electronics & Communication",
          "Computer Science & Engineering",
          "Electrical Engineering",
          "Chemical Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Metallurgical &Materials Engineering",
          "Materials Research Centre",
          "National Centre for Disaster Mitigation and Management",
          "Centre for Energy and Environment",
        ],
        mplan: ["Master of Planning: Urban Planning"],
        msc: ["Mathematics", "Chemistry", "Physics"],
        mba: ["Marketing", "Human Resource", "Finance", "Operations"],
        phd: ["Architecture", "Management", "Engineering", "Sciences"],
      };

      // Get Company Details
      student.getCompanyDetails($routeParams.company_id).then(function (data) {
        if (data.data.success) {
          app.companyDetail = data.data.companyDetail;
          if (typeof app.companyDetail.package === "string") {
            app.dontShowProgramWisePackage = true;
          }
          convertAllDateStringsToDateObj(app.companyDetail);
        }
      });

      // Convert all date strings to date objects for editing
      function convertAllDateStringsToDateObj(company) {
        if ("selection_process" in company) {
          if ("pre_placement_talk" in company.selection_process) {
            if ("date" in company.selection_process.pre_placement_talk) {
              if (company.selection_process.pre_placement_talk.date == null) {
                app.companyDetail.selection_process.pre_placement_talk.date =
                  "";
              } else {
                app.companyDetail.selection_process.pre_placement_talk.date =
                  new Date(company.selection_process.pre_placement_talk.date);
              }
            }
          }
          if ("aptitude_test" in company.selection_process) {
            if ("date" in company.selection_process.aptitude_test) {
              if (company.selection_process.aptitude_test.date == null) {
                app.companyDetail.selection_process.aptitude_test.date = "";
              } else {
                app.companyDetail.selection_process.aptitude_test.date =
                  new Date(company.selection_process.aptitude_test.date);
              }
            }
          }
          if ("technical_test" in company.selection_process) {
            if ("date" in company.selection_process.technical_test) {
              if (company.selection_process.technical_test.date == null) {
                app.companyDetail.selection_process.technical_test.date = "";
              } else {
                app.companyDetail.selection_process.technical_test.date =
                  new Date(company.selection_process.technical_test.date);
              }
            }
          }
          if ("group_discussion" in company.selection_process) {
            if ("date" in company.selection_process.group_discussion) {
              if (company.selection_process.group_discussion.date == null) {
                app.companyDetail.selection_process.group_discussion.date = "";
              } else {
                app.companyDetail.selection_process.group_discussion.date =
                  new Date(company.selection_process.group_discussion.date);
              }
            }
          }
          if ("personal_interview" in company.selection_process) {
            if ("date" in company.selection_process.personal_interview) {
              if (company.selection_process.personal_interview.date == null) {
                app.companyDetail.selection_process.personal_interview.date =
                  "";
              } else {
                app.companyDetail.selection_process.personal_interview.date =
                  new Date(company.selection_process.personal_interview.date);
              }

              app.companyDetail.selection_process.personal_interview.date =
                new Date(company.selection_process.personal_interview.date);
            }
          }
        }
        if ("joining_date" in company) {
          if ("joining_date" in company) {
            if (company.joining_date == null) {
              app.companyDetail.joining_date = "";
            } else {
              app.companyDetail.joining_date = new Date(company.joining_date);
            }
          }
        }
        if (company.deadline_date) {
          app.companyDetail.deadline_date = new Date(company.deadline_date);
        }
      }

      // update company details
      app.updateCompanyDetails = function (company) {
        // Loading message while details are updating
        app.loading = true;

        admin.updateCompanyDetails(company).then(function (data) {
          if (data.data.success) {
            app.successMsg = data.data.message;
            app.loading = false;
          } else {
            app.errorMsg = data.data.message;
            app.loading = false;
          }
        });
      };
    }
  )

  // Send notification to all students at just one click.
  .controller(
    "companyNotificationCtrl",
    function ($routeParams, $scope, admin) {
      let app = this;

      app.postingNotificationLoading = false;

      // Send Notification
      app.sendNotification = function (notificationData) {
        notificationData.companyId = $routeParams.company_id;
        if ($scope.confirmNotification) {
          app.postingNotificationLoading = true;
          admin.sendCompanyNotification(notificationData).then(function (data) {
            if (data.data.success) {
              app.postingNotificationLoading = false;
              app.successMsg = data.data.message;
              getNotifs();
            } else {
              app.postingNotificationLoading = false;
              app.errorMsg = data.data.message;
            }
          });
        } else {
          $scope.confirmNotification = true;
        }
      };

      // get notifications
      function getNotifs() {
        admin
          .getNotifications({ reference: "company_" + $routeParams.company_id })
          .then(function (data) {
            if (data.data.success) {
              app.notifications = data.data.notifications;
            } else {
              app.errorMsg = data.data.message;
            }
          });
      }

      getNotifs();
    }
  )

  .controller(
    "registeredStudentsCtrl",
    function ($routeParams, student, admin, $scope) {
      let app = this;

      // assign javascript method reference in controller
      $scope.saveAsExcel = saveAsExcel;

      $scope.saveAsCSV = saveAsCSV;

      // Loading Message
      app.getRegisteredStudentsLoading = true;

      // Get Total Registered Students Function
      function totalRegisteredStudent() {
        admin
          .getRegisteredStudents($routeParams.company_id)
          .then(function (data) {
            if (data.data.success) {
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
        admin
          .withdrawApplication({
            college_id: college_id,
            company_id: $routeParams.company_id,
          })
          .then(function (data) {
            if (data.data.success) {
              totalRegisteredStudent();
            }
          });
      };

      // export
      app.exportResumesOfRegisteredStudents = function () {
        // admin exporting resumes
        admin
          .exportResumesOfRegisteredStudents($routeParams.company_id)
          .then(function (data) {
            console.log(data);
            if (data.status.toString() === "200") {
              // First Method
              const a = document.createElement("a");
              a.href = URL.createObjectURL(
                new Blob([data.data], { type: "application/zip" })
              );
              a.setAttribute(
                "download",
                app.company.company_name.split(" ").join("_") + "_Resumes.zip"
              );
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
          });
      };
    }
  )

  // Coordinator Controller
  .controller("coordinatorCtrl", function (admin, $scope) {
    let app = this;

    // By Default - SPC Profile
    $scope.selectedRole = "spc";

    // get all coordinators from DB
    function getAllCoordinators() {
      app.getAllCoordinatorsLoading = true;

      admin.getAllCoordinators().then(function (data) {
        if (data.data.success) {
          app.ptpCoordinators = data.data.coordinators;
          app.getAllCoordinatorsLoading = false;
        } else {
          app.errorMsg = data.data.message;
          app.getAllCoordinatorsLoading = false;
        }
      });
    }

    getAllCoordinators();

    // add coordinator form submission
    app.addCoordinator = function (coordinatorData) {
      // loading
      app.loading = true;
      app.loadingMsg = "Hold on, adding new coordinator..";

      admin.addCoordinator(app.coordinatorData).then(function (data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
          app.loading = false;
          getAllCoordinators();
        } else {
          app.errorMsg = data.data.message;
          app.loading = false;
        }
      });
    };
  })

  .controller("studentsManagementCtrl", function ($scope, admin) {
    let app = this;

    $scope.searchByID = function (studentID) {
      app.errorMsg = "";
      //console.log(studentID);
      app.searchingByID = false;
      if (!$scope.studentID) {
        app.errorMsg = "Missing student college ID.";
      } else {
        admin.searchByID($scope.studentID.toUpperCase()).then(function (data) {
          console.log(data);
          if (data.data.success) {
            app.studentData = data.data.user;
            app.searchingByID = true;
          } else {
            app.errorMsg = data.data.message;
          }
        });
      }
    };

    app.updateProfile = function (studentData) {
      app.profileUpdateSuccessMsg = false;
      app.profileUpdateErrorMsg = false;

      admin.updateStudentProfile(app.studentData).then(function (data) {
        if (data.data.success) {
          app.profileUpdateSuccessMsg = data.data.message;
        } else {
          app.profileUpdateErrorMsg = data.data.message;
        }
      });
    };
  })

  // Red Flag management controller
  .controller("redFlagManagementCtrl", function (admin) {
    let app = this;

    app.student = false;

    // get red flag history function
    function getRedFlagHistory(studentData) {
      app.errorMsg = "";
      app.fetchedRedFlagHistory = false;

      if (!studentData.collegeID) {
        app.errorMsg = "Missing college ID.";
      } else {
        app.studentID = studentData.collegeID;
        admin.getRedFlagHistory(studentData).then(function (data) {
          console.log(data.data);
          if (data.data.success) {
            app.student = data.data.student;
            app.redFlagHistory = data.data.redFlagHistory;
            app.redFlags = data.data.redFlags;
            app.fetchedRedFlagHistory = true;
          } else {
            app.errorMsg = data.data.message;
          }
        });
      }
    }
    // Search Student Red Flag History
    app.searchStudent = function (studentData) {
      getRedFlagHistory(studentData);
    };

    // Add Red Flag to student
    app.addRedFlag = function (redFlagData) {
      if (!app.studentID) {
        app.errorMsg = "Student ID not selected.";
      } else {
        admin
          .addRedFlag({ ...redFlagData, receiver: app.studentID })
          .then(function (data) {
            if (data.data.success) {
              app.addRedFlagSuccessMsg = data.data.message;
              getRedFlagHistory({ collegeID: app.studentID });
              app.removeRedFlagSuccessMsg = "";
              app.removeRedFlagErrorMsg = "";
            } else {
              app.addRedFlagErrorMsg = data.data.message;
            }
          });
      }
    };

    // remove red Flag
    app.removeRedFlag = function (redFlagID) {
      app.removeRedFlagSuccessMsg = "";
      app.removeRedFlagErrorMsg = "";

      admin.removeRedFlag({ redFlagID: redFlagID }).then(function (data) {
        if (data.data.success) {
          getRedFlagHistory({ collegeID: app.studentID });
          app.removeRedFlagSuccessMsg = data.data.message;
        } else {
          app.removeRedFlagErrorMsg = data.data.message;
        }
      });
    };
  })

  .controller("interviewsManagementCtrl", function (admin) {
    var app = this;

    // get all interviews
    admin.getAllInterviews().then(function (data) {
      console.log(data);
      if (data.data.success) {
        app.interviews = data.data.interviews;
      } else {
        app.errorMsg = data.data.message;
      }
    });
  })

  // edit experience ctrl
  .controller("editExperienceCtrl", function ($routeParams, student, admin) {
    let app = this;

    // get experience
    student.getExperience($routeParams.experience_id).then(function (data) {
      console.log(data);
      if (data.data.success) {
        app.experienceData = data.data.experience;
      }
    });

    // update experience
    app.editInterviewExperience = function (experienceData) {
      admin.editInterviewExperience(app.experienceData).then(function (data) {
        console.log(data);
        if (data.data.success) {
          app.successMsg = data.data.message;
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };
  })

  // add new placement controller
  .controller("addNewPlacementCtrl", function (admin, $scope) {
    let app = this;
    app.candidates = [];

    // Adding candidate
    app.addCandidate = function (candidate) {
      app.candidateErrorMsg = "";
      if (
        !app.candidates.find(
          (student) => student.college_id === candidate.toUpperCase()
        )
      ) {
        admin.searchByID(candidate).then(function (data) {
          if (data.data.success) {
            app.candidates.push(data.data.user);
            $scope.candidate = ""; // clear scope
          } else {
            app.candidateErrorMsg = data.data.message;
          }
        });
      } else {
        app.candidateErrorMsg = "Candidate already added.";
      }
    };

    // remove candidate from local Candidates list
    app.removeCandidate = function (candidate) {
      app.candidates = app.candidates.filter((student) => {
        return student.college_id !== candidate.toUpperCase();
      });
    };

    // add Placement details to DB
    app.postPlacementDetails = function (newPlacementData) {
      app.loading = true;
      app.newPlacementData.candidates = app.candidates;

      admin.addPlacement(app.newPlacementData).then(function (data) {
        console.log(data);
        if (data.data.success) {
          app.loading = false;
          app.successMsg = data.data.message;
        } else {
          app.loading = false;
          app.errorMsg = data.data.message;
        }
      });
    };
  })

  // edit placement controller
  .controller("editPlacementCtrl", function (admin, $routeParams) {
    let app = this;

    // get placement
    admin
      .getPlacementsData({ placement_id: $routeParams.placement_id })
      .then(function (data) {
        if (data.data.success) {
          app.placements = data.data.placements[0];
          app.placements = {
            ...app.placements,
            recruitment_date: new Date(app.placements.recruitment_date),
            package: parseInt(app.placements.package),
            intern_duration: parseInt(app.placements.intern_duration),
            intern_stipend: parseInt(app.placements.intern_stipend),
          };
        } else {
          app.errorMsg = data.data.message;
        }
      });

    // update Placement
    app.editPlacementDetails = function () {
      app.placements = {
        ...app.placements,
        package: app.placements.package.toString(),
        intern_duration: app.placements.intern_duration.toString(),
        intern_stipend: app.placements.intern_stipend.toString(),
      };

      admin.editPlacementDetails(app.placements).then(function (data) {
        if (data.data.success) {
          app.successMsg = data.data.message;
        } else {
          app.errorMsg = data.data.message;
        }
      });
    };
  })

  // get all placements
  .controller("placementManagementCtrl", function (admin, $scope) {
    let app = this;

    function getPlacementsData() {
      app.loading = true;
      admin.getPlacementsData().then(function (data) {
        if (data.data.success) {
          app.loading = false;
          app.placements = data.data.placements;
          console.log(app.placements);
        } else {
          app.loading = false;
          app.errorMsg = data.data.message;
        }
      });
    }

    getPlacementsData();
  })

  // feedbacks controller
  .controller("feedbackCtrl", function (admin) {
    let app = this;

    admin.fetchFeedbacks().then(function (data) {
      //console.log(data);
      if (data.data.success) {
        app.feedbacks = data.data.feedbacks;
      }
    });
  });
