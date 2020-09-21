const router = require('express').Router();
const exportController = require('../controllers/export.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/resumes/:company_id', jwtMiddleware.verify, authMiddleware.ensureOfficialPlacementTeam, exportController.resumes);

module.exports = router;
