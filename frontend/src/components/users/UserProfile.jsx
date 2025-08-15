import React, { useEffect, useState,useRef } from 'react';
import DefaultUser from '../../assets/DefaultUser.png'
import UpdateUser from './UpdateUser';
import UpdatePassword from './UpdatePassword';
import Loading from '../Loading';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';
import DeleteUser from './DeleteUser';

export default function UserProfile({userId,onClose}) {

  const token = sessionStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(true);
  const setErrorMessage = useRef(null);
  const setSuccessMessage = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: '',
    profilepic: null,
  });

  const fetchUser = async()=>{
    try {
        const response = await axios.get(`http://localhost:8080/api/auth/user/${userId}`,{
          headers: {
            'x-auth-token': token
          }
        });
        setFormData(response.data);
        setIsLoading(false);
    } catch (error) {
        console.error(error);
        setIsLoading(false);
    }
  }

  useEffect(()=>{
    fetchUser();
  },[token,userId]);


  if(isLoading){
    return(
      <Loading/>
    )
  }

  return (
    <>
    
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
      
      <button onClick={onClose} className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow transition duration-150 cursor-pointer " ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>

      <div className="relative bg-gray-100 p-6 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 h-screen md:h-auto max-h-screen overflow-y-auto">

        {/* Profile Card */}
        <div className="col-span-1 bg-white h-full w-full justify-center rounded-lg shadow flex flex-col items-center text-center p-2">
          {
            formData.profilepic ?  
            <img className="w-28 h-28 rounded-full object-cover mb-4" src={`http://127.0.0.1:8080/uploads/${formData.profilepic}`}  alt="User Avatar" /> :
            <img className="w-28 h-28 rounded-full object-cover mb-4" src={DefaultUser}     alt="User Avatar" />
          }
        
          <h2 className="text-lg font-semibold">{formData.username }</h2>
          <p className="text-sm text-gray-500 capitalize">{formData?.role}</p>
          <p className="text-xs text-gray-400 mt-2">Joined on: {new Date(formData.createdAt).toDateString()}</p> 
        </div>

         <div className="col-span-1 md:col-span-2 space-y-6 md:max-h-[70vh] overflow-y-auto">

          {/* Profile Information */}
          <div className="bg-white p-5 rounded-lg shadow">
              <h3 className="text-md font-semibold mb-2 border-b pb-2">Genaral Information</h3>
            <UpdateUser userId={userId} token={token} formData={formData} setFormData={setFormData} onUserUpdated={fetchUser} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
          </div>

          {/* Update Password */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-md font-semibold mb-2 border-b pb-2">Update Password</h3>
              <UpdatePassword userId={userId} token={token} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
          </div>

          {/* Delete Account */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h3 className="text-md font-semibold mb-2 border-b pb-2 text-red-600">Delete Account</h3>
            
            <DeleteUser userId={userId} token={token} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
          </div>

        </div>
      </div>

    </>
  )
}
