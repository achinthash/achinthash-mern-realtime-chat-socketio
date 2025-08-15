import mongoose from "mongoose";


const messageSchema = mongoose.Schema({

    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message_type:{
        type: String,
        required : true
    },
    content: {
        type: String
    },
   file: {
    path: { type: String },
    name: { type: String },
    type: { type: String }
  },
    status: {
        type: String,
        required : true,
        enum: ['send','deliverd','read'],
        default: 'read'
    },
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }


},{timestamps: true});


const Message = mongoose.model('message',messageSchema);

export default Message;