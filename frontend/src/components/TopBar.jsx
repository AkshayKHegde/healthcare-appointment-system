import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../api/AuthContext.jsx';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="topbar">
      <div className="brand">
        <span className="mark">M+</span>
        MediSchedule
      </div>
      <div className="topbar-user">
        <span className="pill">{user.role}</span>
        <span>{user.username}</span>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}
