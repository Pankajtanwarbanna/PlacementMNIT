/*
    Controller written by - Pankaj tanwar
*/

angular.module('emailController', ['userServices'])

// Email controller
.controller('emailCtrl', function ($routeParams,user,$timeout,$location) {

    var app =  this;

    user.activateAccount($routeParams.token).then(function (data) {

        app.successMsg = false;
        app.errorMsg = false;

        if(data.data.success) {
            app.successMsg = data.data.message + '....Redirecting to login page';
            
            $timeout(function () {
                $location.path('/register');
            }, 2000);
        } else {
            app.errorMsg = data.data.message;
        }
    });

})

// Resend activation link controller
.controller('resendCtrl', function (user,$timeout, $location) {

    var app = this;

    this.checkCredientials = function (logData) {

        app.errorMsg = '';
        app.successMsg = '';
        app.loading = true;
        app.disabled = false;

        user.checkCredientials(app.logData).then(function (data) {

            if(data.data.success) {

                user.resendEmail(app.logData).then(function (data) {

                    if(data.data.success) {
                        app.disabled = true;
                        app.loading = false;
                        app.successMsg = data.data.message + ' Redirecting...';

                        $timeout(function () {
                            $location.path('/');
                        }, 2000);


                    } else {
                        app.loading = false;
                        app.errorMsg = data.data.message;
                    }
                });

            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    }

})

// Forgot username and password controller
.controller('forgotCtrl', function (user,$timeout,$location) {

    var app = this;

    this.forgotUsername = function (logData) {

        app.successMsgUsername = false;
        app.errorMsgUsername = false;
        app.disabledUsername = true;

        user.forgotUsername(app.logData).then(function (data) {

            if(data.data.success) {
                app.successMsgUsername = data.data.message + ' Redirecting....';

                $timeout(function () {
                    $location.path('/');
                }, 2000);
            } else {
                app.disabledUsername = false;
                app.errorMsgUsername = data.data.message;
            }
        });
    };

    this.forgotPassword = function (logData) {

        app.successMsgPassword = false;
        app.errorMsgPassword = false;
        app.disabledPassword = true;

        user.forgotPasswordLink(app.logData).then(function (data) {

            if(data.data.success) {
                app.successMsgPassword = data.data.message;
            } else {
                app.disabledPassword = false;
                app.errorMsgPassword = data.data.message;
            }

        });
    }
})



// Controller to reset password
.controller('resetCtrl', function ($routeParams,user,$timeout, $location) {
    console.log($routeParams.token);

    var app = this;
    app.successMsg = false;
    app.errorMsg = false;
    app.disabled = true;
    app.resetPassword = false;

    user.forgotPasswordCheckToken($routeParams.token).then(function (data) {

        if(data.data.success) {
            app.disabled = false;
            app.resetPassword = true;
        } else {
            app.errorMsg = data.data.message + ' You cannot change password';
        }
    });

    this.changePassword = function (logData) {
        console.log(app.logData);

        app.errorMsg = false;
        app.successMsg = false;
        app.disabled = true;

        if(app.resetPassword) {

            user.resetPassword($routeParams.token,app.logData).then(function (data) {

                if(data.data.success) {
                    app.successMsg = data.data.message + ' Redirecting....';

                    $timeout(function () {
                        $location.path('/');
                    }, 2000);
                } else {
                    app.disabled = false;
                    app.errorMsg = data.data.message;
                }
            });

        }
    }

});