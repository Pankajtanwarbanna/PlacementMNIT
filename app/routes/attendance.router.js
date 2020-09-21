const router = require('express').Router();
const attendanceController = require('../controllers/attendance.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/getStatus/:company_id', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, attendanceController.getStatus);
router.post('/mark', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, attendanceController.mark);
router.post('/update', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, attendanceController.update);
router.post('/complete', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, attendanceController.complete);

module.exports = router;
