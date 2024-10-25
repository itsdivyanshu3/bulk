import React, { useState, useEffect, useRef } from 'react';
import { Container, Alert, Spinner } from 'reactstrap';
import { VendorList } from '../pageComponents/VendorDetailsPage/VendorList';
import { VendorDetails } from '../pageComponents/VendorDetailsPage/VendorDetails';
import { api } from '../Auth/apiService'; // Use centralized API service

interface Vendor {
  id: number;
  vendor_name: string;
  shop_name: string;
  items: { quantity: number }[]; // Define a type for vendor items
}

export const VendorDashboard: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]); // List of vendors
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null); // Vendor currently being viewed
  const [error, setError] = useState<string | null>(null); // Error message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch vendors (invoices) from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await api.invoices.all();
        setVendors(response.data || []); // Set the fetched vendor list or empty array
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        setError('Error fetching vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Handle view button click to fetch vendor details
  const handleView = async (vendorId: number) => {
    try {
      const response = await api.invoices.getById(vendorId);
      setSelectedVendor(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vendor details:', err);
      setError('Error fetching vendor details');
    }
  };

  // Handle delete button click to remove a vendor
  const handleDelete = async (vendorId: number) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      await api.invoices.deleteInvoice(vendorId);
      setVendors((prevVendors) => prevVendors.filter((vendor) => vendor.id !== vendorId));
      setSuccessMessage('Vendor deleted successfully');
      setError(null);
    } catch (err) {
      console.error('Error deleting vendor:', err);
      setError('Error deleting vendor');
    }
  };

  // Close the vendor details view
  const handleClose = () => {
    setSelectedVendor(null);
  };

  // Function to clear success and error messages after 3 seconds
  const clearMessages = () => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    if (successMessage || error) {
      messageTimeoutRef.current = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 3000);
    }
  };

  // Clear messages whenever successMessage or error changes
  useEffect(clearMessages, [successMessage, error]);

  return (
    <Container>
      {error && <Alert color="danger">{error}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}

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
