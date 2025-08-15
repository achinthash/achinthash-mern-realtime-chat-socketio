import express from 'express';
import { newUser, login, user,allUsers,frogotPassword,resetPassword,updatePassword,updateProfile,deleteUser } from '../controllers/authController.js';
import upload from "../middleware/upload.js";
import auth from '../middleware/authMiddleware.js';
import authorizePermissions from '../middleware/authorizePermissions.js';

const router = express.Router();

// verify token
router.get('/verify-token',auth,(req,res)=>{
    res.json({ valid: true, user: req.user });
});


router.post('/newuser',upload.single('profilepic'), newUser);
router.post('/login',login);
router.post('/forgot-password',frogotPassword);
router.post('/reset-password',resetPassword);


router.get('/user/:id',auth,authorizePermissions('view_profile'), user );
router.get('/users',auth,authorizePermissions('view_users'), allUsers );
router.put('/user/password/:id',auth,updatePassword );
router.put('/user/update/:id',auth,upload.single('profilepic'),updateProfile);
router.delete('/user/:id',auth,deleteUser);







export default router;