import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingMain } from '../pages/LandingMain';
import { VendorsForm } from '../pages/VendorsForm';
import { SideNav } from '../partials/SideNav';
import { Login } from '../pageComponents/login/Login';
import { PrivateRoute } from './PrivateRoute';
import { Register } from '../pageComponents/register/Register';  // Register if needed
import { User } from '../pages/User';
import { ProductManager } from '../pages/ProductManager';
import { VendorDashboard } from '../pages/VendorDashboard';


export const DefaultLayout: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* Optional */}

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<SideNav />}>
            <Route index element={<LandingMain />} />
            <Route path="/vendorForm" element={<VendorsForm />} />
            <Route path="/users" element={<User />} />
            <Route path="/productManager" element={<ProductManager />} />
            <Route path="/vendorDetails" element={<VendorDashboard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};
