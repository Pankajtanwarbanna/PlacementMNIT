const router = require('express').Router();
const applyController = require('../controllers/apply.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/getStatus/:company_id', jwtMiddleware.verify, authMiddleware.ensureStudent, applyController.getStatus);
router.post('/oneClickApply', jwtMiddleware.verify, authMiddleware.ensureStudentWithCompleteProfile, applyController.oneClickApply);
router.post('/withdraw', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, applyController.withdraw);

module.exports = router;
