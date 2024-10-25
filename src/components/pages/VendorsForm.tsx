import React, { useState, useEffect } from 'react';
import { api } from '../Auth/apiService';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from 'reactstrap';

export const VendorsForm: React.FC = () => {
  // Vendor and product details state
  const [vendorName, setVendorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shopName, setShopName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.products.all();
        setProductsList(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Error fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product selection and quantity update
  const handleProductChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...selectedProducts];
    if (field === 'productId') {
      const selectedProduct = productsList.find(
        (product) => product.id === parseInt(value)
      );
      if (selectedProduct) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: updatedProducts[index].quantity || 1,
          total: selectedProduct.price * (updatedProducts[index].quantity || 1),
        };
      }
    } else {
      updatedProducts[index][field] = value;
      updatedProducts[index].total = updatedProducts[index].price * (updatedProducts[index].quantity || 1);
    }

    setSelectedProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
  };

  // Calculate total price of selected products
  const calculateTotalPrice = (products: any[]) => {
    const total = products.reduce((sum, product) => sum + (product.total || 0), 0);
    setTotalPrice(total);
  };

  // Add a new product row for selection
  const addProductRow = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productId: '', quantity: 1, price: 0, total: 0 },
    ]);
  };

  // Remove a product row
  const removeProductRow = (index: number) => {
    const updatedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
  };

  // Handle form submission and send data to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    const formData = {
      vendorName,
      phone_number: phoneNumber,
      shopName,
      purpose,
      shopAddress,
      billingAddress,
      products: selectedProducts,
      totalPrice,
    };

    try {
      await api.invoices.create(formData);
      alert('Invoice submitted successfully!');
      resetForm();
    } catch (err) {
      console.error("Error submitting invoice:", err);
      setError('Error submitting invoice. Please try again.');
    }
  };

  // Reset form fields after submission
  const resetForm = () => {
    setVendorName('');
    setPhoneNumber('');
    setShopName('');
    setPurpose('');
    setShopAddress('');
    setBillingAddress('');
    setSelectedProducts([]);
    setTotalPrice(0);
  };

  if (loading) {
    return <Spinner color="primary" />;
  }

  return (
    <Container className="mt-5">
      <Card>
        <CardBody>
          <CardTitle tag="h2" className="text-center mb-4">Vendor Form</CardTitle>

          {error && <Alert color="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Vendor Name</Label>
                  <Input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    pattern="[0-9]{10}"
                    placeholder="Enter 10-digit phone number"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <FormGroup>
                  <Label>Shop Name</Label>
                  <Input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label>Purpose</Label>
                  <Input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Shop Address</Label>
              <Input
                type="text"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Billing Address</Label>
              <Input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                required
              />
            </FormGroup>

            <h3>Select Products</h3>
            {selectedProducts.map((product, index) => (
              <Row key={index} className="mb-3">
                <Col md="5">
                  <Input
                    type="select"
                    value={product.productId}
                    onChange={(e) =>
                      handleProductChange(index, 'productId', e.target.value)
                    }
                    required
                  >
                    <option value="">Select Product</option>
                    {productsList.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (₹{product.price})
                      </option>
                    ))}
                  </Input>
                </Col>

                <Col md="3">
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(index, 'quantity', parseInt(e.target.value))
                    }
                    required
                  />
                </Col>

                <Col md="2">
                  <Button color="danger" onClick={() => removeProductRow(index)}>
                    Remove
                  </Button>
                </Col>

                <Col md="2">
                  <div className="mt-2">Total: ₹{product.total || 0}</div>
                </Col>
              </Row>
            ))}

            <Button color="success" type="button" onClick={addProductRow} className="mb-4">
              Add Product
            </Button>

            <div className="total-price-section">
              <h4>Total Price: ₹{totalPrice}</h4>
            </div>

            <Button color="primary" type="submit" block>
              Generate Invoice
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};
