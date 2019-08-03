var app = angular.module('userRoutes', ['ngRoute'])

   .config(function ($routeProvider, $locationProvider) {
       $routeProvider

           .when('/register', {
               templateUrl : '/app/views/users/register.html',
               controller : 'regCtrl',
               controllerAs : 'register',
               authenticated : false
           })

           .when('/login', {
               templateUrl : '/app/views/users/login.html',
               controller : 'regCtrl',
               controllerAs : 'register',
               authenticated : false
           })

           .when('/logout', {
               templateUrl : '/app/views/users/logout.html',
               authenticated : false,
               controller : 'editCtrl',
               controllerAs : 'edit'
           })

           .when('/profile', {
               templateUrl : '/app/views/users/userProfile.html',
               authenticated : true,
               controller : 'profileCtrl',
               controllerAs : 'profile'
           })

           .when('/company-registration', {
               templateUrl : '/app/views/pages/company-registration.html',
               authenticated : true,
               controller : 'companyRegistrationCtrl',
               controllerAs : 'companyRegistration'
           })

           .when('/schedule', {
               templateUrl : '/app/views/pages/company-schedule.html',
               authenticated : true,
               controller : 'companyScheduleCtrl',
               controllerAs : 'companySchedule'
           })

           .when('/add-new-company', {
               templateUrl : '/app/views/pages/add-new-company.html',
               authenticated : true,
               controller : 'addNewCompanyCtrl',
               controllerAs : 'addNewCompany',
               permission : 'admin'
           })

           .when('/company/:company_id', {
               templateUrl : '/app/views/pages/company.html',
               authenticated : true,
               controller : 'companyCtrl',
               controllerAs : 'company'
           })

           /*.when('/company-schedule', {
               templateUrl : '/app/views/pages/company-schedule.html',
               authenticated : true,
               controller : 'companyscheduleCtrl',
               controllerAs : 'companySchedule'
           })*/

           .when('/announcements', {
               templateUrl : '/app/views/pages/announcements.html',
               authenticated : true,
               controller : 'announcementsCtrl',
               controllerAs : 'announcements'
           })

           /*.when('/result', {
               templateUrl : '/app/views/pages/result.html',
               authenticated : true
           })*/

           .when('/timeline', {
               templateUrl : '/app/views/student/timeline.html',
               authenticated : true,
               controller : 'timelineCtrl',
               controllerAs : 'timeline'
           })

           // Management routes
           .when('/editCompany/:company_id', {
               templateUrl : '/app/views/admin/editCompany.html',
               authenticated : true,
               controller : 'editCompanyCtrl',
               controllerAs : 'editCompany',
               permission : 'admin'
           })

           .when('/registeredStudents/:company_id', {
               templateUrl : '/app/views/admin/registeredStudents.html',
               authenticated : true,
               controller : 'registeredStudentsCtrl',
               controllerAs : 'registeredStudents',
               permission : 'admin'
           })


           .when('/achievement', {
               templateUrl : '/app/views/student/achievement.html',
               authenticated : true
           })

           .when('/contact', {
               templateUrl : '/app/views/pages/contact.html',
           })

           .when('/team', {
               templateUrl : '/app/views/pages/team.html',
               authenticated : true
           })

           .when('/technical', {
               templateUrl : '/app/views/pages/technical.html',
               authenticated : true,
               controller : 'technicalCtrl',
               controllerAs : 'technical'
           })

           .when('/activate/:token', {
               templateUrl : '/app/views/users/activation/activate.html',
               authenticated : false,
               controller : 'emailCtrl',
               controllerAs : 'email'
           })

           .when('/resend', {
               templateUrl : '/app/views/users/activation/resend.html',
               authenticated : false,
               controller : 'resendCtrl',
               controllerAs : 'resend'
           })

           .when('/reset-password', {
               templateUrl : '/app/views/users/forgot.html',
               authenticated : false,
               controller : 'forgotCtrl',
               controllerAs : 'forgot'
           })

           .when('/forgotPassword/:token', {
               templateUrl : 'app/views/users/resetPassword.html',
               authenticated : false,
               controller : 'resetCtrl',
               controllerAs : 'reset'
           })

           .when('/management', {
               templateUrl : 'app/views/admin/management.html',
               authenticated : true,
               controller : 'managementCtrl',
               controllerAs : 'management',
               permission : 'admin'
           })

           .when('/edit/:id', {
               templateUrl : 'app/views/admin/edit.html',
               authenticated : true,
               controller : 'editCtrl',
               controllerAs : 'edit',
               permission : 'admin'
           })


           .otherwise( { redirectTo : '/'});

       $locationProvider.html5Mode({
           enabled : true,
           requireBase : false
       })
   });

app.run(['$rootScope','auth','$location', 'user', function ($rootScope,auth,$location,user) {

   $rootScope.$on('$routeChangeStart', function (event, next, current) {

       if(next.$$route) {

           if(next.$$route.authenticated === true) {

               if(!auth.isLoggedIn()) {
                   event.preventDefault();
                   $location.path('/');
               } else if(next.$$route.permission) {

                   user.getPermission().then(function (data) {

                       if(next.$$route.permission !== data.data.permission) {
                           event.preventDefault();
                           $location.path('/');
                       }

                   });
               }

           } else if(next.$$route.authenticated === false) {

               if(auth.isLoggedIn()) {
                   event.preventDefault();
                   $location.path('/profile');
               }

           } /*else {
               console.log('auth does not matter');
           }
           */
       } /*else {
           console.log('Home route is here');
       }
*/
   })
}]);




