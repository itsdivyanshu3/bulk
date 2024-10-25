import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Auth/apiService';
 // Use the centralized API service

export const Register: React.FC = () => {
  const [name, setName] = useState<string>(''); // Name input
  const [email, setEmail] = useState<string>(''); // Email input
  const [password, setPassword] = useState<string>(''); // Password input
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>(''); // Confirm password
  const [message, setMessage] = useState<string>(''); // Success or error message
  const [errors, setErrors] = useState<any>(null); // Form validation errors
  const navigate = useNavigate(); // For navigation after successful registration

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null); // Clear any previous errors
    setMessage(''); // Clear previous messages

    try {
      // Call the API service to register the user
      await api.auth.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      // Display success message and redirect to login page
      setMessage('Registration successful! Redirecting to login...');
      resetForm(); // Reset form fields after successful registration
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (error: any) {
      // Set validation errors from the API response
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setMessage('Error registering user. Please try again.');
      }
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
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
            {errors?.name && <p className="error-text">{errors.name[0]}</p>} {/* Display name error */}
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors?.email && <p className="error-text">{errors.email[0]}</p>} {/* Display email error */}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors?.password && <p className="error-text">{errors.password[0]}</p>} {/* Display password error */}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            {errors?.password_confirmation && <p className="error-text">{errors.password_confirmation[0]}</p>} {/* Display password confirmation error */}
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>

        {/* Display general success or error message */}
        {message && <p className={message.includes('successful') ? 'success-message' : 'error-message'}>{message}</p>}
      </div>
    </div>
  );
};
