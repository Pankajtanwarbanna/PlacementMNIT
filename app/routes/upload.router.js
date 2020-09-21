const router = require('express').Router();
const uploadController = require('../controllers/upload.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/resume', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, uploadController.resume);

module.exports = router;
