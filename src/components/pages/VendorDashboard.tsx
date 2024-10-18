import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Alert } from 'reactstrap';
import { VendorList } from '../pageComponents/VendorDetailsPage/VendorList';
import { VendorDetails } from '../pageComponents/VendorDetailsPage/VendorDetails';

export const VendorDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch vendors from backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/invoices'); // Replace with your actual API
        setVendors(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setError('Error fetching vendor data');
      }
    };

    fetchVendors();
  }, []);

  // Handle view button click
  const handleView = async (vendorId: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/invoices/${vendorId}`);
      setSelectedVendor(response.data);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      setError('Error fetching vendor details');
    }
  };

  // Handle delete button click
  const handleDelete = async (vendorId: number) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return; // If user cancels delete action
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/invoices/${vendorId}`); // Delete vendor API call
      setVendors(vendors.filter((vendor) => vendor.id !== vendorId));  // Update the list of vendors
      setSuccessMessage('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      setError('Error deleting vendor');
    }
  };

  // Close the details view
  const handleClose = () => {
    setSelectedVendor(null);
  };

  return (
    <Container>
      {error && <Alert color="danger">{error}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      {!selectedVendor ? (
        <VendorList vendors={vendors} onView={handleView} onDelete={handleDelete} />
      ) : (
        <VendorDetails vendor={selectedVendor} onClose={handleClose} />
      )}
    </Container>
  );
};
