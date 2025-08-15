import React, { useState,useEffect,useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BackgroundImage from '../../assets/Background-image.png';
import axios from 'axios';
import ResponseMessages from '../ResponseMessages';

export default function Registration() {

    const [username, setUserName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");

    const Navigate = useNavigate();
    const setErrorMessage = useRef(null);
    const setSuccessMessage = useRef(null);
  

  //  Redirect if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('token');

    const checkToken = async () => {
      if (token) {
        try {
          await axios.get('http://localhost:8080/api/auth/verify-token', {
            headers: { 'x-auth-token': token }
          });
          Navigate('/home'); 
        } catch (error) {
          sessionStorage.removeItem('token');
        }
      }
    };

    checkToken();
  }, [Navigate]);


    const submit = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post('http://localhost:8080/api/auth/newuser',{
                username,
                email,
                password,
                phone,
                password_confirmation
            });

            sessionStorage.setItem('token', response.data.token);
           setSuccessMessage.current(response.data.message)

            setTimeout(()=>{
                Navigate('/login') 
            },3000)
            
        } catch (error) {
            console.error(error);
            setErrorMessage.current(error.response.data.message)
        }

    }

  return (

    <> 
      <ResponseMessages setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>


    <div className='max-h-[100vh] overflow-auto   bg-gray-100 text-black dark:bg-gray-900 dark:text-white  '>
        <div className='  w-full h-[100vh]  md:flex justify-center items-center  '>
            <div className=' flex flex-col md:flex-row p-6 md:shadow-[0_3px_10px_rgb(0,0,0,0.4)] rounded-lg dark:bg-gray-800'>
                <div >
                    <h2 className=' font-bold text-center text-3xl mb-6'>Sign Up</h2>

                    <form onSubmit={submit} className=' w-full min-w-[350px] max-w-[350px] space-y-3 p-2' >

                        <input type="text" placeholder="Full name" className=' w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400' name='username' value={username} onChange={(e)=>setUserName(e.target.value)}/>

                        <input type="email" placeholder="Email address" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" name='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>

                        <input type="tel" placeholder="phone" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" name='phone' value={phone} onChange={(e)=>setPhone(e.target.value)}/>

                        <input type="password" placeholder="Password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" name='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>

                        <input type="password" placeholder="Confirm password" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400" name='password_confirmation' value={password_confirmation} onChange={(e)=>setPasswordConfirmation(e.target.value)}/>

                        <div class="flex justify-between">
                            <span>
                                <input type='checkbox' />
                                <label className='text-[15px]'> Remember me </label> <br/>
                            </span>
                            <span href="#" class="text-sm text-gray-500">Forgot your <Link to="/forgot-password" className="font-semibold text-gray-700">password?</Link></span>
                        </div>
                    
                    <button className='  w-full text-white bg-indigo-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'  > Sign Up</button>

                    <p class="text-center text-sm text-gray-500">
                    Already have an account? <Link to={'/login'} id="switchToLogin" class="text-purple-500 font-medium">Sign In</Link>
                    </p>

                </form>
            </div>

            <div className=' md:border-r-[1px] md:border-black md:ml-4 md:mr-4  '></div>

            <div className='   flex justify-center items-center   '>
                <img className="rounded-lg max-w-[350px] object-cover " alt='backgrond image'   src={BackgroundImage} />
            </div>

            </div>
        </div>

    </div>
    </>
  )
}
