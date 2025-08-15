import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DefaultUser from '../../../assets/DefaultUser.png';

export default function GroupChat({onChatCreated}) {

    const token = sessionStorage.getItem('token');
    const [users, setUsers] = useState([]);
    const [searchUser, setSearchQuery] = useState('');
    const [name , setName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [selectedUser, setSelectedUser] = useState([]);

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


    const selectedUserList = (userId) => {

        if(selectedUser.includes(userId)){
            setSelectedUser(selectedUser.filter((id) => id != userId));
        }
        else{
            setSelectedUser([...selectedUser,userId]);
        }
    }


    const handleFileChange = (e) =>{
        setAvatar(e.target.files[0]);
    }


    const newGroup = async(e) =>{

        e.preventDefault();

        const formData = new FormData();
        formData.append('name',name);
        formData.append('isGroup',true);

        if(avatar){
            formData.append('avatar',avatar);
        }

        selectedUser.forEach((userId)=>{
            formData.append('members',[userId]);
        })

        try {

            const response = await axios.post('http://127.0.0.1:8080/api/chat/new-chat', formData,{
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

                    <div key={user._id}  onClick={()=>selectedUserList(user._id)} className="flex items-center justify-between cursor-pointer   bg-slate-300 hover:bg-slate-400  py-2 mb-2 rounded-lg mt-3 ">
                        <div  className="flex items-center "> 
                            {
                                user.profilepic ? 
                                <img src={`http://127.0.0.1:8080/uploads/${user.profilepic}`} className="w-8 h-8 rounded-full ml-2" alt="User" />
                                    :
                                <img src={DefaultUser} className="w-8 h-8 rounded-full ml-2" alt="User" />
                            }
                            <h2 className="text-base font-bold ml-2 mr-2"> {user.username} </h2>
                        </div>

                        {selectedUser.includes(user._id) ? 

                            <svg className='mr-2' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"    fill="#000000"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/> </svg> : null 
                        }

                    </div>
                ))
            }
        </div>

        <form onSubmit={newGroup} className=' p-2 border-t border-black'>

            <label className='text-xs text-black text-left mb-[2px]'>Group Name*</label>
            <input value={name} onChange={ (e)=>setName(e.target.value)} type='text'   placeholder="Group Name"  className="py-2 px-2 border-1  rounded-lg w-full bg-white " /> <br />

            <label className='text-xs text-black text-left mb-[2px]'>Group avatar*</label>
            <input onChange={handleFileChange} type='file'  className="py-2 px-2 border-1  rounded-lg w-full bg-white" /> <br />

            <button className='bg-blue-700 hover:bg-blue-900 cursor-pointer text-center w-full text-white p-2 rounded-lg mt-2 '> Create Group </button>
        </form>
    </>
  )
}
