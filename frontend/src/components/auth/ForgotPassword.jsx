import React, {useState} from 'react';
import BackgroundImage from '../../assets/Background-image.png';
import axios from 'axios';

export default function ForgotPassword() {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState("");

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

        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password',{
                email
            });
            setSuccessMessage(response.data.message);

        } catch (error) {
            
          setErrorMessage(error.response?.data?.message || 'Something went wrong');
        }
    }


  return (

    <div className='w-full h-full absolute flex justify-center items-center z-0 '>
        <div className="flex flex-col  w-full sm:w-1/3 max-w-md justify-center items-center border p-6 rounded-lg border-black shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] mx-2 bg-gray-100 ">

        <img src={BackgroundImage} className=" w-56 h-auto   " alt="Image Description"/>

            <p className="text-wrap text-justify ">Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.</p>

            {success && <p className="mt-2 text-green-700">{success}</p> }
            {error && <p className="mt-2 text-red-700">{error}</p> }

            <form onSubmit={submit} className="w-full  mt-3 mb-2 flex  flex-col " >
                <label className="text-left items-start">Email Address: </label>
                <input  className='py-2 px-2 border bg-white w-full border-black rounded-lg focus:outline-none focus:border-blue-500"' required type='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email address"/>

                <button type="submit" className="bg-blue-900 w-auto items-center p-3 text-white font-bold rounded-l mt-2 "> Email password reset Link  </button>
            </form>

        </div>
    </div>
 
  )
}
