// Permissions.tsx
import React from 'react';

interface PermissionsProps {
  roles: string[];  // Array of allowed roles
  children: React.ReactNode;
}

export const Permissions: React.FC<PermissionsProps> = ({ roles, children }) => {
    const userRole = localStorage.getItem('userRole');  // Fetch the role from localStorage
    // If user's role is in the allowed roles array, render the content
    if (roles.includes(userRole || '')) {
      return <>{children}</>;
    }
  
    // Display "Access Denied" for unauthorized users (for now, for debugging)
    return <p></p>;  
  };
  
  