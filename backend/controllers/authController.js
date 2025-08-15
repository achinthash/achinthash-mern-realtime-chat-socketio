import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendMail from "../utils/email.js";
import fs from 'fs'; 

export const newUser = async (req,res) =>{
   
    try {

        const { username, email, password, password_confirmation, phone, role } = req.body;

        if(password !== password_confirmation){
            return res.status(400).json({ message: 'Passwords do not match !' });
        }

        // check required fields
        if(!username || !email || !password || !phone ) {
            return res.status(400).json({ message: 'Please fill in all required fields' });
        }

        // check user is already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'})
        }

        // hash password

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const profilepic = req.file?.filename || '';

        const newUser = new User({username, email, password: hashPassword, phone, role, profilepic });
        await newUser.save();

        res.status(201).json({message :"User created successfully"});
    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const login = async(req,res) =>{

    try {
        const {email, password} = req.body;

        // check user is available
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message : "Invalid credentials"}); 
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        // Generate jwt token
        const token = jwt.sign({id:user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn: '1h'} );

        res.status(200).json({token, user:{id: user.id, role:user.role, email:user.email, username:user.username,profilepicture:user.profilepic}});

    } catch (error) {
        res.status(500).json({ error: error });
    }

}


export const user = async(req,res) =>{

    const user = await User.findById(req.params.id).select('-password');
     res.status(200).json(user);
}

export const allUsers = async(req,res) =>{

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ isDeleted: false });

    const users = await User.find().skip(skip).limit(limit).sort({createdAt: -1}).select('-password');

    res.status(200).json({
        page,
        totalUsers,
        totalPages: Math.ceil(totalUsers/limit),
        users
    });

}


export const frogotPassword = async(req,res) =>{

    const { email } = req.body;

    // check user is already exists
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 3600000;
    user.save();

    // password reset link 

    const resetUrl  = `http://localhost:5173/reset-password/${token}`;

    let htmlpage = fs.readFileSync('./views/frogotpassword.html','utf-8');
    htmlpage =   htmlpage.replace(/{{RESET_LINK}}/g, resetUrl)

    await sendMail(user.email, 'Password Reset',htmlpage)
    
    res.status(200).json({ message: 'Email sent successfully' });

}


export const resetPassword = async(req,res)=>{

    
    const {token, password, password_confirmation } = req.body;

    const user = await User.findOne({
        resetPasswordToken : token,
        resetPasswordExpire : { $gt: Date.now()}
    });
    
    if(password !== password_confirmation){
        return res.status(400).json({ message: "Passwords do not match." });
    }


    if(!user){
        return res.status(400).json({ message: 'Invalid or expired token'});
    }

    // hash password 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

   res.json({ message: 'Password has been reset' });

}


export const updatePassword = async(req,res) => {
    try {
        const { oldPassword, newPassword,password_confirmation } = req.body;

        if(newPassword !== password_confirmation){
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const userToUpdate  = await User.findById(req.params.id);

        if (!userToUpdate ) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentUser = req.user; // loged in user

        const isSelfUpdate = currentUser.id === req.params.id;
        const isAdmin = currentUser.role === 'admin';

        if (!isSelfUpdate && !isAdmin) {
        return res.status(403).json({ message: 'Access denied: cannot update another user\'s password' });
        }

        // check who request  (admin or staff)

    

        if (!isAdmin) {
            const isMatch = await bcrypt.compare(oldPassword, userToUpdate.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }
        }

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        userToUpdate.password = hashedPassword;
        userToUpdate.save();

        res.json({ message: 'Password updated successfully' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }



}


export const updateProfile = async (req,res) =>{

    try {


        const userToUpdate  = await User.findById(req.params.id);

        if (!userToUpdate ) {
            return res.status(404).json({ message: 'User not found' });
        }


        const currentUser = req.user; // loged in user

        const isSelfUpdate = currentUser.id === req.params.id;
        const isAdmin = currentUser.role === 'admin';

        if (!isSelfUpdate && !isAdmin) {
        return res.status(403).json({ message: 'Access denied: cannot update another user\'s password' });
        }

        const { username, email, phone } = req.body;

        const updatedFields = {};

        if(username) updatedFields.username = username;
        if(phone) updatedFields.phone = phone;
        
        if(email){
            const existingUser = await User.findOne({email});

            if(existingUser && existingUser._id.toString() !== req.params.id){
               return res.status(400).json({ message: 'Email is already in use by another user' });
            }
            updatedFields.email = email;
        }

        if(req.file) {
            updatedFields.profilepic = req.file.filename;
        }

        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {$set : updatedFields}, {new : true}
        )

        res.status(200).json({
            message: 'User updated successfully',
            product: updateUser,
        });

    } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
    }

}


export const deleteUser = async(req,res) =>{

    try {

        // Check if user exists
        const userToDelete  = await User.findById(req.params.id);

        if (!userToDelete ) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentUser = req.user; // loged in user

        const isSelfDelete = currentUser.id === req.params.id;
        const isAdmin = currentUser.role === 'admin';

        if (!isSelfDelete && !isAdmin) {
            return res.status(403).json({ message: 'Access denied: cannot delete another user\'s account' });
        }

        //  Prevent deletion of admin accounts
        if (userToDelete.role === 'admin') {
        return res.status(403).json({ message: 'Admin accounts cannot be deleted' });
        }

        //  Password confirmation required only for staff
        if(!isAdmin){

            const { password } = req.body;

            if (!password ) {
                return res.status(400).json({ message: 'Please provide your password' });
            }       

            const isMatch = await bcrypt.compare(password , userToDelete.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Password is incorect!' });
            }
        }
 
        // Soft delete the user
        const user = await User.findByIdAndUpdate(req.params.id,{ isDeleted: true }, {new:true});

        res.status(200).json({ message: 'Your account has been deleted successfully' });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

}