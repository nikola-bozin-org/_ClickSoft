const express = require('express')
const router = express.Router();
const controller = require('../controllers/sessionController');
const {validate,hasToken} = require('../helpers/validators')

router.post('/login',controller.loginUser);
router.post('/logout',controller.logoutUser);
router.get('/logedInUsers',controller.getLoggedInUsers);
router.post('/loginStaff',controller.loginStaff);
router.get('/logedInUsers',controller.getLoggedInUsers)
router.post('/logoutAllUsers',controller.logoutAllUsers)
router.get('./verifyToken',validate(hasToken),controller.verifyToken)

module.exports=router;

