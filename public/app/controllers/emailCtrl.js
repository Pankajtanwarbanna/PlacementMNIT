/*
   Controller written by - Pankaj tanwar
*/

angular.module('emailController', ['studentServices'])

// Email controller
.controller('emailCtrl', function ($routeParams,student,$timeout,$location) {

   var app =  this;

   student.activateAccount($routeParams.token).then(function (data) {

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
.controller('resendCtrl', function (student,$timeout, $location) {

   var app = this;

   this.checkCredientials = function (logData) {

       app.errorMsg = '';
       app.successMsg = '';
       app.loading = true;
       app.disabled = false;

       student.checkCredientials(app.logData).then(function (data) {

           if(data.data.success) {

               student.resendEmail(app.logData).then(function (data) {

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
.controller('forgotCtrl', function (student,$timeout,$location) {
   var app = this;

   this.forgotUsername = function (logData) {

       app.successMsgUsername = false;
       app.errorMsgUsername = false;
       app.disabledUsername = true;

       student.forgotUsername(app.logData).then(function (data) {

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

    app.forgotPassword = function (logData) {

       app.successMsgPassword = 'Checking credentials. Please wait...';
       app.errorMsgPassword = '';
       app.disabledPassword = true;

       app.logData.hostname = window.location.origin;

       student.forgotPassword(app.logData).then(function (data) {

           if(data.data.success) {
               app.successMsgPassword = data.data.message;
           } else {
               app.successMsgPassword = '';
               app.disabledPassword = false;
               app.errorMsgPassword = data.data.message;
           }
       });
   }
})



// Controller to reset password
.controller('resetCtrl', function ($routeParams,student,$timeout, $location) {

   let app = this;
   app.successMsg = false;
   app.errorMsg = false;
   app.disabled = true;
   app.resetPassword = false;

   student.forgotPasswordCheckToken($routeParams.token).then(function (data) {

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

           app.logData.token = $routeParams.token;

           student.resetPassword(app.logData).then(function (data) {

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



