const router = require('express').Router();
const interviewController = require('../controllers/interview.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// todo Replace getAll and getAll_admin => getAll with permission filter
router.get('/getAll', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, interviewController.getAll);
router.get('/getAll_admin', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, interviewController.getAll_admin);
router.get('/getOne/:experience_id', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, interviewController.getOne);
router.post('/add', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, interviewController.add);
router.post('/changeStatus', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, interviewController.changeStatus);
router.post('/edit', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, interviewController.edit);

module.exports = router;
