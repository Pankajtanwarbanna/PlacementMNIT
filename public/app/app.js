angular.module('userApp', ['userRoutes','userCtrl','mainController','managementController','emailController'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});