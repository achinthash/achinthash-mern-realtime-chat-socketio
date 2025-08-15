import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from './assets/Background-image.png';

function Unauthorized() {
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (

    <>
    
      <div className='w-full h-[100vh] flex justify-center items-center bg-white text-black dark:bg-gray-800 dark:text-white'>

        <div className='text-center lg:shadow-[0_3px_10px_rgb(0,0,0,0.4)] rounded-lg p-4 flex flex-col items-center  bg-white text-black dark:bg-gray-900 dark:text-white '>

            <img className=" max-w-[350px] object-cover " alt='backgrond image' src={BackgroundImage} />
            <h1 className='text-2xl font-bold  mb-3'>403 - Unauthorized</h1>

            <p className='text-lg '>You don't have access to this Workspace. You will be redirected shortly....</p>

            <button  className='text-white bg-indigo-800  py-2.5  w-full mt-2 rounded-lg hover:bg-indigo-950 '>Go back</button>

        </div>

      </div>
    </>
  );
}

export default Unauthorized;
