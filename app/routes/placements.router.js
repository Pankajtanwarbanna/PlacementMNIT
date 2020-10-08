const router = require('express').Router();
const placementsController = require('../controllers/placements.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, placementsController.add);
router.post('/getAll', placementsController.getAll); // Can be accessed without login.
router.post('/update', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, placementsController.update);

module.exports = router;
