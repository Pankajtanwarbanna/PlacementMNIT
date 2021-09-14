var app = angular.module('userRoutes', ['ngRoute'])

   .config(function ($routeProvider, $locationProvider) {
       $routeProvider

           // Announcement Routes
           .when('/announcements', {
               templateUrl : '/app/views/announcement/announcements.html',
               authenticated : true,
               controller : 'announcementsCtrl',
               controllerAs : 'announcements'
           })

           // Authentication Routes
           .when('/login', {
               templateUrl : '/app/views/authentication/login.html',
               authenticated : false
           })

           .when('/logout', {
               templateUrl : '/app/views/authentication/logout.html',
               authenticated : false
           })

           .when('/activate/:token', {
               templateUrl : '/app/views/authentication/activation/activate.html',
               authenticated : false,
               controller : 'emailCtrl',
               controllerAs : 'email'
           })

           .when('/resend', {
               templateUrl : '/app/views/authentication/activation/resend.html',
               authenticated : false,
               controller : 'resendCtrl',
               controllerAs : 'resend'
           })

           .when('/reset-password', {
               templateUrl : '/app/views/authentication/forgot.html',
               authenticated : false,
               controller : 'forgotCtrl',
               controllerAs : 'forgot'
           })

           .when('/forgotPassword/:token', {
               templateUrl : 'app/views/authentication/resetPassword.html',
               authenticated : false,
               controller : 'resetCtrl',
               controllerAs : 'reset'
           })

           // Company Routes
           // 1. Admin Routes
           .when('/add-new-company', {
               templateUrl : '/app/views/company/admin/add-new-company.html',
               authenticated : true,
               controller : 'addNewCompanyCtrl',
               controllerAs : 'addNewCompany',
               permission : ['admin','spc','faculty-coordinator']
           })

           .when('/editCompany/:company_id', {
               templateUrl : '/app/views/company/admin/editCompany.html',
               authenticated : true,
               controller : 'editCompanyCtrl',
               controllerAs : 'editCompany',
               permission : ['admin','spc','faculty-coordinator']
           })

           .when('/registeredStudents/:company_id', {
               templateUrl : '/app/views/company/admin/registeredStudents.html',
               authenticated : true,
               controller : 'registeredStudentsCtrl',
               controllerAs : 'registeredStudents',
               permission : ['admin','spc','faculty-coordinator']
           })

           .when('/company-notification/:company_id', {
               templateUrl : '/app/views/company/admin/company-notification.html',
               authenticated : true,
               controller : 'companyNotificationCtrl',
               controllerAs : 'companyNotification',
               permission : ['admin','spc','faculty-coordinator']
           })

           // 2. Student Routes
           .when('/company/:company_id', {
               templateUrl : '/app/views/company/student/company.html',
               authenticated : true,
               controller : 'companyCtrl',
               controllerAs : 'company'
           })

           .when('/company-registration', {
               templateUrl : '/app/views/company/student/company-registration.html',
               authenticated : true,
               controller : 'companyRegistrationCtrl',
               controllerAs : 'companyRegistration'
           })

           .when('/previous-companies', {
               templateUrl : '/app/views/company/student/previous-companies.html',
               authenticated : true,
               controller : 'previousCompaniesCtrl',
               controllerAs : 'previousCompanies'
           })

           // Interview Experiences Routes
           .when('/interview-experiences', {
               templateUrl : '/app/views/interview-experiences/interview-experiences.html',
               authenticated : true,
               controller : 'interviewCtrl',
               controllerAs : 'interview'
           })

           .when('/experience/:experience_id', {
               templateUrl : '/app/views/interview-experiences/experience.html',
               authenticated : true,
               controller : 'experienceCtrl',
               controllerAs : 'experience'
           })

           .when('/editExperience/:experience_id', {
               templateUrl : '/app/views/interview-experiences/editExperience.html',
               authenticated : true,
               controller : 'editExperienceCtrl',
               controllerAs : 'editExperience',
               permission : ['admin','spc','faculty-coordinator']
           })

           .when('/compose', {
               templateUrl : '/app/views/interview-experiences/compose.html',
               authenticated : true,
               controller : 'composeCtrl',
               controllerAs : 'compose'
           })

           .when('/contributions', {
               templateUrl : '/app/views/interview-experiences/contributions.html',
               authenticated : true,
               controller : 'contributionsCtrl',
               controllerAs : 'contributions'
           })

           // Contact Routes
           .when('/contact', {
               templateUrl : '/app/views/contact/contact.html',
           })

           // Developer Routes
           .when('/feedbacks', {
               templateUrl : '/app/views/developer/feedbacks.html',
               authenticated : true,
               controller : 'feedbackCtrl',
               controllerAs : 'feedback',
               permission : ['admin']
           })

           .when('/technical', {
               templateUrl : '/app/views/developer/technical.html',
               controller : 'technicalCtrl',
               controllerAs : 'technical'
           })

           // Hall of Fame Routes
           .when('/placements', {
               templateUrl : '/app/views/hall-of-fame/placements.html',
               controller : 'placementsCtrl',
               controllerAs : 'placements'
           })

           .when('/placements2019-20', {
               templateUrl : '/app/views/hall-of-fame/placement-stats.html',
               controller : 'placementStatsCtrl',
               controllerAs : 'placementStats'
           })

           // Admin Management Routes
           .when('/admin-management', {
               templateUrl : '/app/views/management/admin-management.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator']
           })

           .when('/coordinator-management', {
               templateUrl : '/app/views/management/coordinator-management.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'coordinatorCtrl',
               controllerAs : 'coordinator'
           })

           .when('/red-flag-management', {
               templateUrl : '/app/views/management/red-flag/red-flag-management.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'redFlagManagementCtrl',
               controllerAs : 'redFlagManagement'
           })

           .when('/placement-management', {
               templateUrl : '/app/views/management/placements/placement-management.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'placementManagementCtrl',
               controllerAs : 'placementManagement'
           })

           .when('/add-placement', {
               templateUrl : '/app/views/management/placements/add-placement.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'addNewPlacementCtrl',
               controllerAs : 'addNewPlacement'
           })

           .when('/edit-placement/:placement_id', {
               templateUrl : '/app/views/management/placements/edit-placement.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'editPlacementCtrl',
               controllerAs : 'editPlacement'
           })

           .when('/students-management', {
               templateUrl : '/app/views/management/students-management.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'studentsManagementCtrl',
               controllerAs : 'studentsManagement'
           })

           .when('/interviews-management', {
               templateUrl : '/app/views/management/interviews-management.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'interviewsManagementCtrl',
               controllerAs : 'interviewsManagement'
           })

           .when('/email-groups-management', {
               templateUrl : '/app/views/management/email-groups/email-groups-management.html',
               authenticated : true,
               permission : ['admin','spc','faculty-coordinator'],
               controller : 'emailGroupsManagementCtrl',
               controllerAs : 'emailGroupsManagement'
           })

           // User Profile
           // 1. Student
           .when('/profile', {
               templateUrl : '/app/views/profile/student/userProfile.html',
               authenticated : true,
               controller : 'profileCtrl',
               controllerAs : 'profile'
           })

           .when('/red-flag-history', {
               templateUrl : '/app/views/profile/student/red-flag-history.html',
               authenticated : true,
               controller : 'redFlagHistoryCtrl',
               controllerAs : 'redFlagHistory'
           })

           .when('/timeline', {
               templateUrl : '/app/views/profile/student/timeline.html',
               authenticated : true,
               controller : 'timelineCtrl',
               controllerAs : 'timeline'
           })

           .when('/achievement', {
               templateUrl : '/app/views/profile/student/achievement.html',
               authenticated : true,
               controller : 'achievementsCtrl',
               controllerAs : 'achievements'
           })

           .when('/settings', {
               templateUrl : '/app/views/profile/student/settings.html',
               authenticated : true,
               controller : 'settingsCtrl',
               controllerAs : 'settings'
           })

           .when('/notifications', {
               templateUrl : '/app/views/profile/student/notifications.html',
               authenticated : true,
               controller : 'notificationsCtrl',
               controllerAs : 'notifications'
           })

           // Team Routes
           .when('/team', {
               templateUrl : '/app/views/team/team.html'
           })

           .when('/team2020', {
               templateUrl : '/app/views/team/team2020.html'
           })

           .when('/team2021', {
                templateUrl : '/app/views/team/team2021.html'
            })

            .when('/stats19-20', {
                templateUrl : '/app/views/layout/stats19-20.html'
            })

           .otherwise( { redirectTo : '/'});

       $locationProvider.html5Mode({
           enabled : true,
           requireBase : false
       })
   });

app.run(['$rootScope','auth','$location', 'student', function ($rootScope,auth,$location,student) {

   $rootScope.$on('$routeChangeStart', function (event, next, current) {

       if(next.$$route) {

           if(next.$$route.authenticated === true) {

               if(!auth.isLoggedIn()) {
                   event.preventDefault();
                   $location.path('/');
               } else if(next.$$route.permission) {

                   student.getPermission().then(function (data) {

                       if(next.$$route.permission.indexOf(data.data.permission) === -1) {
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