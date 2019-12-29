angular.module('userApp', ['userRoutes','userCtrl','mainController','managementController','emailController','portalFilters'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
