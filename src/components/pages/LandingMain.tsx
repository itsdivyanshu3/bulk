import React, { useEffect, useState } from 'react';

export const LandingMain: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch the user role from localStorage on component mount
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);  // Set the user role from localStorage
  }, []);

  return (
    <div>
      {userRole ? (
        <h2>Welcome {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</h2> 
      ) : (
        <h2>Welcome</h2>  // Default welcome message if role is not found
      )}
    </div>
  );
};
