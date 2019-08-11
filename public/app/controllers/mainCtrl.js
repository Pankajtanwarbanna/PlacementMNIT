/*
    Controller written by - Pankaj tanwar
*/

angular.module('mainController', ['authServices'])

.controller('mainCtrl', function ($window,$http, auth, $timeout, $location, authToken, $rootScope, user) {

    var app = this;

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
            if(next.$$route.originalPath === '/schedule') {
                app.schedule = true;
            } else {
                app.schedule = false;
            }
        } else {
            app.home = true;
            app.schedule = false;
        }

        if(auth.isLoggedIn()) {

            //console.log('User is logged in.');
            app.isLoggedIn = true;
            auth.getUser().then(function (data){
                //console.log(data);
                app.student_name = data.data.student_name;
                app.college_id = data.data.college_id;
                app.gender = data.data.gender;
                app.department = data.data.department;
                console.log(data.data.red_flags);
                if(data.data.red_flags >= 3) {
                    app.blockedProfile = true;
                }

                user.getPermission().then(function (data) {

                    app.permission = data.data.permission;

                    if(data.data.permission === 'admin') {
                        app.authorized = true;
                        app.loadme = true;
                    } else {
                        app.authorized = false;
                        app.loadme = true;
                    }
                });
            });

        } else {

            //console.log('User is not logged in.');
            app.isLoggedIn = false;
            app.name = '';

            app.loadme = true;
        }

    });

    this.doLogin = function (logData) {
        //console.log(this.logData);
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
                app.successMsg = data.data.message + ' Redirecting to home page...';
                $timeout(function () {
                    $location.path('/');
                    app.logData = '';
                    app.successMsg = false;
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
