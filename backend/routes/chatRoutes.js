import express from 'express';
import auth from '../middleware/authMiddleware.js';
import upload from "../middleware/upload.js";
import { newChat,myChats,users,chat,newMessage,messages,MsgStatusBulk,MsgStatusUpdate,addMebersGroup,newAdminsGroup,updateGroup,removeAdminFromGroup,removeMemberGroup, leaveGroupChat,deleteChat } from '../controllers/chatController.js';

const router = express.Router();



router.post('/new-chat',upload.single('avatar'),auth,newChat);

router.get('/chats',auth,myChats); 

router.get('/users',users);

router.get('/chat/:id',auth,chat);

router.post('/new-message',upload.single('file'),auth,newMessage);

router.get('/messages/:id',auth,messages);

router.post('/message-status/bulk-update',auth,MsgStatusBulk);
router.post('/message-status/single-update',auth,MsgStatusUpdate);

router.patch('/add-members/:id',auth,addMebersGroup);

router.patch('/new-admin/:id',auth,newAdminsGroup);
router.put('/update/group-chat/:id',upload.single('avatar'),auth,updateGroup);

router.patch('/remove-admin/:id',auth,removeAdminFromGroup);
router.patch('/remove-member/:id',auth,removeMemberGroup);

router.patch('/leave-group/:id',auth,leaveGroupChat);

router.delete('/delete-group/:id',auth,deleteChat);

 

export default router;