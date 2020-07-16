/*
    Controller written by - Pankaj tanwar
*/

angular.module('mainController', ['authServices','studentServices'])

.controller('mainCtrl', function ($window,$http, auth, $timeout, $location, $route, authToken, $rootScope, student) {

    let app = this;

    app.loadme = false;
    app.home = true;
    app.schedule = false;
    app.blockedProfile = false;

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        //console.log($window.location.pathname);
        //console.log(next.$$route);
        if(next.$$route) {
            //console.log('we are not at home page');
            app.home = false;
        } else {
            app.home = true;
        }

        if(auth.isLoggedIn()) {

            //console.log('User is logged in.');
            app.isLoggedIn = true;
            auth.getUser().then(function (data){
                app.student_name = data.data.student_name;
                app.college_id = data.data.college_id;
                app.gender = data.data.gender;
                app.department = data.data.department;
                app.passout_batch = data.data.passout_batch;
                if(data.data.red_flags >= 3) {
                    app.blockedProfile = true;
                }

                student.getPermission().then(function (data) {

                    app.permission = data.data.permission;

                    if(data.data.permission === 'admin' || data.data.permission === 'spc' || data.data.permission === 'faculty-coordinator') {
                        app.authorized = true;
                        app.loadme = true;
                    } else {
                        app.authorized = false;
                        app.loadme = true;
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
                auth.logout();
                $route.reload();
            })

        } else {

            //console.log('User is not logged in.');
            app.isLoggedIn = false;
            app.name = '';
            app.loadme = true;
        }

    });

    // OTP Not set by default
    app.isOTPsent = false;

    // Check Details and send OTP to EMAIL
    this.sendOTPForEmailVerificationIfValidLogin = function (logData) {

        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;

        auth.sendOTPForEmailVerificationIfValidLogin(app.logData).then(function (data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
                app.loading = false;
                app.isOTPsent = true;
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        })
    };

    // Login Now
    this.doLogin = function (logData) {
        //console.log(this.logData);
        app.loginSuccessMsg = '';
        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;
        app.expired = false;
        app.disabled = false;

        auth.login(app.logData).then(function (data) {
            //console.log(data);
            //app.loading = true;

            if(data.data.success) {
                app.loading = false;
                app.loginSuccessMsg = data.data.message + ' Redirecting to home page...';
                $timeout(function () {
                    $location.path('/');
                    app.logData = {};
                    app.loginSuccessMsg = false;
                    app.successMsg = false;
                    app.isOTPsent = false;
                }, 2000);

            } else {
                app.disabled = false;
                if(data.data.expired) {
                    app.disabled = true;
                    app.loading = false;
                    app.errorMsg = data.data.message;
                    app.expired = data.data.expired;
                } else {
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            }
        });
    };

    this.logout = function () {
        auth.logout();
        $location.path('/logout');
        $timeout(function () {
            $location.path('/');
        }, 2000);
    };

});
