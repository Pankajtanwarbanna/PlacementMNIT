const router = require('express').Router();
const userController = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// todo replace sendOTP, login => login (local storage to remember device)
router.post('/sendOTP', userController.sendOTP);
router.post('/login', userController.login);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/verifyToken', userController.verifyToken);
router.post('/resetPassword', userController.resetPassword);
router.post('/me', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, userController.me);
router.get('/permission', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, userController.permission)
router.get('/timeline', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, userController.timeline)
router.get('/profile', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, userController.profile)
router.get('/getOne/:college_id', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, userController.getOne)
router.post('/updateOne', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, userController.updateOne)
router.post('/updateProfile', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, userController.updateProfile)
router.post('/changePassword', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, userController.changePassword)
router.get('/contributions', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, userController.contributions)
router.post('/updateBatch', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, userController.updateBatch)
router.get('/achievements', jwtMiddleware.verify, authMiddleware.ensureStudent, userController.achievements)

module.exports = router;
