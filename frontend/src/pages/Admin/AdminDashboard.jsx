import React from 'react'
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AdminDashboard = () => {

    const { token, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/adminlogin");
    };
    return (
        <div>
        <div>AdminDashboard</div>
        <button onClick={handleLogout} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-md">Logout</button>
        </div>
    )
}

export default AdminDashboard