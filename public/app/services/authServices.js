/*
    Services written by - Pankaj tanwar
*/
angular.module('authServices',[])

.factory('auth', function ($http, authToken) {
    var authFactory = {};

    // auth.login(logData);
    authFactory.login = function (logData) {
        return $http.post('/api/authenticate', logData).then(function (data) {
            authToken.setToken(data.data.token);
            return data;
        });
    };

    // auth.isLoggedIn()
    authFactory.isLoggedIn = function () {
        if(authToken.getToken()) {
            return true;
        } else {
            return false;
        }
    };

    // auth.getUser();
    authFactory.getUser = function () {
        if(authToken.getToken()) {
            return $http.post('/api/me');
        } else {
            $q.reject({ message : 'User has no token.'});
        }
    };

    // auth.logout();
    authFactory.logout = function () {
        authToken.setToken();
    };

    return authFactory;
})

.factory('authToken', function ($window) {
    var authTokenFactory = {};

    // authToken.setToken(token);
    authTokenFactory.setToken = function (token) {
        if(token) {
            $window.localStorage.setItem('token', token);
        } else {
            $window.localStorage.removeItem('token');
        }
    };

    // authToken.getToken();
    authTokenFactory.getToken = function () {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
})

// Interceptor factory to pass tokens with every request
.factory('AuthInterceptors' , function (authToken) {
    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function (config) {
        var token = authToken.getToken();
        //console.log(token);
        if(token) config.headers['x-access-token'] = token;

        return config;
    };

    return authInterceptorsFactory;
});