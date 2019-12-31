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

    // add company schedule
    adminFactory.addCompanySchedule = function (scheduleData,company_id) {
        return $http.post('/api/addCompanySchedule/'+company_id, scheduleData);
    };

    // add company notification
    adminFactory.addCompanyNotification = function (notificationData, company_id) {
        return $http.post('/api/addCompanyNotification/'+company_id, notificationData);
    };

    // get all registered students in a company
    adminFactory.getAllRegisteredStudentsInCompany = function (company_id) {
        return $http.get('/api/getAllRegisteredStudentsInCompany/' + company_id);
    };

    // add company result
    adminFactory.addCompanyResult = function (resultData, company_id) {
        return $http.post('/api/addCompanyResult/'+company_id, resultData);
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

    return adminFactory;
});
