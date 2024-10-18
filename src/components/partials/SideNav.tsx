import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Permissions } from './Permissions';


export const SideNav: React.FC = () => {
  const navigate = useNavigate();

  // Logout function to clear authToken and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Clear the token from localStorage
    navigate('/login');  // Redirect to the login page
  };

  return (
    <div className="sidebar-container">
      <nav className="sidebar">
        <h2 className="sidebar-title">Source of Korea</h2>
        <ul>
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/vendorForm">Vendors Form</Link>
          </li>
          <Permissions roles={['admin']}>
            <li>
              <Link to="/productManager">Product Manager</Link>
            </li>
          </Permissions>
          <Permissions roles={['admin']}>
            <li>
              <Link to="/vendorDetails">Vendor Manager</Link>
            </li>
          </Permissions>
          <Permissions roles={['admin']}>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </Permissions>
          <li>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </li>
        </ul>
      </nav>

      <div className="content">
        {/* This is where child routes will render */}
        <Outlet />
      </div>
    </div>
  );
}; 