/*
    Services written by - Pankaj tanwar
*/
angular.module('adminServices',[])

.factory('admin', function ($http) {
    let adminFactory = {};

    // post announcement
    adminFactory.postAnnouncement = function (announcementData) {
        return $http.post('/api/announcement/add', announcementData);
    };

    // post company to db
    adminFactory.postCompanyDetails = function (newCompanyData) {
        return $http.post('/api/company/add', newCompanyData);
    };

    // update company details
    adminFactory.updateCompanyDetails = function(company) {
        return $http.post('/api/company/update', company);
    };

    // delete company
    adminFactory.deleteCompany = function(company_id) {
        return $http.post('/api/company/remove', {company_id : company_id});
    };

    // get registered students
    adminFactory.getRegisteredStudents = function(company_id) {
        return $http.get('/api/company/allApplied/'+ company_id);
    };

    // withdraw application
    adminFactory.withdrawApplication = function(data) {
        return $http.post('/api/apply/withdraw', data);
    };

    // fetch feedbacks form database
    adminFactory.fetchFeedbacks = function () {
        return $http.get('/api/feedback/getAll');
    };

    // get student profile
    adminFactory.searchByID = function (studentID) {
        return $http.get('/api/user/getOne/' + studentID);
    };

    // update student profile
    adminFactory.updateStudentProfile = function (studentData) {
        return $http.post('/api/user/updateOne', studentData);
    };

    // update admin passout batch
    adminFactory.updateAdminBatch = function (batch) {
        return $http.post('/api/user/updateBatch' , { batch : batch });
    };

    // get all interviews
    adminFactory.getAllInterviews = function () {
        return $http.get('/api/interview/getAll_admin');
    };

    // change status
    adminFactory.changeStatus = function (experience_id) {
        return $http.post('/api/interview/changeStatus', { experience_id : experience_id });
    };

    // update interview experience
    adminFactory.editInterviewExperience = function (experienceData) {
        return $http.post('/api/interview/edit', experienceData);
    };

    // add coordinator
    adminFactory.addCoordinator = function (coordinatorData) {
        return $http.post('/api/coordinator/add', coordinatorData);
    };

    // get all coordinators from DB
    adminFactory.getAllCoordinators = function () {
        return $http.get('/api/coordinator/getAll');
    };

    // get all coordinators from DB
    adminFactory.exportResumesOfRegisteredStudents = function (company_id) {
        return $http.get('/api/export/resumes/'+ company_id, {responseType:'arraybuffer'});
    };

    // add company notification
    adminFactory.sendCompanyNotification = function (notificationData) {
        return $http.post('/api/notification/add', notificationData);
    };

    // get company notifications
    adminFactory.getNotifications = function (data) {
        return $http.post('/api/notification/getAll', data);
    };

    // add placement
    adminFactory.addPlacement = function (data) {
        return $http.post('/api/placements/add', data);
    };

    // get all placements
    adminFactory.getPlacementsData = function (data) {
        return $http.post('/api/placements/getAll', data);
    };

    // edit placement details
    adminFactory.editPlacementDetails = function (data) {
        return $http.post('/api/placements/update', data);
    };

    // get Red Flag history
    adminFactory.getRedFlagHistory = function (data) {
        return $http.post('/api/redFlag/getAll', { receiver : data.collegeID });
    };

    // add red flag
    adminFactory.addRedFlag = function (data) {
        return $http.post('/api/redFlag/add', data);
    };

    // remove red flag
    adminFactory.removeRedFlag = function (data) {
        return $http.post('/api/redFlag/remove', data);
    };

    return adminFactory;
});
