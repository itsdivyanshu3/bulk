import React from 'react';
import { Table, Button, Container } from 'reactstrap';

interface VendorItem {
  id: number;
  vendor_name: string;
  shop_name: string;
  items: { quantity: number }[]; // Define a type for items
}

interface VendorListProps {
  vendors: VendorItem[];
  onView: (vendorId: number) => void;
  onDelete: (vendorId: number) => void;
}

export const VendorList: React.FC<VendorListProps> = ({ vendors = [], onView, onDelete }) => {
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Vendors List</h2>
      <Table striped hover bordered>
        <thead className="thead-dark">
          <tr>
            <th>Vendor Name</th>
            <th>Shop Name</th>
            <th>Total Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(vendors) && vendors.length > 0 ? (
            vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.vendor_name}</td>
                <td>{vendor.shop_name}</td>
                <td>
                  {vendor.items.reduce((total, item) => total + item.quantity, 0)}
                </td>
                <td>
                  <Button
                    color="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => onView(vendor.id)}
                  >
                    View
                  </Button>
                  <Button color="danger" onClick={() => onDelete(vendor.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center">No vendors available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};
