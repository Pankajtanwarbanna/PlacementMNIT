angular.module('userApp', ['userRoutes','studentController','mainController','adminController','emailController','portalFilters'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
