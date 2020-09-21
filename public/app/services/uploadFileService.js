angular.module('uploadFileService', [])

.service('uploadFile', function ($http) {

    // Upload Student Resume
    this.uploadStudentResume = function (file) {

        let fd = new FormData();

        fd.append( 'resume', file.resume);

        return $http.post('/api/upload/resume', fd, {
            transformRequest: angular.identity,
            headers : { 'content-type' : undefined }
        })

    }
});
