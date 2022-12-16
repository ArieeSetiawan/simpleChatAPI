const router = require('express').Router();
const userController = require('../controllers/user-controller');
const validateUserRegister = require('../middlewares/validatorUserRegister.js');
const validateLogin = require('../middlewares/validatorLogin');
const { authentication, authorization } = require ('../middlewares/auth')

router.post('/register',validateUserRegister,userController.register);
router.post('/login',validateLogin,userController.login);
router.get('/',userController.getAllUser);
router.get('/get/:id', userController.getUserbyID);
router.put('/edit/:id', userController.editUserbyID);
router.delete('/delete/:id', userController.deleteUser);
router.get('/contact/',authentication,userController.getAllContact)
router.post('/addfriend',authentication,userController.addFriend)

module.exports = router;