import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/User.Controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'
const router=Router()
//adding a file upload middleware between
router.route('/register').post(
   upload.fields([
    {
        name:'avatar',
        maxCount:1
    },
    {
        name:'coverImage',
        maxCount:1
    }
   ]),
    //we added a middleware before POST actually hits the registerUser controller 
    registerUser
)
router.route('/login').post(loginUser)
//secured routes
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)


export default router