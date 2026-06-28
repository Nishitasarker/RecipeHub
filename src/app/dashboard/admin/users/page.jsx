"use client"

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authClient } from "@/lib/auth-client";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  
  const fetchUsers = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/users?email=${email}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("Error fetching users!");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser?.email) {
      fetchUsers(loggedInUser.email);
    } else {
      setLoading(false);
    }
  }, [loggedInUser?.email]);

  
  const handleToggleBlock = async (userId, isBlocked) => {
    const action = isBlocked ? 'unblock' : 'block';

    const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);

    if (confirmAction) {
      try {
        const res = await fetch(`https://recipehub-server-side.vercel.app/api/admin/users/${action}/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loggedInUser.email })
        });
        const data = await res.json();

        if (data.success) {
          toast.success(`User has been successfully ${action}ed!`);
          fetchUsers(loggedInUser.email);
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (error) {
        toast.error("Failed to update user status");
      }
    }
  };

  if (!loggedInUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-neutral-500 font-medium">Please log in to manage users.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-2xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <p className="text-sm text-gray-500">Review all registered cooking enthusiasts, monitor membership statuses, or restrict platform access.</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">User Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Membership</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/70 transition-colors">

                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                  <img
                    src={user.image || "https://i.ibb.co/kV7t2BF/avatar.jpg"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <span className="font-semibold text-gray-800">{user.name}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isPremium ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-orange-800 bg-orange-100 rounded-full border border-orange-200 shadow-sm">
                      👑 Premium Member
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                      Free Member
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isBlocked ? (
                    <span className="inline-flex px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 rounded-md border border-red-200">
                      Blocked
                    </span>
                  ) : (
                    <span className="inline-flex px-2.5 py-1 text-xs font-bold text-green-700 bg-green-50 rounded-md border border-green-200">
                      Active
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide shadow-sm transition-all duration-200 ${
                      user.isBlocked
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100'
                        : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-100'
                    }`}
                  >
                    {user.isBlocked ? 'Unblock User' : 'Block User'}
                  </button>
                </td>

              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-400 font-medium">
                  No users registered under this criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;