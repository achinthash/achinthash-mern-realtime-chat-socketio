import React, {useState} from 'react';
import BackgroundImage from '../../assets/Background-image.png';
import axios from 'axios';
import { useParams , useNavigate } from 'react-router-dom';

export default function ResetPassword() {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const { token } = useParams();

    const Navigate = useNavigate();
    
    const setErrorMessage = (errorMessage, timeout = 3000) => {
        setError(errorMessage);
            setTimeout(() => {
            setError('');
            }, timeout);
        };

    const setSuccessMessage = (successMessage, timeout = 3000) => {
        setSuccess(successMessage);
        setTimeout(() => {
            setSuccess('');
        }, timeout);
    };


    const submit = async(e) =>{
        e.preventDefault();

        if(password !== password_confirmation){
            setErrorMessage("Password not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password',{
                token,
                password,
                password_confirmation
            });

            setSuccessMessage(response.data.message);

            setTimeout(()=>{
                Navigate('/login')
            },3000);

        } catch (error) {

            
          setErrorMessage(error.response?.data?.message || 'Something went wrong. Try again.');
        }
    }

  return (
    <div className='w-full h-full absolute flex justify-center items-center z-0 '>

        <div className="flex flex-col  w-full sm:w-1/3 max-w-md justify-center items-center border p-6 rounded-lg border-black shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mx-2 bg-gray-100 ">

        <img src={BackgroundImage} className="w-56 h-auto   " alt="Image Description"/>
        <h2 className="text-lg font-bold mb-4 text-center">Reset Your Password</h2>
            
        
            {success && <p className="mt-2 text-green-700">{success}</p> }
            {error && <p className="mt-2 text-red-700">{error}</p> }

            <form onSubmit={submit} className="w-full  mt-3 mb-2 flex  flex-col " >

                <label className="text-left items-start">New Password: </label>
                <input  className='py-2 px-2 border bg-white w-full border-black rounded-lg focus:outline-none focus:border-blue-500" mb-2' required type='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" name="password"/>

                <label className="text-left items-start">Confirm Password: </label>
                <input  className='py-2 px-2 border bg-white w-full border-black rounded-lg focus:outline-none focus:border-blue-500" mb-2' required type='password' value={password_confirmation} onChange={(e)=>setPasswordConfirmation(e.target.value)} placeholder="Confirm password" name="password_confirmation"/>

                <button type="submit" className="bg-blue-900 w-auto items-center p-3 text-white font-bold rounded-l mt-2 ">  Reset Password </button>
            </form>

        
        </div>
    </div>
  )
}
