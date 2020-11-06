/*
    Services written by - Pankaj tanwar
*/
angular.module('studentServices',[])

.factory('student', function ($http) {
    let studentFactory = {};

    // user.forgotPasswordLink(data);
    studentFactory.forgotPassword = function (data) {
        return $http.post('/api/user/forgotPassword', data);
    };

    // user.forgotPasswordCheckToken(token);
    studentFactory.forgotPasswordCheckToken = function (token) {
        return $http.post('/api/user/verifyToken', { token : token });
    };

    // user.resetPassword(token,password);
    studentFactory.resetPassword = function (data) {
        return $http.post('/api/user/resetPassword', data);
    };

    // user.getPermission();
    studentFactory.getPermission = function () {
        return $http.get('/api/user/permission');
    };

    // get all announcements
    studentFactory.getAnnouncements = function () {
        return $http.get('/api/announcement/getAll');
    };

    // get all upcoming companies from db
    studentFactory.getAllUpcomingCompanies = function () {
        return $http.post('/api/company/getAll', { active : true });
    };

    // get all previous companies from db
    studentFactory.getAllPreviousCompanies = function () {
        return $http.post('/api/company/getAll', { active : false });
    };

    // get company detail
    studentFactory.getCompanyDetails = function (company_id) {
        return $http.get('/api/company/getOne/' + company_id);
    };

    // get candidate apply status in company
    studentFactory.getCandidateApplyStatus = function(company_id) {
        return $http.get('/api/apply/getStatus/' + company_id);
    };
    
    // register in a company
    studentFactory.oneClickApply = function (company_id) {
        return $http.post('/api/apply/oneClickApply', { company_id : company_id});
    };

    // withdraw application
    studentFactory.withdrawApplication = function(company_id) {
        return $http.post('/api/apply/withdraw/', {company_id : company_id});
    };

    // get user timeline
    studentFactory.getTimeline = function () {
        return $http.get('/api/user/timeline');
    };

    // get user profile from database
    studentFactory.getUserProfile = function () {
        return $http.get('/api/user/profile');
    };

	// update user profile
	studentFactory.updateProfile = function (profileData) {
		return $http.post('/api/user/updateProfile', profileData);
	};

	// send feedback
    studentFactory.sendFeedback = function (feedbackData) {
        return $http.post('/api/feedback/add', feedbackData);
    };

    // start attendance
    studentFactory.updateAttendanceStatus = function (company_id) {
        return $http.post('/api/attendance/update' ,{ company_id : company_id});
    };

    // get attendance status
    studentFactory.getAttendanceStatus = function (company_id) {
        return $http.get('/api/attendance/getStatus/' + company_id);
    };

    // mark attendance
    studentFactory.markCompanyAttendance = function (attendanceData, company_id) {
        return $http.post('/api/attendance/mark', company_id, attendanceData);
    };

    // done with attendance
    studentFactory.doneWithAttendance = function (company_id) {
        return $http.post('/api/attendance/complete', { company_id : company_id});
    };

    // mark red flag to absent students
    studentFactory.sendEmailToAbsentAndMarkRedFlag = function (company_id) {
        return $http.post('/api/sendEmailToAbsentAndMarkRedFlag/'+ company_id);
    };

    // change password
    studentFactory.changePassword = function (passwordData) {
        return $http.post('/api/user/changePassword', passwordData);
    };

    // get all interview experiences
    studentFactory.getAllInterviewExperiences = function() {
        return $http.get('/api/interview/getAll');
    };

    // get interview experience
    studentFactory.getExperience = function(experience_id) {
        return $http.get('/api/interview/getOne/' + experience_id);
    };

    // post interview experience
    studentFactory.postInterviewExperience = function (experienceData) {
        return $http.post('/api/interview/add', experienceData);
    };

    // get contributions
    studentFactory.getContributions = function () {
        return $http.get('/api/user/contributions');
    };

    // wipe notifications
    studentFactory.wipeNotifications = function () {
        return $http.post('/api/notification/wipe')
    };

    // get getAchievements
    studentFactory.getAchievements = function () {
        return $http.get('/api/user/achievements')
    };

    // get my red flag history
    studentFactory.getMyRedFlagHistory = function () {
        return $http.get('/api/redFlag/my');
    };

    return studentFactory;
});
