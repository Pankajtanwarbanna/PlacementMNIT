const router = require('express').Router();
const redFlagController = require('../controllers/redFlag.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, redFlagController.add);
router.post('/remove', jwtMiddleware.verify, authMiddleware.ensureAdminOrFaculty, redFlagController.remove);
router.post('/getAll', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, redFlagController.getAll);
router.get('/my', jwtMiddleware.verify, authMiddleware.ensureStudent, redFlagController.my);

module.exports = router;
