import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Alert } from 'reactstrap';

export const EditUser: React.FC<{ user: any }> = ({ user }) => {
    const [userType, setUserType] = useState<string>(user.user_type);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>(''); // For handling error messages

    const handleUpdateRole = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `http://127.0.0.1:8000/api/users/${user.id}/role`,
                {
                    user_type: userType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage('User role updated successfully!');
            setError(''); // Clear error if update is successful
            setTimeout(() => setMessage(''), 3000); // Hide message after 3 seconds
        } catch (error) {
            setMessage(''); // Clear success message
            setError('Error updating user role. Please try again.');
        }
    };

    return (
        <div className="">
            <Input
                type="select"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2"
            >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
            </Input>
            <Button color="primary btn-sm mt-2 " onClick={handleUpdateRole}>
                Update Role
            </Button>

            {/* Display success or error message */}
            {message && <Alert color="success" className="ml-2">{message}</Alert>}
            {error && <Alert color="danger" className="ml-2">{error}</Alert>}
        </div>
    );
};
