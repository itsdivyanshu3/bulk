import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from 'reactstrap';

export const VendorsForm: React.FC = () => {
  const [vendorName, setVendorName] = useState('');
  const [shopName, setShopName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]); // Products with quantity
  const [totalPrice, setTotalPrice] = useState(0);
  const [productsList, setProductsList] = useState<any[]>([]); // Products from the backend
  const [newProduct, setNewProduct] = useState({ name: '', price: 0 }); // State to hold new product details
  const [editingProduct, setEditingProduct] = useState<any>(null); // State to hold the product being edited
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products'); // Replace with your actual backend API
        setProductsList(response.data);
      } catch (err) {
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
        updatedProducts[index].productId = selectedProduct.id;
        updatedProducts[index].name = selectedProduct.name;
        updatedProducts[index].price = selectedProduct.price;
      }
    } else {
      updatedProducts[index][field] = value;
    }

    updatedProducts[index].total =
      (updatedProducts[index].price || 0) * (updatedProducts[index].quantity || 1);
    setSelectedProducts(updatedProducts);
    calculateTotalPrice(updatedProducts);
  };

  // Calculate total price
  const calculateTotalPrice = (products: any[]) => {
    const total = products.reduce((sum, product) => sum + (product.total || 0), 0);
    setTotalPrice(total);
  };

  // Add a new product row
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

  // Handle form submission and send to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      vendorName,
      shopName,
      purpose,
      shopAddress,
      billingAddress,
      products: selectedProducts,
      totalPrice,
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/invoice', formData); // Replace with your actual backend API
      alert('Invoice submitted successfully!');
    } catch (err) {
      console.error('Error submitting invoice:', err);
      alert('Error submitting invoice. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <CardBody>
          <CardTitle tag="h2" className="text-center mb-4">Vendor Form</CardTitle>
          <Form onSubmit={handleSubmit}>
            {/* Vendor Details */}
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
                  <Label>Shop Name</Label>
                  <Input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
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
              <Col md="6">
                <FormGroup>
                  <Label>Shop Address</Label>
                  <Input
                    type="text"
                    value={shopAddress}
                    onChange={(e) => setShopAddress(e.target.value)}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Billing Address</Label>
              <Input
                type="text"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                required
              />
            </FormGroup>

            {/* Product Selection */}
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
                  <Button
                    color="danger"
                    onClick={() => removeProductRow(index)}
                  >
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

            {/* Total Price Calculation */}
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
