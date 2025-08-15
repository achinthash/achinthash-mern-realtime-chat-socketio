import React, { useRef, useState } from 'react'

import DefaultUser from '../../../assets/DefaultUser.png'
import axios from 'axios';
import NewMembers from './NewMembers';

export default function GroupInfo({chat,onClose}) {

  const authUser = JSON.parse(sessionStorage.getItem('user-info'));
  const token = sessionStorage.getItem('token');
  const fileInputRef = useRef();
  const [groupName, setGroupName] = useState(chat.name);
  const [avatarPreview, setAvatarPreview] = useState(
    chat.avatar ? `http://127.0.0.1:8080/uploads/${chat.avatar}` : DefaultUser
  );
  const [editingName, setEditingName] = useState(false);
  const [isNewMembers, setIsNewMembers] = useState(false);

  const handleImageClick = () =>{
    fileInputRef.current.click();
  }


  const handleFileChange = async(e) =>{
    
    const file = e.target.files[0];

    if(file){
      // prevew the image
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      }
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('name',groupName);
      formData.append('avatar',file);
    
      try {
        
        const response = await axios.post(`http://127.0.0.1:8080/api/chat/update/group-chat/${chat._id}`,formData,{
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      })


      } catch (error) {
        console.error(error);
      }
 
    }

  }

     
 const handleNameSave = async () => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8080/api/chat/update/group-chat/${chat._id}`,
        { name: groupName },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      setEditingName(false);
    } catch (err) {
      console.error('Error updating group name:', err);
    }
  };


  const labeledMembers = chat.members.map(member => {
    const isAdmin = chat.admins.some(admin => admin._id === member._id);
    return {
      ...member,
      role: isAdmin ? 'admin' : 'member'
    };
  });

  const [userClick, setUserClick] = useState("");


  const makeAdmin = async(userId) => {

    try {
      const response = await axios.patch(`http://127.0.0.1:8080/api/chat/new-admin/${chat._id}`,
        { memberId: userId },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

    } catch (error) {
      console.error('Error:', error);
    }
  }



  const removeAdmin = async(userId) => {

    try {
      const response = await axios.patch(`http://127.0.0.1:8080/api/chat/remove-admin/${chat._id}`,
        { adminId: userId },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

    } catch (error) {
      console.error('Error :', error);
    }
  }


  const removeMember = async(userId) => {

    try {
      const response = await axios.patch(`http://127.0.0.1:8080/api/chat/remove-member/${chat._id}`,
        { memberId: userId },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

    } catch (error) {
      console.error('Error:', error);
    }
  }

   const deleteChat  = async() => {

    try {
      const response = await axios.delete(`http://127.0.0.1:8080/api/chat/delete-group/${chat._id}`, 
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

    } catch (error) {
      console.error('Error:', error);
    }
  }


  const exitChat = async() => {

    try {
      const response = await axios.patch(`http://127.0.0.1:8080/api/chat/leave-group/${chat._id}`,{},
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

    } catch (error) {
      console.error('Error:', error);
    }
  }


  

  


  return (
    <div className="absolute flex w-full h-full justify-center items-center z-10 inset-0 bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-96 max-h-[90vh] overflow-y-auto p-5 relative">

        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="font-bold text-lg">Group Info</h2>
          <button onClick={onClose} className="hover:bg-gray-200 rounded-full p-1 transition">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </button>
        </div>
 
        {/* Group Avatar and Name */}
        <div className="flex flex-col items-center mb-6">

          <div> 

            <img
              src={avatarPreview}
              alt="Group Avatar"
              className="w-20 h-20 rounded-full object-cover mb-2 border"
              onClick={handleImageClick}
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />


            
          </div>
          
          <div className="flex items-center space-x-2">

            {
              editingName ? (
                <>
                  <input  type="text"value={groupName}  onChange={(e) => setGroupName(e.target.value)}  className="border px-2 py-1 rounded text-sm"  />
                  <button  onClick={handleNameSave}  className="bg-blue-500 text-white text-sm px-2 py-1 rounded">  Save </button>
                  <button onClick={() => { setEditingName(false);  setGroupName(chat.name);   }} className="text-sm px-2 py-1 text-gray-600">  Cancel </button>
                </>
              ) : (
               <>
                <h3 className="text-xl font-semibold text-center">{groupName}</h3>
                <button onClick={() => setEditingName(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                  </svg>
                </button>
               </>
              )
            }
            
          </div>
        </div>

        {/* Members List */}

        <div>
          <div className='flex justify-between border-b pb-1 mb-2'>
            <h4 className="text-md font-semibold ">Members</h4>

            <svg onClick={()=>setIsNewMembers(true)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/></svg>


            {
              isNewMembers && (
                <NewMembers chatId={chat._id} onClose={()=>setIsNewMembers(false)}/>
              )
            }

          </div>

          <ul className="space-y-2">
            {labeledMembers.map((user) => (
              <li key={user._id} className="relative group flex items-center justify-between p-1 hover:bg-gray-100 rounded">
                <div  className="flex items-center gap-2 hover:bg-amber-100 p-1 cursor-pointer">
                  <img  src={user.profilepic ? `http://127.0.0.1:8080/uploads/${user.profilepic}` : DefaultUser} alt="Member"    className="w-8 h-8 rounded-full object-cover"  />
                  <span>{user.username}</span>
                  {user.role === 'admin' && <span className='py-0.5 bg-green-200 text-xs px-2 ml-2'>admin</span>}
                </div>


                <div className='relative'> 
                 

                  {
                    user._id !== authUser.id && chat.admins.some(admin => admin._id === authUser.id) &&  ( 

                      <button onClick={() => setUserClick(userClick === user._id ? "" : user._id)}  className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none" >
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                          <path d="M480-120q-33 0-56.5-23.5T400-200q0-33 23.5-56.5T480-280q33 0 56.5 23.5T560-200q0 33-23.5 56.5T480-120Zm0-280q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-280q-33 0-56.5-23.5T400-760q0-33 23.5-56.5T480-840q33 0 56.5 23.5T560-760q0 33-23.5 56.5T480-680Z"/>
                        </svg>
                      </button>
                    ) 
                  }
                  

                  {/* Dropdown menu */}
                  {userClick === user._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
  
                      <ul className="text-sm text-gray-700">

                        <li>
                          <button onClick={()=>makeAdmin(user._id)} className="w-full text-left px-4 py-2 hover:bg-gray-100">Make Admin</button>
                        </li>

                        <li>
                          <button onClick={()=>removeMember(user._id)} className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">Remove Member</button>
                        </li>

                        {
                          user.role === 'admin' && (
                          <li>
                            <button onClick={()=>removeAdmin(user._id)} className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">Remove Admin</button>
                          </li>
                          )
                        }
                       
                        
                      </ul> 

          
                    </div>
                  )}



                </div>



              
              </li>

            ))}


          </ul>


        </div>

          <div className="mt-6 border-t pt-4 flex flex-col gap-2">
            {/* Exit Chat */}
            <button  onClick={() => exitChat() } className="w-full text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition"  >  Exit Chat </button>

            {/* Delete Chat */}
            { chat.admins.some(admin => admin._id === authUser.id) && (
              <button  onClick={() => deleteChat()} className="w-full text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"  >  Delete Chat </button>
            )}
          </div>

      </div>

      
    </div>

  )
}
