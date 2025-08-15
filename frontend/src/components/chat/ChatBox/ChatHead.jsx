import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DefaultUser from '../../../assets/DefaultUser.png';
import GroupInfo from './GroupInfo';

export default function ChatHead({chatId,isMobile,onBack}) {


   
    const token = sessionStorage.getItem('token');
    const [chat, setChat] = useState("");
    const [groupInfo, SetGroupInfo] = useState(false);


    useEffect(()=>{

        const chat = async() =>{

            try {
                
                const response = await axios.get(`http://localhost:8080/api/chat/chat/${chatId}`,{
                    headers: {'x-auth-token':token}
                });
                setChat(response.data.chats);
             
            } catch (error) {
                console.error(error);
            }
        }

        chat();
    },[token,chatId]);


  return (


    <> 

    {groupInfo && (
        <GroupInfo chat={chat} onClose={()=>SetGroupInfo(false)}/>
    )}

    
    

<div className="bg-blue-600 text-white p-3 shadow-lg">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-4 ml-2">

        {isMobile && (
      <button onClick={onBack} className="relative  bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full shadow transition duration-150 cursor-pointer " ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg></button>
    )}

        {
             chat.isGroup ? (
                <>
                    {chat.avatar ? (
                        <img src={`http://127.0.0.1:8080/uploads/${chat.avatar}`} className="w-8 h-8 rounded-full mr-2" alt="User" />
                    ) : (
                        <img src={DefaultUser} className="w-8 h-8 rounded-full mr-2" alt="User" />
                    )}
                    <h1 className="font-bold">{chat.name}</h1>
                </>
            ) : (

                <>
                    {chat.members?.[0]?.profilepic ? (
                        <img src={`http://127.0.0.1:8080/uploads/${chat.members[0].profilepic}`} className="w-8 h-8 rounded-full mr-2" alt="User" />
                    ) : (
                        <img src={DefaultUser} className="w-8 h-8 rounded-full mr-2" alt="User" />
                    )}
                    <h1 className="font-bold">{chat.members?.[0]?.username}</h1>
                </>
            )
        }

        

      </div>


      <div>


        {
            chat.isGroup ? (

                <div onClick={()=>SetGroupInfo(true)}> 
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>
                </div>

            ) : (
                null
            )
        }

      </div>
    </div>
  </div>


  </>
  )
}
