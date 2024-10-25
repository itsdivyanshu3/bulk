import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Spinner, Alert, Container } from 'reactstrap';
import { api } from '../../Auth/apiService';

export const AddUser: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userType, setUserType] = useState<string>('customer');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to handle form submission
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    setMessage('');

    const formData = { name, email, password, user_type: userType };

    // Simple client-side validation
    if (!name || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      await api.users.createUser(formData);
      setMessage('User created successfully!');
      resetForm(); 
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error creating user. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  // Function to reset form fields after successful submission
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setUserType('customer');
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Add New User</h3>

      {/* Form to Add New User */}
      <Form onSubmit={handleCreateUser}>
        <FormGroup>
          <Label for="name">Name:</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter user's name"
          />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter user's email"
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Password:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
          />
        </FormGroup>

        <FormGroup>
          <Label for="userType">User Type:</Label>
          <Input
            type="select"
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
            <option value="admin">Admin</option>
          </Input>
        </FormGroup>

        <Button type="submit" color="primary" block disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Create User'}
        </Button>
      </Form>

      {/* Display success or error message */}
      {message && <Alert color="success" className="mt-4">{message}</Alert>}
      {error && <Alert color="danger" className="mt-4">{error}</Alert>}
    </Container>
  );
};
