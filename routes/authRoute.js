import  express  from 'express';
import {forgotPasswordController, loginController,registerController,testController,updateProfileController} from '../controller/authController.js'
import { isAdmin, requireSignIn } from '../middleware/authMiddleware.js';



const router = express.Router()





router.post('/register',registerController)


router.post('/login',loginController)


router.post('/forgotPassword',forgotPasswordController)


router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
  });

router.get('/admin-auth', requireSignIn,isAdmin, (req,res) => {
    res.status(200).send({
        ok : true
    })
    
})

router.put('/profile',requireSignIn,updateProfileController)


router.get('/test',requireSignIn,isAdmin,testController)



export default router