import axios from 'axios'
import React, { useEffect, useState } from 'react'

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import NewUser from './NewUser';
import UserProfile from './UserProfile';
import Loading from '../Loading';

export default function Users() {

  const token = sessionStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState("");


  useEffect(()=>{

    const fetchUsers = async()=>{

      try {

        const response =  await axios.get(`http://localhost:8080/api/auth/users?page=${page + 1}&limit=${rowsPerPage}`,{
          headers : {'x-auth-token' : token}
        });
        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers);

      } catch (error) {
        console.error('Error fetching users:', error);
      } finally{
        setIsLoading(false);
      }
     
    }

    fetchUsers();

  },[token, page, rowsPerPage])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  if(isLoading){
    return <Loading/>
  }

  return (
    <>

    <div className='flex flex-column justify-between bg-gray-300 mx-1  rounded-lg p-1'>
      <h1 className='p-1 font-bold text-xl text-gray-900'>Users</h1>
      <button onClick={() => setShowNewUserForm(true)} className=' py-2 px-2  bg-gray-700 rounded-lg  text-white'>New User</button>
    </div>


      {showNewUserForm && (
        <div className="fixed top-0 left-0 w-full h-full inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.4)] rounded-lg  w-3/4 max-w-3xl">
            <NewUser onClose={() => setShowNewUserForm(false)} />
          </div>
        </div>
      )}

      {
        showUserProfile && (
          <div className="fixed top-0 left-0 w-full h-full inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.4)] rounded-lg  w-3/4 max-w-4xl">
              <UserProfile onClose={() => setShowUserProfile("")} userId={showUserProfile} />
            </div>
          </div>
        )
      }


      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow sx={{ background: '#dcd8e3' }}>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row, index) => (
                 <TableRow onClick={() => setShowUserProfile(row._id)}
                    key={index}
                    sx={{
                      backgroundColor: '#eeebf5',
                      '&:hover': { backgroundColor: '#dcd8e3' },
                    }}
                  > 
                 
                  <TableCell><div className='flex space-x-2  '> <img className='w-6 h-6 mr-2 rounded-full ' src={`http://localhost:8080/uploads/${row.profilepic}`} />{row.username}</div></TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalUsers}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}