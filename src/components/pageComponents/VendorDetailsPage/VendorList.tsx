import React from 'react';
import { Table, Button, Container } from 'reactstrap';

interface VendorListProps {
  vendors: any[];
  onView: (vendorId: number) => void;
  onDelete: (vendorId: number) => void;  // New prop for delete action
}

export const VendorList: React.FC<VendorListProps> = ({ vendors, onView, onDelete }) => {
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
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td>{vendor.vendor_name}</td>
              <td>{vendor.shop_name}</td>
              <td>
                {vendor.items.reduce(
                  (total: number, item: any) => total + item.quantity,
                  0
                )}
              </td>
              <td>
                <Button
                  color="primary"
                  style={{marginRight:'10px'}}
                  onClick={() => onView(vendor.id)}
                >
                  View
                </Button>
                <Button
                  color="danger"
                  onClick={() => onDelete(vendor.id)}  // Call the delete handler
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
