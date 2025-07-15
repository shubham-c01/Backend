import { Router } from "express";
import { registerUser } from "../controllers/User.Controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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

export default router