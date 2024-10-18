import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


export const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);  // Loading state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);  // Start loading spinner

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      console.log('Login response:', response);  // Verify login response

      // Store the token and user role (user_type) in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.user_type);  // Store user role

      setLoading(false);  // Stop loading spinner
      navigate('/');  // Redirect after successful login
    } catch (error: any) {
      setLoading(false);  // Stop loading spinner in case of error
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

        {loading && <div className="spinner"></div>}  {/* Show spinner while loading */}

        {message && <p className="error-message">{message}</p>}

        <p>New user? <Link to="/register" className="register-link">Register here</Link></p>
      </div>
    </div>
  );
};
