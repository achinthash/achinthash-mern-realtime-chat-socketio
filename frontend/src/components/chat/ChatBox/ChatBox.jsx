import React, { useEffect, useState,useRef } from 'react'
import ChatHead from './ChatHead';
import MessageInput from './MessageInput';
import axios from 'axios';
import moment from 'moment';


export default function ChatBox({chatId,isMobile,onBack,socket}) {

  const token = sessionStorage.getItem('token');
  const authUser = JSON.parse(sessionStorage.getItem('user-info'));
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null); 



  // socket 
   useEffect(()=>{

    socket.emit('join_chat',chatId);

    const handleReceiveMessage = async(data) =>{
     setMessages((prev)=>[...prev,data.message.data]);

      if(data.message.data.senderId !== authUser.id){

        const res = await axios.post('http://127.0.0.1:8080/api/chat/message-status/single-update',{

          messageId: data.message.data._id,
          status: 'read',
          
        },{ headers: { 'x-auth-token': token } });

        socket.emit('messageSeen', {
          roomId: chatId, 
          messageId: data.message.data._id,
        });

       
      }
    };


    const handleSeenMessage = (data) =>{
   
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === data.messageId ? { ...msg, status: 'read' } : msg
        )
      );
    }

    socket.on('messageSeen',handleSeenMessage)
    socket.on('receive_message',handleReceiveMessage);

    return () =>{
      socket.off('receive_message',handleReceiveMessage)
      socket.off('messageSeen', handleSeenMessage);
    }

  },[chatId])




  useEffect(()=>{

    const messages = async() =>{

      try {
        
        const response = await axios.get(`http://localhost:8080/api/chat/messages/${chatId}`,{
           headers: {'x-auth-token':token}
        });
        setMessages(response.data);

        const unseenMessages = response.data.filter(message=>
          message.status !== 'read' && message.senderId !== authUser.id
        );

        if(unseenMessages.length > 0 ){

          const messageIds = unseenMessages.map(msg => msg._id);

          const res = await axios.post('http://127.0.0.1:8080/api/chat/message-status/bulk-update',{

            messageIds: messageIds,
            status: 'read',
            
          },{ headers: { 'x-auth-token': token } });

          // update status socket
          messageIds.forEach(mid => {

            socket.emit('messageSeen', {
              roomId: chatId, 
              messageId: mid,
            });

          });
        }


      } catch (error) {
        console.error(error);
      }
    }
    messages();

  },[chatId, token]);



 

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView();
        }

    }, [messages]);


   const isImage = (filePath) => {
      return filePath ? /\.(jpg|jpeg|png|gif|svg)$/i.test(filePath) : false;
    }

  return (


    <div>

    


      <div className='flex flex-col justify-between h-screen '> 

        <ChatHead chatId={chatId} isMobile={onBack} onBack={onBack}/>

        {/* messages  */}

        <div  className="flex-1 p-4 chat-container overflow-y-auto max-h-full  ">
            
          {
            messages.map((message)=>(
              <div key={message._id}  className=" space-y-4">


                {
                  message.senderId === authUser.id ? (

                    <div className="flex items-start justify-end space-x-2">
                      <div className="flex flex-col items-end mb-2">
                        <div className="bg-green-100 text-black rounded-lg rounded-tr-none p-2 shadow-md max-w-md flex items-center justify-center ">
                          <div className=" flex flex-col">


                            {
                              message.file ? (

                                isImage(message.file.path) ? (

                                  <>
                                  <img   src={`http://127.0.0.1:8080/uploads/${message.file.path}`} className="w-40 h-32 rounded-md" alt="image"  />

                                  <p className='text-xs'> {message.file.name}  </p> 
                                  </>

                                ) : (
                                  <a href={`http://127.0.0.1:8000/storage/${message.file.path}`} className='flex justify-between space-x-4 p-2 bg-green-200 rounded-md'> 

                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg> 
                                        
                                    <p className='text-sm'> {message.name}  </p> 
                                  </a>
                                )

                              ) : (
                                <span className=' text-sm ml-2'>{message.content}</span> 
                              )
                            }
                          
                            <span className="  items-end text-right justify-end text-gray-500 text-xs message-time mr-1 ml-2 flex  ">
                              <p className='text-[11px] mr-1'>{moment(message.created_At).format("h:mm A")}</p>

                                { message.status === 'send' ? 
                                  
                                  <span className="text-xs "><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg></span>  :
                                  
                                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#0000FF"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg>
                                }
           
                            </span>


                          </div>
                        </div>
                      </div>
                    </div>

                  ) : ( 

                    <div className="flex items-start justify-start space-x-2">

                       <img className='w-5 h-5 rounded-full' src={`http://127.0.0.1:8080/uploads/${message.senderId.profilepic}`}/>


                      <div className="flex flex-col items-end mb-2">
                        <div className="bg-gray-300 text-black rounded-lg rounded-tl-none p-1 shadow-md max-w-md flex items-center justify-center ">
                          <div className=" flex flex-col">

                            <div className=' text-[10px] '>
                              <p>{message.chatId.isGroup ? message.senderId.username: null}</p>  
                            </div>

                            {
                              message.file ? (

                                isImage(message.file.path) ? (

                                  <>
                                  <img   src={`http://127.0.0.1:8080/uploads/${message.file.path}`} className="w-40 h-32 rounded-md" alt="image"  />

                                  <p className='text-xs'> {message.file.name}  </p> 
                                  </>

                                ) : (
                                  <a href={`http://127.0.0.1:8000/storage/${message.file.path}`} className='flex justify-between space-x-4 p-2 bg-green-200 rounded-md'> 

                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg> 
                                        
                                    <p className='text-sm'> {message.name}  </p> 
                                  </a>
                                )

                              ) : (
                                <span className=' text-sm ml-2'>{message.content}</span> 
                              )
                            }

                            <span className="  items-end text-right justify-end text-gray-500  message-time mr-1 ml-2 flex  ">
                              <p className='text-[10px]'>{moment(message.created_At).format("h:mm A")}</p>
                            </span> 
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
             
              </div>
            ))
          }
             <div ref={messageEndRef} />

        </div>

        <MessageInput chatId={chatId} socket={socket}/>

      </div>

      
    </div>
  )
}
