import  express  from 'express';
import {loginController,registerController,testController} from '../controller/authController.js'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';



const router = express.Router()





router.post('/register',registerController)


router.post('/login',loginController)


router.get('/test',requireSignIn,isAdmin,testController)




export default router