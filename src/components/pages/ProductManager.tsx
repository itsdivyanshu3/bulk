import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Form, FormGroup, Label, Container, Card, CardBody, CardTitle, CardText, Row, Col, Spinner, Alert } from 'reactstrap';

export const ProductManager: React.FC = () => {
    const [productsList, setProductsList] = useState<any[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0 });
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const userResponse = await axios.get('http://127.0.0.1:8000/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUserRole(userResponse.data.user_type);

                if (userResponse.data.user_type === 'admin') {
                    const response = await axios.get('http://127.0.0.1:8000/api/products');
                    setProductsList(response.data);
                }
            } catch (err) {
                setError('Error fetching products or user role.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <Spinner color="primary" />;  // Show a spinner while loading
    }

    if (userRole !== 'admin') {
        return <Alert color="danger">You do not have permission to view this page.</Alert>;
    }

    const addNewProduct = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/products', newProduct);
            const newProductObject = response.data.product;
            setProductsList([...productsList, newProductObject]);
            setNewProduct({ name: '', price: 0 });
            alert('Product added successfully!');
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Error adding product. Please try again.');
        }
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setNewProduct({ name: product.name, price: product.price });
    };

    const updateProduct = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/products/${editingProduct.id}`, newProduct);
            const updatedProduct = response.data.product;
            const updatedProductsList = productsList.map(product =>
                product.id === editingProduct.id ? updatedProduct : product
            );
            setProductsList(updatedProductsList);
            setEditingProduct(null);
            setNewProduct({ name: '', price: 0 });
            alert('Product updated successfully!');
        } catch (err) {
            console.error('Error updating product:', err);
            alert('Error updating product. Please try again.');
        }
    };

    const deleteProduct = async (productId: any) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`);
            const updatedProductsList = productsList.filter(product => product.id !== productId);
            setProductsList(updatedProductsList);
            alert('Product deleted successfully!');
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Error deleting product. Please try again.');
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md="6">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h3" className="text-center">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </CardTitle>
                            <Form>
                                <FormGroup>
                                    <Label for="productName">Product Name</Label>
                                    <Input
                                        type="text"
                                        id="productName"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="productPrice">Product Price</Label>
                                    <Input
                                        type="number"
                                        id="productPrice"
                                        min="0"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                        required
                                    />
                                </FormGroup>
                                <Button
                                    color="primary"
                                    block
                                    onClick={editingProduct ? updateProduct : addNewProduct}
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col md="6">
                    <h3 className="text-center mb-4">Existing Products</h3>
                    {productsList.length === 0 ? (
                        <Alert color="info">No products available.</Alert>
                    ) : (
                        <Row>
                            {productsList.map((product) => (
                                <Col md="12" key={product.id}>
                                    <Card className="mb-3">
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name}</CardTitle>
                                            <CardText>Price: ₹{product.price}</CardText>
                                            <Button
                                                color="warning"
                                                style={{marginRight:'10px'}}
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="danger"
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                Delete
                                            </Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};
