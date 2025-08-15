import axios from 'axios';
import React, { useState,useRef } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import ResponseMessages from '../ResponseMessages'


export default function NewUser({onClose}) {


  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const token = sessionStorage.getItem('token');

  
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);


  const handleFileChange = (e) =>{
    setProfilePic(e.target.files[0]);
  }


  const handleSubmit  = async(e)=>{
    e.preventDefault();


    if (password !== passwordConfirmation) {
        setErrorMessage.current("Passwords do not match.");
        return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("role", role);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    if (profilePic) {
        formData.append("profilepic", profilePic); 
    }

    try {
        
        const response = await axios.post('http://localhost:8080/api/auth/newuser', formData ,{
           headers:{
            'a-auth-token': token,
            'Content-Type': 'multipart/form-data',
           }
        });

        setSuccessMessage.current(response.data.message);

    } catch (error) {
        setErrorMessage.current( error.response.data.message || "An error occurred.");
    }
  }


  return (

    <> 
    
        <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>

        <button onClick={onClose} className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow transition duration-150 cursor-pointer " ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>

        <div className='relative'>

        
            <form onSubmit={handleSubmit} className=' grid grid-cols-2 gap-4     dark:bg-gray-900 p-4  min-h-[50vh] max-h-[80vh] overflow-y-auto   text-black dark:text-white'>

                <h1 className='col-span-2 p-1 text-lg'> Genaral Information  </h1> 


                <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                    <input type="text" id="username" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "  name="username"  required value={username} onChange={(e)=>setUsername(e.target.value)}/>

                    <label htmlFor="username" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">User Name</label>
                </div> 

                <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                    <input type="tel" id="phone" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   required name="phone" value={phone}  onChange={(e)=>setPhone(e.target.value)}/>

                    <label htmlFor="phone" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Phone Number</label>
                </div> 

                <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                    <input type="email" id="email" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="email"  required value={email}  onChange={(e)=>setEmail(e.target.value)}/>

                    <label htmlFor="email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email address</label>
                </div>

                

                <div className="relative w-full col-span-2 md:col-span-1 mb-3">
                    <select  id="role" value={role} onChange={(e) => setRole(e.target.value)}  required className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
                        <option value="" disabled hidden>Select Role</option>
                        <option value="admin">admin</option>
                        <option value="staff">staff</option>

                        <option value="client">Client</option>
                    </select>
                    
                    <label htmlFor="role"  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"  > User Role  </label>
                </div>

                <div className="relative w-full col-span-2 md:col-span-1 mb-3">
                    <input  type="file"   id="profile_picture"    onChange={handleFileChange}  className="block pt-4 pb-2.5 px-2.5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" />

                    <label  htmlFor="profile_picture"  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1" >   Profile Picture   </label>
                </div>

                <div className='col-span-2 grid grid-cols-2 gap-4'>

                    <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                        <input type="password" id="password" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="password"  required  value={password}  onChange={(e)=>setPassword(e.target.value)}/>

                        <label htmlFor="password" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Password</label>
                    </div>

                    <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                        <input type="password" id="passwordConfirmation" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="passwordConfirmation"  required value={passwordConfirmation}  onChange={(e)=>setPasswordConfirmation(e.target.value)}/>

                        <label htmlFor="passwordConfirmation" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"> Confirm password</label>
                    </div>
                </div>

                <div className='  col-span-2  space-x-2   flex '>
                    <button className="bg-gray-800 rounded-3xl hover:bg-black  dark:bg-gray-600 dark:hover:bg-slate-500  text-white  py-2 px-4  text-sm" type="submit">Save</button>

                    <button   className=" border-black border-1 hover:bg-black text-black hover:text-white dark:bg-gray-600 dark:hover:bg-slate-500 text-sm  px-4 rounded-3xl"  type="reset">Cancel</button>
                </div>

            </form>
            
        </div>
    </>
  )
}
