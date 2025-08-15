import axios from 'axios';
import React, { useState } from 'react';

export default function UpdatePassword({userId, token, setSuccessMessage,setErrorMessage}) {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [password_confirmation, setPassword_confirmation] = useState('');

const handleSubmit  = async(e)=>{
    e.preventDefault();

    if (newPassword !== password_confirmation) {
        setErrorMessage.current("Passwords do not match.");
        return;
    }

    try {
        
        const response = await axios.put(`http://localhost:8080/api/auth/user/password/${userId}`, {
            oldPassword,newPassword,password_confirmation
        } ,{
           headers:{
            'x-auth-token': token
           }
        });

        setSuccessMessage.current(response.data.message);

    } catch (error) {
        setErrorMessage.current( error.response.data.message || "An error occurred.");
    }
  } 


  return (
    <div>
        
        <form onSubmit={handleSubmit} className='col-span-2 grid grid-cols-1 gap-2'>

            <div className="relative w-full col-span-2 md:col-span-1  mb-2">
                <input type="password" id="oldPassword" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="oldPassword"  required  value={oldPassword}  onChange={(e)=>setOldPassword(e.target.value)}/>

                <label htmlFor="oldPassword" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Old Password</label>
            </div>


            <div className="relative w-full col-span-2 md:col-span-1  mb-2">
                <input type="password" id="newPassword" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="newPassword"  required  value={newPassword}  onChange={(e)=>setNewPassword(e.target.value)}/>

                <label htmlFor="newPassword" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">New Password</label>
            </div>


            <div className="relative w-full col-span-2 md:col-span-1  mb-2">
                <input type="password" id="password_confirmation" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="password_confirmation"  required value={password_confirmation}  onChange={(e)=>setPassword_confirmation(e.target.value)}/>

                <label htmlFor="password_confirmation" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"> Confirm password</label>
            </div>

            <div className='  col-span-2  space-x-2 mt-2  flex '>
                <button className="bg-gray-800 rounded-3xl hover:bg-black  dark:bg-gray-600 dark:hover:bg-slate-500  text-white  py-2 px-4  text-sm" type="submit">Save</button>
            </div>

        </form>

       

    </div>
  )
}
