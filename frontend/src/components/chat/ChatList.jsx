import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DefaultUser from '../../assets/DefaultUser.png';
import NewChat from './NewChat/NewChat';
import moment from 'moment';

export default function ChatList({openConversation,activeChatId,socket}) {

  const token = sessionStorage.getItem('token');
  const [chats, setChats] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false);


  const myChats = async()=>{

    try {
      
      const response = await axios.get('http://localhost:8080/api/chat/chats',{
        headers : {'x-auth-token': token}
      });

      setChats(response.data.chats);

    } catch (error) {
      console.error(error);
    }
  }


  useEffect(()=>{
    myChats();
  },[token]);


  //   open conversatin  when new chat create 
  const onChatCreated = (id)=>{
    openConversation(id);
    myChats();
  }


  


  useEffect(()=>{

    if(!activeChatId) return;

    setChats(prevChats => prevChats.map(chat => chat._id === activeChatId ? {...chat, unreadCount: 0} : chat))

  },[activeChatId]);




  //   Message receive handle on socket

  useEffect(()=>{

    chats.forEach((chat)=>{
      socket.emit('join_chat',chat._id);
    });

    const handleReceiveMessage = async(data) =>{

      const incomingMsg = data.message.data;

      setChats((prevChat) =>
        
        prevChat.map((chat)=>{
          if(chat._id === incomingMsg.chatId){
            const isActive = chat._id === activeChatId;

            return{
              ...chat, 
              lastMessage : incomingMsg,
              unreadCount: isActive ? 0 : (chat.unreadCount || 0) + 1,
            }

          }
          return chat;
        })
      )

    }


    socket.on('receive_message',handleReceiveMessage);

    return () =>{
      socket.off('receive_message',handleReceiveMessage)

    }

  },[chats, activeChatId, socket])




  return (
    <div>

      {
        isNewChat && (
          <NewChat onClose={()=>setIsNewChat(false)} onChatCreated={onChatCreated}/>
        )
      }


      <div className="flex justify-between p-4 bg-gray-100"> 
        <h1 className="text-sm font-semibold  text-black"> Latest Chats</h1>
        <svg onClick={()=>setIsNewChat(true)}  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
      </div>


      <div className='max-h-[80vh] overflow-y-auto bg-gray-100'>
                 
        {
            chats.map((chat)=> (
                <div key={chat._id} onClick={()=>openConversation(chat._id)} className=' p-3 bg-white mb-1 hover:bg-gray-200 cursor-pointer flex w-full rounded-md'>

                    <div className=' flex  items-center justify-center' >

                      {
                        chat.isGroup ? (
                          <> 
                            {
                              chat.avatar ? (
                                <img src={`http://127.0.0.1:8080/uploads/${chat.avatar}`} className="w-8 h-8 rounded-full mr-2" alt="User" />
                              ) : (
                                <img src={DefaultUser} className="w-8 h-8 rounded-full mr-2" alt="User" />
                              )
                            }
                          </>
                        ) : 

                        (
                          <> 
                            {
                              chat.members[0].profilepic ? (
                                <img src={`http://127.0.0.1:8080/uploads/${chat.members[0].profilepic}`} className="w-8 h-8 rounded-full mr-2" alt="User" />
                              ) : (
                               <img src={DefaultUser} className="w-8 h-8 rounded-full mr-2" alt="User" />
                              )
                            }
                          </>
                        )
                      }
                    </div>

                    <div className=' w-full ml-2'>
                    
                      <div className='flex justify-between items-center'> 

                        <span  className="text-base font-bold">

                          {chat.isGroup ? chat.name : chat.members[0].username}
  
                        </span>

                        <span> 
                          {chat.unreadCount>0 ? 
                          <span className="flex items-center text-sm justify-center w-5 h-5 text-white bg-red-500 rounded-full"> {chat.unreadCount} </span> 
                          : null}
                        </span> 


                      </div>



                      {/* shows the latest message  */}
                      <div className='flex justify-between items-center '> 

                        <div className=' text-xs ' >

                          {
                          chat.lastMessage ? 

                            chat.lastMessage.message_type === 'file' ? 

                              

                              ['png', 'jpg', 'peg', 'jpeg'].includes(chat.lastMessage.file?.type?.slice(-3)?.toLowerCase()) ?

                                <span className='flex items-center '> 
                                <svg className='mr-2' xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>
                                    {chat.lastMessage?.file?.name?.length > 15 ? '...' + chat.lastMessage.file.name.slice(-12) : chat.lastMessage?.file.name} 
                                </span>
                                : 

                                <span className='flex items-center '> 
                                
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
                                    {chat.lastMessage?.file?.name?.length > 15 ? '...' + chat.lastMessage.file.name.slice(-12) : chat.lastMessage?.file.name} 
                                </span>
                            
                                : 

                              chat.lastMessage?.content?.substring(0, 2) ?? '' :

                            null
                          }
                          
                      </div> 

                        {/* message time  */}

                        {   
                          chat.lastMessage ? 
                            <p className=' text-xs'> {moment(chat.lastMessage.createdAt).format("h:mm A")} </p>  :
                          null
                        }

                          
                      </div> 
            
                    </div> 
                </div>
            ))
        }
      </div>
        
    </div>
  )
}
