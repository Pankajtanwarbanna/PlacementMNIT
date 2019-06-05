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

// User Profile Controller
.controller('profileCtrl', function (user) {
    console.log('profile page testing');
})

// Company Registration Controller
.controller('companyRegistrationCtrl', function (user) {

    var app = this;

    user.getCompanyDetails().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.companies = data.data.companies;
        }
    })
})

// Add new company controller
.controller('addNewCompanyCtrl', function (user) {

    var app = this;

    app.postCompanyDetails = function (newCompanyData) {
        console.log(app.newCompanyData);
        user.postCompanyDetails(app.newCompanyData).then(function (data) {
            console.log(data);
        });
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
});