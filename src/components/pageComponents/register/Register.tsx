import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<any>(null); // For storing form validation errors
  const navigate = useNavigate();  // For navigating after registration

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors(null);  // Clear any previous errors

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after success
    } catch (error: any) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Set validation errors
      } else {
        setMessage('Error registering user. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors?.name && <p className="error-text">{errors.name[0]}</p>}  {/* Show name error */}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors?.email && <p className="error-text">{errors.email[0]}</p>}  {/* Show email error */}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors?.password && <p className="error-text">{errors.password[0]}</p>}  {/* Show password error */}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            {errors?.password_confirmation && <p className="error-text">{errors.password_confirmation[0]}</p>}  {/* Show password confirmation error */}
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>

        {/* General success or error message */}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
};
