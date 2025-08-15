import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DefaultUser from '../../../assets/DefaultUser.png';

export default function PrivateChat({onChatCreated}) {


    const token = sessionStorage.getItem('token');
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchQuery] = useState('');


    useEffect(()=>{

        const allUsers = async() => {

            try {
            
                const response = await axios.get('http://127.0.0.1:8080/api/chat/users',{
                    headers: {'x-auth-token' : token}
                });
                setUsers(response.data);

            } catch (error) {
                console.error(error);
            }
        }
        allUsers();

    },[token]);

    const filterdUser = users.filter(user =>
        user.username.toLowerCase().includes(searchUser.toLowerCase())
    )


    const NewChat = async(userId) => {

        try {
            
            const response = await axios.post('http://127.0.0.1:8080/api/chat/new-chat',{
                "isGroup" : false,
                "members" : [userId]
            }, {
                headers: {'x-auth-token' : token}
            });

            onChatCreated(response.data.chat._id);   

        } catch (error) {
            console.error(error);
        }
    }


  return (
    <>

        <input value={searchUser} onChange={(e)=> setSearchQuery(e.target.value)}  type="text"   placeholder="Search for Contacts "  className="py-2 px-2 border-1  rounded-lg w-full bg-white"/>

        <div className='max-h-[40vh] overflow-y-auto'> 
            {
                filterdUser.map((user)=>(

                    <div key={user._id}  onClick={()=>NewChat(user._id)} className="flex items-center justify-between cursor-pointer   bg-slate-300 hover:bg-slate-400  py-2 mb-2 rounded-lg mt-3 ">
                        <div  className="flex items-center "> 
                            {
                                user.profilepic ? 
                                <img src={`http://127.0.0.1:8080/uploads/${user.profilepic}`} className="w-8 h-8 rounded-full ml-2" alt="User" />
                                    :
                                <img src={DefaultUser} className="w-8 h-8 rounded-full ml-2" alt="User" />
                            }
                            <h2 className="text-base font-bold ml-2 mr-2"> {user.username} </h2>
                        </div>

                    </div>
                ))
            }
        </div>
    </>
  )
}
