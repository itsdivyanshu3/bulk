import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner } from 'reactstrap';
import { VendorList } from '../pageComponents/VendorDetailsPage/VendorList';
import { VendorDetails } from '../pageComponents/VendorDetailsPage/VendorDetails';
import { api } from '../Auth/apiService';  // Use centralized API service

export const VendorDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]); // List of vendors/invoices
  const [selectedVendor, setSelectedVendor] = useState<any>(null); // Vendor currently being viewed
  const [error, setError] = useState<string | null>(null); // Error message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Fetch vendors (invoices) from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true); // Start loading
      try {
        const response = await api.invoices.all(); // Use the API service for fetching invoices
        setVendors(response.data); // Set the fetched vendor list
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setError('Error fetching vendor data');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchVendors(); // Trigger fetching vendors
  }, []);

  // Handle view button click to fetch vendor details
  const handleView = async (vendorId: number) => {
    try {
      const response = await api.invoices.getById(vendorId); // Fetch vendor details using API service
      setSelectedVendor(response.data); // Set selected vendor details for viewing
      setError(null); // Clear any previous errors
    } catch (error) {
      setError('Error fetching vendor details');
    }
  };

  // Handle delete button click to remove a vendor
  const handleDelete = async (vendorId: number) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return; // If the user cancels delete action
    }

    try {
      await api.invoices.deleteInvoice(vendorId); // Delete vendor using API service
      setVendors(vendors.filter((vendor) => vendor.id !== vendorId)); // Update vendor list after deletion
      setSuccessMessage('Vendor deleted successfully'); // Show success message
      setError(null); // Clear any error message
    } catch (error) {
      setError('Error deleting vendor');
    }
  };

  // Close the vendor details view
  const handleClose = () => {
    setSelectedVendor(null);
  };

  // Function to clear success and error messages after 3 seconds
  const clearMessages = () => {
    if (successMessage || error) {
      const timeout = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
      return () => clearTimeout(timeout); // Cleanup the timeout
    }
  };

  // Call the clearMessages function whenever successMessage or error changes
  useEffect(clearMessages, [successMessage, error]);

  return (
    <Container>
      {/* Display error message if any */}
      {error && <Alert color="danger">{error}</Alert>}

      {/* Display success message if any */}
      {successMessage && <Alert color="success">{successMessage}</Alert>}

      {/* Loading spinner while fetching vendors */}
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner color="primary" />
        </div>
      ) : !selectedVendor ? (
        <VendorList vendors={vendors} onView={handleView} onDelete={handleDelete} />
      ) : (
        <VendorDetails vendor={selectedVendor} onClose={handleClose} />
      )}
    </Container>
  );
};
