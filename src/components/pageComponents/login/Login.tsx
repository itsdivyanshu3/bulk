import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../Auth/apiService';


export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Email input state
  const [password, setPassword] = useState<string>(''); // Password input state
  const [message, setMessage] = useState<string>(''); // Success/error message state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate(); // Navigation after login

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading spinner
    setMessage(''); // Clear previous messages

    try {
      // Call the API service for login
      const response = await api.auth.login({
        email,
        password,
      });

      const { token, user } = response.data;
      // Store the token and user role (user_type) in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.user_type);

      setLoading(false); // Stop loading spinner
      navigate('/'); // Redirect after successful login
    } catch (error: any) {
      setLoading(false); // Stop loading spinner in case of error
      // Handle errors based on response status
      if (error.response && error.response.status === 401) {
        setMessage('Invalid login credentials. Please try again.');
      } else {
        setMessage('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}  {/* Change button text based on loading */}
          </button>
        </form>

        {/* Display loading spinner if login is in progress */}
        {loading && <div className="spinner"></div>}

        {/* Display success or error message */}
        {message && <p className="error-message">{message}</p>}

        <p>New user? <Link to="/register" className="register-link">Register here</Link></p>
      </div>
    </div>
  );
};
