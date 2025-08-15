import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'

import './App.css'
import Protect from './Protect';
import Home from './components/Home';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Users from './components/users/Users';
import Chat from './components/chat/chat';
import Registration from './components/auth/Registration';

import NavigationBar from './components/NavigationBar';
import NotFound from './NotFound';


function App() {


  return (
    <Router>

      <Routes>


        <Route path='*' element={<NotFound/>}></Route>
        <Route path='/login' element={<Login/>}> </Route>
        <Route path='/register' element={<Registration/>}> </Route>
        <Route path='/forgot-password' element={<ForgotPassword/>}> </Route>
        <Route path='/reset-password/:token' element={<ResetPassword/>}> </Route>


          <Route element={<Protect/>}>
            <Route element={<NavigationBar />}>  

              <Route path='/home' element={<Home/>}> </Route>
              <Route path='/chat' element={<Chat/>}> </Route>

            </Route>
          </Route>

          
          <Route element={<Protect allowedRoles={'admin'} />}>
            <Route element={<NavigationBar />}>  
            
              <Route path='/users' element={<Users/>}> </Route>

            </Route>
          </Route>



       
    

      </Routes>

    </Router>
  )
}

export default App
