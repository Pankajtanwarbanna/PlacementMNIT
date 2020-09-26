const router = require('express').Router();
const coordinatorController = require('../controllers/coordinator.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam,coordinatorController.add);
router.get('/getAll', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam,coordinatorController.getAll);

module.exports = router;
