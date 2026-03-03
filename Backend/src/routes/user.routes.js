const express = require('express');
const {registerUser , loginUser , logoutUser ,getProfile} = require('../controller/auth.Controller');
const { isLoggedIn } = require('../middlewares/auth.middleware');

const router = express.Router();


/** 
 * @route /api/auth/register
 * @function To register a user
 */
router.post('/register' , registerUser)

/** 
 * @route /api/auth/login
 * @function To Login User 
 */
router.post('/login' , loginUser)


/** 
 * @route /api/auth/logout
 * @function To Logout A User 
 */
router.get('/logout' , logoutUser)



/** 
 * @route /api/auth/getMe
 * @function To Get the Profile of A User 
 */
router.get('/profile' , isLoggedIn,  getProfile)


module.exports = router;
