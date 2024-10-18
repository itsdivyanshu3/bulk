import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  ListGroup,
  ListGroupItem,
  Button,
  Container,
} from 'reactstrap';

interface VendorDetailsProps {
  vendor: any;
  onClose: () => void;
}

export const VendorDetails: React.FC<VendorDetailsProps> = ({ vendor, onClose }) => {
  return (
    <Container className="mt-5">
      <Card>
        <CardBody>
          <CardTitle tag="h2" className="text-center mb-4">
            Vendor Details
          </CardTitle>

          <CardText>
            <strong>Vendor Name:</strong> {vendor.vendor_name}
          </CardText>
          <CardText>
            <strong>Shop Name:</strong> {vendor.shop_name}
          </CardText>
          <CardText>
            <strong>Shop Address:</strong> {vendor.shop_address}
          </CardText>
          <CardText>
            <strong>Billing Address:</strong> {vendor.billing_address}
          </CardText>
          <CardText>
            <strong>Purpose:</strong> {vendor.purpose}
          </CardText>

          <h3 className="mt-4">Products</h3>
          <ListGroup className="mb-4">
            {vendor.items.map((item: any, index: number) => (
              <ListGroupItem key={index}>
                <strong>{item.product.name}</strong> - Quantity: {item.quantity} - Total: ₹{item.total_price}
              </ListGroupItem>
            ))}
          </ListGroup>

          <CardText>
            <strong>Total Price:</strong> ₹{vendor.total_price}
          </CardText>

          <div className="text-center">
            <Button color="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};
