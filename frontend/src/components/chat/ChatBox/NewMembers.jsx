

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DefaultUser from '../../../assets/DefaultUser.png';

export default function NewMembers({ chatId, onClose }) {

  const token = sessionStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8080/api/chat/users', {
          headers: { 'x-auth-token': token },
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSelect = (user) => {
    if (!selected.includes(user._id)) {
      setSelected([...selected, user._id]);
    } else {
      setSelected(selected.filter(id => id !== user._id));
    }
  };

  const handleAddMembers = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/chat/add-members/${chatId}`,
        { membersIds: selected },
        { headers: { 'x-auth-token': token } }
      );
 
     // onClose();
    } catch (err) {
      console.error('Failed to add members', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/25 bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-5 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Add Members</h2>

        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-3 py-2 border rounded mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-64 overflow-y-auto space-y-2">
          {users
            .map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleSelect(user)}
              >
                <img
                  src={user.profilepic ? `http://localhost:8080/uploads/${user.profilepic}` : DefaultUser}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="flex-1">{user.username}</span>
                <input
                  type="checkbox"
                  checked={selected.includes(user._id)}
                  onChange={() => handleSelect(user)}
                />
              </div>
            ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {users
            .filter((u) => selected.includes(u._id))
            .map((user) => (
              <span
                key={user._id}
                className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
              >
                {user.username}
              </span>
            ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleAddMembers}
            disabled={selected.length === 0}
          >
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
}
