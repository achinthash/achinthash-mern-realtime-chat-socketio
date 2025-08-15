import axios from 'axios';
import React from 'react';

export default function UpdateUser({userId,token,formData,setFormData,onUserUpdated,setSuccessMessage,setErrorMessage}) {

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            profilepic: e.target.files[0],
        }));
    };

    const handleChange = (e)=>{
        const {name , value} = e.target;
        setFormData((prev)=>({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit  = async(e)=>{

        e.preventDefault();

        const formPayload = new FormData();
        formPayload.append("username", formData.username);
        formPayload.append("email", formData.email);
        formPayload.append("phone", formData.phone);
        formPayload.append("role", formData.role);

        if (formData.profilepic) {
            formPayload.append("profilepic", formData.profilepic); 
        }
        try {
            const response = await axios.put(`http://localhost:8080/api/auth/user/update/${userId}`, formPayload ,{
            headers:{
                'x-auth-token': token,
                'Content-Type': 'multipart/form-data',
            }
            });
            setSuccessMessage.current(response.data.message);

            // update fech user data
            if (onUserUpdated) {
                onUserUpdated();
            }

        } catch (error) {
            setErrorMessage.current( error.response.data.message || "An error occurred.");
            console.error(error)
        }
    }

  return (
    <>
     
        <form onSubmit={handleSubmit} className=' grid grid-cols-2 gap-4     dark:bg-gray-900 p-4    text-black dark:text-white'>

            <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                <input type="text" id="username" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "  name="username"  required value={formData.username} onChange={handleChange}/>

                <label htmlFor="username" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">User Name</label>
            </div> 

            <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                <input type="tel" id="phone" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   required name="phone" value={formData.phone}    onChange={handleChange}/>

                <label htmlFor="phone" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Phone Number</label>
            </div> 

            <div className="relative w-full col-span-2 md:col-span-1  mb-3">
                <input type="email" id="email" className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "   name="email"  required value={formData.email}    onChange={handleChange}/>

                <label htmlFor="email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email address</label>
            </div>

            <div className="relative w-full col-span-2 md:col-span-1 mb-3">
                <select  id="role" value={formData.role}   onChange={handleChange}  required className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" >
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

            <div className='  col-span-2  space-x-2   flex '>
                <button className="bg-gray-800 rounded-3xl hover:bg-black  dark:bg-gray-600 dark:hover:bg-slate-500  text-white  py-2 px-4  text-sm" type="submit">Update</button>
            </div>

        </form>
    </>
  )
}
