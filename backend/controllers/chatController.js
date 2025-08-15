
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

import Message from "../models/messageModel.js";


export const users = async(req,res) => {

    try {
        
        const users = await User.find().select('_id username profilepic');

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const newChat = async(req,res)=>{

    const { name, isGroup, members = [], admins = [] } = req.body;
    const authUser = req.user;

    try {

        const allMembers = [...new Set([...members,authUser.id])];

        if(!isGroup){

            const existingChat  = await Chat.findOne({
                isGroup: false,
                members: {$all : allMembers}
            });

           if(existingChat){
             return res.status(200).json({message: "Private chat already exists.", chat: existingChat });
           }
        }

        const avatar = req.file?.filename || '';

        const newChat = new Chat({name, isGroup, members : allMembers, admins : authUser.id, avatar, createdBy : authUser.id});

        await newChat.save();

        res.status(201).json({ message: "Chat created successfully", chat: newChat });
        
    } catch (error) {
        res.status(500).json({ error: error });
    }

}


export const myChats = async(req,res) =>{

    try {
        const userId = req.user.id;

        const chats = await Chat.find({
            members:userId
        })
        .populate('members', 'username profilepic')  


        const filteredChats = await Promise.all(
            chats.map(async (chat) =>{



                const modifiedChat = chat.toObject();

                if(!chat.isGroup){
                    modifiedChat.members = chat.members.filter(member => member._id.toString() !== userId);
                }


                const lastMessage = await Message.findOne({ chatId: chat._id }).sort({ createdAt: -1 });

                modifiedChat.lastMessage = lastMessage || null;


                const unreadCount = await Message.countDocuments({ chatId: chat._id, status : { $ne : 'read' }, senderId: { $ne : userId } });

                modifiedChat.unreadCount = unreadCount;

                return modifiedChat;

            })
        
        
        )
 
                


          
    

        res.status(200).json({ chats: filteredChats });


    } catch (error) {

        res.status(500).json({ error: error.message || 'Internal Server Error' });

    }
    
}


export const chat = async(req,res) =>{

    try {

        const chatId = req.params.id;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId)
           .populate('members', 'username profilepic')  
            .populate('admins', 'username profilepic')  

        const modifiedChat = chat.toObject();

        if(!chat.isGroup){
            modifiedChat.members = chat.members.filter(member => member._id.toString() !== userId);
        }

        

       res.status(200).json({ chats: modifiedChat });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const newMessage = async(req,res)=>{

    
    try {

        const { chatId, message_type, content } = req.body;
        const senderId = req.user.id;

       // Validate required fields
        if (!chatId || !message_type || (!content && !req.file)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let fileData = null;

        if (req.file) {
            fileData = {
                path: req.file.filename,
                name: req.file.originalname,
                type: req.file.mimetype
            };
        }

        const newMessage = new Message({
            chatId,
            senderId,
            message_type,
            content: message_type === 'text' ? content : null,
            file: message_type !== 'text' ? fileData : null,
            status: 'send'
        });

        const savedMessage = await newMessage.save();

        res.status(201).json({
            message: 'Message sent successfully',
            data: savedMessage
        });

        
    } catch (error) {
  
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}


export const messages = async(req,res) =>{

    try {
        
        const chatId = req.params.id;

        const messages = await Message.find({
            chatId: chatId
        })
        .populate('chatId')
        .sort({createdAt: 1 })
        .populate('senderId', 'username profilepic')

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}



export const MsgStatusBulk = async(req,res) =>{

    try {

        const {messageIds, status } = req.body;

        await Message.updateMany(
            { _id:{ $in:messageIds}},
            { $set: {status: status}}
        )
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }

}

export const MsgStatusUpdate = async(req,res) =>{

    try {

        const {messageId, status } = req.body;

        await Message.updateOne(
            { _id: messageId},
            { $set: {status: status}}
        )
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }

}




export const addMebersGroup = async(req,res) =>{

    try {

        const { membersIds } = req.body;
        const authUser = req.user.id;

        if(!membersIds) {
            return res.status(400).json({ message: 'UserId are required.' });
        }

        const chat = await Chat.findById(req.params.id);

        if(!chat){
            return res.status(404).json({ message: 'Chat not found.' }); 
        }

        if(!chat.isGroup){
            return res.status(400).json({ message: 'Only group chats can have admins.' });
        }

        const isAdmin  = chat.admins.some(admin => admin.toString() === authUser);
        if (!isAdmin) {
          return res.status(409).json({ message: 'Only admins can add members' });
        }


        // Filter out duplicates
        const newMembers = membersIds.filter((id) => !chat.members.includes(id));

        chat.members.push(...newMembers);

        await chat.save();

        res.status(200).json({ message: 'Members added successfully.', members: chat.members });
        
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}




export const newAdminsGroup = async(req,res)=>{

    try {
        
        const {memberId} = req.body;
        const authUserId = req.user.id;

        if(!memberId) {
            return res.status(400).json({ message: 'UserId are required.' });
        }

        const chat = await Chat.findById(req.params.id);

        if(!chat){
            return res.status(404).json({ message: 'Chat not found.' }); 
        }

        if(!chat.isGroup){
            return res.status(400).json({ message: 'Only group chats can have admins.' });
        }

        // Check if the authenticated user is an admin
        const isAuthUserAdmin = chat.admins.some(admin => admin.toString() === authUserId);
        if(!isAuthUserAdmin){
            return res.status(403).json({ message: 'Only admins can add new admins.' });
        }

        // Check if the user to be promoted is a member
        const isMember = chat.members.some(member => member.toString() === memberId);
        if (!isMember) {
            return res.status(403).json({ message: 'User must be a member to be made an admin.' });
        }

        // Check if already an admin
        const alreadyAdmin  = chat.admins.some(admin => admin.toString() === memberId);
        if (alreadyAdmin) {
          return res.status(409).json({ message: 'User is already an admin.' });
        }

        chat.admins.push(memberId);
        await chat.save();

        return res.status(200).json({ message: 'Admin added successfully.', chat });
        
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}


export const updateGroup = async(req,res) =>{

    try {

        const name = req.body ? req.body.name : undefined;

        const chatToUpdate = await Chat.findById(req.params.id);

        if (!chatToUpdate ) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (req.file) updatedFields.avatar = req.file.filename;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).json({
            message: 'Group updated successfully',
            chat: updatedChat,
        });



        
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}



export const removeMemberGroup = async(req,res) =>{

    try {

        const { memberId } = req.body;

        const authUserId = req.user.id;

        if(!memberId) {
            return res.status(400).json({ message: 'UserId are required.' });
        }

        const chat = await Chat.findById(req.params.id);

        if(!chat){
            return res.status(404).json({ message: 'Chat not found.' }); 
        }

        if(!chat.isGroup){
            return res.status(400).json({ message: 'Only group chats can have admins.' });
        }


        //  Prevent removing self 
        if(memberId === authUserId ){
          return res.status(400).json({ message: 'You cannot remove yourself.' });
        }

        // Check if the authenticated user is an admin
        const isAuthUserAdmin = chat.admins.some(admin => admin.toString() === authUserId);
        if(!isAuthUserAdmin){
            return res.status(403).json({ message: 'Only admins can add new admins.' });
        }

        /// Check if the user to be removed is a member
        const isMember = chat.members.some(member => member.toString() === memberId);
        if (!isMember) {
        return res.status(400).json({ message: 'User is not a member of this group.' });
        }

        // Remove the member
        chat.members.pull(memberId);

        //  remove from admins if the user was an admin
        chat.admins.pull(memberId);

        await chat.save();

        return res.status(200).json({ message: 'Member removed successfully.', chat });


        
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}


export const removeAdminFromGroup  = async(req,res) =>{

    try {

        const { adminId } = req.body;
        const authUserId = req.user.id;

        const chat = await Chat.findById(req.params.id);

        if (!chat) {
        return res.status(404).json({ message: 'Chat not found.' });
        }

        if (!chat.isGroup) {
            return res.status(400).json({ message: 'Only group chats have admins.' });
        
        }

        // Check if the authenticated user is an admin
        const isAuthUserAdmin = chat.admins.some(admin => admin.toString() === authUserId);
        if (!isAuthUserAdmin) {
            return res.status(403).json({ message: 'Only admins can remove other admins.' });
        }

        // Check if the user to be removed is currently an admin
        const isTargetAdmin = chat.admins.some(admin => admin.toString() === adminId);
        if (!isTargetAdmin) {
            return res.status(400).json({ message: 'User is not an admin.' });
        }

        //  Prevent removing self as admin if it's the last admin
        if(adminId === authUserId && chat.admins.length === 1){
          return res.status(400).json({ message: 'You cannot remove yourself as the only admin.' });
        }

        chat.admins.pull(adminId);
        await chat.save();

        return res.status(200).json({ message: 'Admin removed successfully.', chat });

        
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}



export const leaveGroupChat  = async(req,res)=>{

    try {
        
        const authUserId = req.user.id;
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found.' });
        }

        if (!chat.isGroup) {
            return res.status(400).json({ message: 'Only group chats have admins.' });
        }

        // Check if the user to be removed is a member
        const isMember = chat.members.some(member => member.toString() === authUserId);
        if (!isMember) {
            return res.status(400).json({ message: 'User is not a member of this group.' });
        }

        chat.members = chat.members.filter(member => member.toString() !== authUserId );
        chat.admins = chat.admins.filter(admins => admins.toString() !== authUserId );

        await chat.save();

        res.status(200).json({ message: 'You have left the group successfully' });

    } catch (error) {
               res.status(500).json({ error: error.message || 'Internal Server Error' });
    }

}


export const deleteChat = async(req,res) =>{

    try {
        
        const authUserId = req.user.id;
        const chat = await Chat.findById(req.params.id);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found.' });
        }

        if (!chat.isGroup) {
            return res.status(400).json({ message: 'Only group chats have admins.' });
        }

       // Check if the user is admin 
        const isAdmin = chat.admins.some(admin => admin.toString() === authUserId);
        if (!isAdmin) {
            return res.status(400).json({ message: 'User is not an admin.' });
        }


        await Chat.findByIdAndDelete(chat._id);

        res.status(200).json({ message: 'Chat deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}