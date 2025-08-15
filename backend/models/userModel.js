import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,'Please fill a valid email address']
    },
    password : {
        type: String,
        required: true,
        minlength:6
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^(?:\+94|0)?7\d{8}$/, 'Please enter a valid Sri Lankan phone number'],
    },

    role : {
        type: String,
        enum: ['admin', 'staff'],
        default: 'staff'
    },
    profilepic: {
        type: String, 
        default: ''
    }, 
    isDeleted : {
        type : Boolean,
        default : false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, {
    timestamps : true
});


userSchema.pre(/^find/, function (next) {
    this.where({isDeleted : false});
    next();
})

const User = mongoose.model('user', userSchema); 

export default User;