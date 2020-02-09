/*
    Services written by - Pankaj tanwar
*/
angular.module('studentServices',[])

.factory('student', function ($http) {
    var studentFactory = {};

    // user.activateAccount(token);
    studentFactory.activateAccount = function (token) {
        return $http.put('/api/activate/'+token);
    };

    // user.resendLink(logData);
    studentFactory.checkCredientials = function (logData) {
        return $http.post('/api/resend',logData);
    };

    // user.resendEmail(username);
    studentFactory.resendEmail = function (username) {
        return $http.put('/api/sendlink', username);
    };

    // user.forgotUsername(email);
    studentFactory.forgotUsername = function (email) {
        return $http.post('/api/forgotUsername', email);
    };

    // user.forgotPasswordLink(username);
    studentFactory.forgotPasswordLink = function (username) {
        return $http.put('/api/forgotPasswordLink', username);
    };

    // user.forgotPasswordCheckToken(token);
    studentFactory.forgotPasswordCheckToken = function (token) {
        return $http.post('/api/forgotPassword/'+token);
    };

    // user.resetPassword(token,password);
    studentFactory.resetPassword = function (token,password) {
        return $http.put('/api/resetPassword/'+token, password);
    };

    // user.getPermission();
    studentFactory.getPermission = function () {
        return $http.get('/api/permission');
    };

    // get all announcements
    studentFactory.getAnnouncements = function () {
        return $http.get('/api/getAnnouncements');
    };

    // get all upcoming companies from db
    studentFactory.getAllUpcomingCompanies = function () {
        return $http.get('/api/getAllUpcomingCompanies');
    };

    // get all previous companies from db
    studentFactory.getAllPreviousCompanies = function () {
        return $http.get('/api/getAllPreviousCompanies');
    };

    // get company detail
    studentFactory.getCompanyDetails = function (company_id) {
        return $http.get('/api/getCompanyDetails/' + company_id);
    };

    // get candidate apply status in company
    studentFactory.getCandidateApplyStatus = function(company_id) {
        return $http.get('/api/getCandidateApplyStatus/' + company_id);
    };
    
    // register in a company
    studentFactory.oneClickApply = function (company_id) {
        return $http.post('/api/oneClickApply/' + company_id);
    };

    // withdraw application
    studentFactory.withdrawApplication = function(company_id) {
        return $http.post('/api/withdrawApplication/' + company_id);
    };

    // get user timeline
    studentFactory.getTimeline = function () {
        return $http.get('/api/getTimeline');
    };

    // get company schedule
    studentFactory.getCompanySchedule = function (company_id) {
        return $http.get('/api/getCompanySchedule/'+company_id);
    };

    // get company notifications
    studentFactory.getCompanyNotifications = function (company_id) {
        return $http.get('/api/getCompanyNotifications/'+company_id);
    };

    // get company result
    studentFactory.getCompanyResult = function (company_id) {
        return $http.get('/api/getCompanyResult/'+company_id);
    };

    // get user profile from database
    studentFactory.getUserProfile = function () {
        return $http.get('/api/getUserProfile');
    };

	// update user profile
	studentFactory.updateProfile = function (profileData) {
		return $http.put('/api/updateProfile', profileData);
	};

	// check profile is complete or not
	studentFactory.checkCompleteProfile = function () {
	   return $http.get('/api/checkCompleteProfile');
	}

	// send feedback
    studentFactory.sendFeedback = function (feedbackData) {
        return $http.post('/api/sendFeedback', feedbackData);
    };

	// withdrawRegistration
    studentFactory.withdrawRegistration = function (college_id, company_id) {
        return $http.delete('/api/withdrawRegistration/' + college_id + '/' + company_id);
    };

    // start attendance
    studentFactory.updateAttendanceStatus = function (company_id) {
        return $http.post('/api/updateAttendanceStatus/' + company_id);
    };

    // get attendance status
    studentFactory.getAttendanceStatus = function (company_id) {
        return $http.get('/api/getAttendanceStatus/' + company_id);
    };

    // mark attendance
    studentFactory.markCompanyAttendance = function (attendanceData, company_id) {
        return $http.post('/api/markCompanyAttendance/'+ company_id, attendanceData);
    };

    // done with attendance
    studentFactory.doneWithAttendance = function (company_id) {
        return $http.post('/api/doneWithAttendance/' + company_id);
    };

    // mark red flag to absent students
    studentFactory.sendEmailToAbsentAndMarkRedFlag = function (company_id) {
        return $http.post('/api/sendEmailToAbsentAndMarkRedFlag/'+ company_id);
    };

    // change password
    studentFactory.changePassword = function (passwordData) {
        return $http.post('/api/changePassword', passwordData);
    };

    // get all interview experiences
    studentFactory.getAllInterviewExperiences = function() {
        return $http.get('/api/getAllInterviewExperiences');
    };

    // get interview experience
    studentFactory.getExperience = function(experience_id) {
        return $http.get('/api/getExperience/' + experience_id);
    };

    // post interview experience
    studentFactory.postInterviewExperience = function (experienceData) {
        return $http.post('/api/postInterviewExperience', experienceData);
    };

    // get contributions
    studentFactory.getContributions = function () {
        return $http.get('/api/getContributions');
    };

    return studentFactory;
});
