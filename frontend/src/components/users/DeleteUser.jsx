import axios from 'axios';
import React, { useState } from 'react'

export default function DeleteUser({userId, token, setSuccessMessage,setErrorMessage}) {

    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [password, setPassword] = useState("");

    const deleteUser = async() =>{
        
        try {
            
            const response = await axios.delete(`http://localhost:8080/api/auth/user/${userId}`,{
                headers: { 'x-auth-token': token } , 
                data: { password }
            });
            setSuccessMessage.current(response.data.message);
            
        } catch (error) {
            setErrorMessage.current( error.response.data.message || "An error occurred.");
            console.error(error);
        }
    }

  return (
    <div>

        <p className="text-sm text-gray-600 mb-4">
            {userInfo.role === 'admin'
                ? 'Are you sure you want to delete this user account? This action cannot be undone.'
                : 'Enter your password to confirm account deletion. This action is permanent.'}
        </p>
    
        {
            userInfo.role !== 'admin' && (
                <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                    <input type="password" id="password" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="password"  required  value={password}  onChange={(e)=>setPassword(e.target.value)}/>

                    <label htmlFor="password" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Password</label>
                </div>
            )
        }

        <button onClick={deleteUser} className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-4 rounded"> Delete User</button>
    
    </div>
  )
}


