const router = require('express').Router();
const chatController = require('../controllers/chat-controller');
const { authentication, authorization } = require ('../middlewares/auth')

router.get('/get',authentication,chatController.getAllRoom);
router.post('/createChat',authentication,chatController.sendChat)
router.get('/getDetail/:id',authentication,chatController.getRoomDetail)

module.exports = router;