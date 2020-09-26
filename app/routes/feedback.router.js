const router = require('express').Router();
const feedbackController = require('../controllers/feedback.controller');
const jwtMiddleware = require('../middlewares/jwt.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', jwtMiddleware.verify, authMiddleware.ensureLoggedIn, feedbackController.add);
router.get('/getAll', jwtMiddleware.verify, authMiddleware.ensureAdmin, feedbackController.getAll);

module.exports = router;
