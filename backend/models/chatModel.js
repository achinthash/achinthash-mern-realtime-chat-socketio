import mongoose from "mongoose";

const chatSchema = mongoose.Schema({

    name:{
        type: String,
    },
    isGroup :{
        type: Boolean,
        default: false
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    avatar: {
        type: String, 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

},{timestamps: true});

const Chat = mongoose.model('chat',chatSchema);

export default Chat;


