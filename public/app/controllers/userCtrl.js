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
.controller('companyregistrationCtrl', function () {
    console.log('Company registration ctrl testing');
})

// Company Schedule Controller
.controller('companyscheduleCtrl', function () {
    console.log('Testing companyschedule ctrl');
});