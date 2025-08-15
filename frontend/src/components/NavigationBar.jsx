import React, { useState } from 'react';
import { Link, useNavigate,Outlet } from 'react-router-dom';
import DefaultUser from '../assets/DefaultUser.png';
import UserProfile from './users/UserProfile';

export default function NavigationBar() {


    const userInfo = JSON.parse(sessionStorage.getItem('user-info'));
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false)

    const Navigate = useNavigate();


    const logOut = async ()=>{
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user-info');
        setProfileOpen(false);

        Navigate('/login');
    }

  const [showUserProfile, setShowUserProfile] = useState("");


  return (


    <> 
    
      {
        showUserProfile && (
          <div className="fixed top-0 left-0 w-full h-full inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.4)] rounded-lg  w-3/4 max-w-4xl">
              <UserProfile onClose={() => setShowUserProfile("")} userId={showUserProfile} />
            </div>
          </div>
        )
      }
      
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                WorkManage
              </Link>
              <div className="hidden md:flex space-x-4 ml-10">
                <Link to="/Home" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link to="/Chat" className="text-gray-700 hover:text-blue-600">Chats</Link>
                {
                  userInfo.role === 'admin' && (
                    <Link to="/users" className="text-gray-700 hover:text-blue-600">Users</Link>
                  )
                }
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 rounded-full">

              <button onClick={() => setProfileOpen(!profileOpen)}> 
                  {   userInfo.profilepicture ?   <img className="w-8 h-8 rounded-full" src={`http://127.0.0.1:8080/uploads/${userInfo.profilepicture}`} />  : 
                      <img className="w-8 h-8 rounded-full" src={DefaultUser} /> 
                  }   
              </button>

            
              
            </div>


            {
              profileOpen && (
                <div className=' bg-red-50 text-black  dark:bg-gray-800 dark:text-white  absolute right-2 top-16 p-2 shadow-[0_3px_10px_rgb(0,0,0,0.4)]  rounded-lg z-10'>
                    <ul className='flex flex-col justify-center text-center  '>
                        <li className='py-2 flex flex-wrap  px-6 border-black border-b-[1px] mb-1'>{userInfo.username}</li>
                        <li onClick={()=> {setShowUserProfile(userInfo.id) , setProfileOpen(false)}} className='py-2  hover:bg-violet-300 px-6 rounded-lg dark:hover:text-black' >Profile</li>
                        <li className='py-2  hover:bg-violet-300 px-6  rounded-lg dark:hover:text-black '>Settings</li>
                        <li onClick={logOut} className='py-2  hover:bg-violet-300 px-6 items-center justify-center rounded-lg dark:hover:text-black ' >Sign out</li>
                    </ul>
                </div>
                )
              }


            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-100">
            <Link to="/home" className="block text-gray-700 hover:text-blue-600">Home</Link>
            <Link to="/chat" className="block text-gray-700 hover:text-blue-600">Chat</Link>
          
            
              {
                userInfo.role === 'admin' && (
                  <Link to="/users" className="text-gray-700 hover:text-blue-600">Users</Link>
                )
              }

            <hr />
            <li   onClick={()=> {setShowUserProfile(userInfo.id) , setProfileOpen(false)}} className="block text-gray-700 hover:text-blue-600">Profile</li>
            <button className="w-full text-left text-blue-600 hover:text-blue-700">Logout</button>
          </div>
        )}

 
      </nav>
       <Outlet />
    </>
  );
}