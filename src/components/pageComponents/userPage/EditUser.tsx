import React, { useState } from 'react';
import { Button, Input, Alert } from 'reactstrap';
import { api } from '../../Auth/apiService';
 // Use your centralized API service

export const EditUser: React.FC<{ user: any }> = ({ user }) => {
    const [userType, setUserType] = useState<string>(user.user_type);
    const [message, setMessage] = useState<string>(''); // Success message
    const [error, setError] = useState<string>(''); // Error message

    // Function to handle role update
    const handleUpdateRole = async () => {
        try {
            // Call API to update the user role
            await api.users.updateUserRole(user.id, { user_type: userType });

            // Display success message and hide after 3 seconds
            setMessage('User role updated successfully!');
            setError(''); // Clear error message
            setTimeout(() => setMessage(''), 3000); // Hide success message after 3 seconds
        } catch (err) {
            setMessage(''); // Clear success message
            setError('Error updating user role. Please try again.');
        }
    };

    return (
        <div>
            {/* User role selection */}
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

            {/* Button to trigger role update */}
            <Button color="primary btn-sm mt-2" onClick={handleUpdateRole}>
                Update Role
            </Button>

            {/* Display success or error message */}
            {message && <Alert color="success" className="mt-2">{message}</Alert>}
            {error && <Alert color="danger" className="mt-2">{error}</Alert>}
        </div>
    );
};
