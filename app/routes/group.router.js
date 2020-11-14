const router = require('express').Router();
const groupController = require('../controllers/group.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add',     jwtMiddleware.verify, groupController.add);
router.post('/update',  jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, groupController.update);
router.post('/delete',  jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, groupController.delete);
router.post('/getAll',  jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, groupController.getAll);

module.exports = router;
