import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';


import { jwtDecode } from 'jwt-decode';


import Unauthorized from './Unauthorized';

export default function Protect({allowedRoles}) {

  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(()=>{

    const authCheck = async() =>{

     const token = sessionStorage.getItem('token');
     
      // check token avalable
      if(!token){
        navigate('/login');
        return;
      }

      // decode token
      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
      } catch (err) {
        console.error('Invalid token:', err);
        sessionStorage.removeItem('token');
        navigate('/login');
        return;
      }


      try {
        // verify token is correct
        const res = await axios.get('http://localhost:8080/api/auth/verify-token',{
          headers : {'x-auth-token' : token}
        });

        // check roles are autorized 
        if(!allowedRoles || allowedRoles.includes(decodedToken.role)){
          setAuthorized(true);
        } else{
          setAuthorized(false);
        }
        
      } catch (error) {
        console.error('Token verification failed:', error);
        sessionStorage.removeItem('token');
        setAuthorized(false);
        navigate('/login');

      } finally {
        setChecking(false);
      }
    }

    authCheck();

  },[allowedRoles,navigate]);


  if (checking) return <div>Checking authorization...</div>;

  if(!authorized){
    return <Unauthorized />
  }

  return <Outlet/> 
}
