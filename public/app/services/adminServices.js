/*
    Services written by - Pankaj tanwar
*/
angular.module('adminServices',[])

.factory('admin', function ($http) {
    let adminFactory = {};

    // post announcement
    adminFactory.postAnnouncement = function (announcementData) {
        return $http.post('/api/postAnnouncement', announcementData);
    };

    // post company to db
    adminFactory.postCompanyDetails = function (newCompanyData) {
        return $http.post('/api/postCompanyDetails', newCompanyData);
    };

    // update company details
    adminFactory.updateCompanyDetails = function(company) {
        return $http.post('/api/updateCompanyDetails', company);
    };

    // delete company
    adminFactory.deleteCompany = function(company_id) {
        return $http.delete('/api/deleteCompany/'+ company_id);
    };

    // get registered students
    adminFactory.getRegisteredStudents = function(company_id) {
        return $http.get('/api/getRegisteredStudents/'+ company_id);
    };

    // get student details with id
    adminFactory.getStudentDetailsByCollegeID = function(college_id) {
        return $http.get('/api/getStudentDetailsByCollegeID/' + college_id);
    };

    // fetch feedbacks form database
    adminFactory.fetchFeedbacks = function () {
        return $http.get('/api/fetchFeedbacks');
    };

    // get student profile
    adminFactory.searchByID = function (studentID) {
        return $http.get('/api/searchByID/' + studentID);
    };

    // update student profile
    adminFactory.updateStudentProfile = function (studentData) {
        return $http.put('/api/updateStudentProfile', studentData);
    };

    // update admin passout batch
    adminFactory.updateAdminBatch = function (batch) {
        return $http.post('/api/updateAdminBatch/' + batch);
    };

    // get all interviews
    adminFactory.getAllInterviews = function () {
        return $http.get('/api/getAllInterviews');
    };

    // change status
    adminFactory.changeStatus = function (experience_id) {
        return $http.post('/api/changeStatus/' + experience_id);
    };

    // update interview experience
    adminFactory.editInterviewExperience = function (experienceData) {
        return $http.post('/api/editInterviewExperience', experienceData);
    };

    // add coordinator
    adminFactory.addCoordinator = function (coordinatorData) {
        return $http.post('/api/addCoordinator', coordinatorData);
    };

    // notify coordinator for registration via SMS
    adminFactory.notifyCoordinatorForRegistration = function (coordinatorData) {
        return $http.post('/api/notifyCoordinatorForRegistration', coordinatorData);
    };

    // get all coordinators from DB
    adminFactory.getAllCoordinators = function () {
        return $http.get('/api/getAllCoordinators');
    };

    // get all coordinators from DB
    adminFactory.exportResumesOfRegisteredStudents = function (company_id) {
        return $http.get('/api/exportResumesOfRegisteredStudents/'+ company_id, {responseType:'arraybuffer'});
    };


    return adminFactory;
});
