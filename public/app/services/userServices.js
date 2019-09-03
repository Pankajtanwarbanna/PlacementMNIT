/*
    Services written by - Pankaj tanwar
*/
angular.module('userServices',[])

.factory('user', function ($http) {
    var userFactory = {};

    // user.create(regData);
    userFactory.create = function (regData) {
        return $http.post('/api/register' , regData);
    };

    // user.activateAccount(token);
    userFactory.activateAccount = function (token) {
        return $http.put('/api/activate/'+token);
    };

    // user.resendLink(logData);
    userFactory.checkCredientials = function (logData) {
        return $http.post('/api/resend',logData);
    };

    // user.resendEmail(username);
    userFactory.resendEmail = function (username) {
        return $http.put('/api/sendlink', username);
    };

    // user.forgotUsername(email);
    userFactory.forgotUsername = function (email) {
        return $http.post('/api/forgotUsername', email);
    };

    // user.forgotPasswordLink(username);
    userFactory.forgotPasswordLink = function (username) {
        return $http.put('/api/forgotPasswordLink', username);
    };

    // user.forgotPasswordCheckToken(token);
    userFactory.forgotPasswordCheckToken = function (token) {
        return $http.post('/api/forgotPassword/'+token);
    };

    // user.resetPassword(token,password);
    userFactory.resetPassword = function (token,password) {
        return $http.put('/api/resetPassword/'+token, password);
    };

    // user.getPermission();
    userFactory.getPermission = function () {
        return $http.get('/api/permission');
    };

    // get users from database
    userFactory.getUsers = function () {
        return $http.get('/api/management/');
    };

    // get user from id
    userFactory.getUser = function(id) {
        return $http.get('/api/edit/' + id);
    };

    //delete user from database
    userFactory.deleteUser = function (username) {
        return $http.delete('/api/management/'+username);
    };

    // edit details of user
    userFactory.editUser = function (id) {
        return $http.put('/api/edit/', id);
    };

    // Company Schedule Service
    userFactory.scheduleCompany = function (scheduleData) {
        return $http.post('/api/scheduleCompany', scheduleData);
    };

    // Get all schedules of company
    userFactory.getSchedule = function () {
        return $http.get('/api/getSchedule');
    };

    // post announcement
    userFactory.postAnnouncement = function (announcementData) {
        return $http.post('/api/postAnnouncement', announcementData);
    };

    // get all announcements
    userFactory.getAnnouncements = function () {
        return $http.get('/api/getAnnouncements');
    };

    // post company to db
    userFactory.postCompanyDetails = function (newCompanyData) {
        return $http.post('/api/postCompanyDetails', newCompanyData);
    };

    // get all upcoming companies from db
    userFactory.getAllUpcomingCompanies = function () {
        return $http.get('/api/getAllUpcomingCompanies');
    };

    // get all previous companies from db
    userFactory.getAllPreviousCompanies = function () {
        return $http.get('/api/getAllPreviousCompanies');
    };


    // get company detail
    userFactory.getCompanyDetails = function (company_id) {
        return $http.get('/api/getCompanyDetails/' + company_id);
    };

    // get candidate apply status in company
    userFactory.getCandidateApplyStatus = function(company_id) {
        return $http.get('/api/getCandidateApplyStatus/' + company_id);
    };
    
    // register in a company
    userFactory.oneClickApply = function (company_id) {
        return $http.post('/api/oneClickApply/' + company_id);
    };

    // withdraw application
    userFactory.withdrawApplication = function(company_id) {
        return $http.post('/api/withdrawApplication/' + company_id);
    };

    // delete company
    userFactory.deleteCompany = function(company_id) {
        return $http.delete('/api/deleteCompany/'+ company_id);
    };

    // get registered students
    userFactory.getRegisteredStudents = function(company_id) {
        return $http.get('/api/getRegisteredStudents/'+ company_id);
    };

    // get student details with id
    userFactory.getStudentDetailsByCollegeID = function(college_id) {
        return $http.get('/api/getStudentDetailsByCollegeID/' + college_id);
    };

    // get user timeline
    userFactory.getTimeline = function () {
        return $http.get('/api/getTimeline');
    };

    // add company schedule
    userFactory.addCompanySchedule = function (scheduleData,company_id) {
        return $http.post('/api/addCompanySchedule/'+company_id, scheduleData);
    };

    // add company notification
    userFactory.addCompanyNotification = function (notificationData, company_id) {
        return $http.post('/api/addCompanyNotification/'+company_id, notificationData);
    };

    // get company schedule
    userFactory.getCompanySchedule = function (company_id) {
        return $http.get('/api/getCompanySchedule/'+company_id);
    };

    // get company notifications
    userFactory.getCompanyNotifications = function (company_id) {
        return $http.get('/api/getCompanyNotifications/'+company_id);
    };

    // get all registered students in a company
    userFactory.getAllRegisteredStudentsInCompany = function (company_id) {
        return $http.get('/api/getAllRegisteredStudentsInCompany/' + company_id);
    };

    // add company result
    userFactory.addCompanyResult = function (resultData, company_id) {
        return $http.post('/api/addCompanyResult/'+company_id, resultData);
    };

    // get company result
    userFactory.getCompanyResult = function (company_id) {
        return $http.get('/api/getCompanyResult/'+company_id);
    };

    // get user profile from database
    userFactory.getUserProfile = function () {
        return $http.get('/api/getUserProfile');
    };

	// update user profile
	userFactory.updateProfile = function (profileData) {
		return $http.put('/api/updateProfile', profileData);
	};

	// check profile is complete or not
	userFactory.checkCompleteProfile = function () {
	   return $http.get('/api/checkCompleteProfile');
	}

	// send feedback
    userFactory.sendFeedback = function (feedbackData) {
        return $http.post('/api/sendFeedback', feedbackData);
    };

	// withdrawRegistration
    userFactory.withdrawRegistration = function (college_id, company_id) {
        return $http.post('/api/withdrawRegistration/' + college_id + '/' + company_id);
    };

    // start attendance
    userFactory.updateAttendanceStatus = function (company_id) {
        return $http.post('/api/updateAttendanceStatus/' + company_id);
    };

    // get attendance status
    userFactory.getAttendanceStatus = function (company_id) {
        return $http.get('/api/getAttendanceStatus/' + company_id);
    };

    // mark attendance
    userFactory.markCompanyAttendance = function (attendanceData, company_id) {
        return $http.post('/api/markCompanyAttendance/'+ company_id, attendanceData);
    };

    // done with attendance
    userFactory.doneWithAttendance = function (company_id) {
        return $http.post('/api/doneWithAttendance/' + company_id);
    };

    // mark red flag to absent students
    userFactory.sendEmailToAbsentAndMarkRedFlag = function (company_id) {
        return $http.post('/api/sendEmailToAbsentAndMarkRedFlag/'+ company_id);
    };

    // fetch feedbacks form database
    userFactory.fetchFeedbacks = function () {
        return $http.get('/api/fetchFeedbacks');
    };

    return userFactory;
});
