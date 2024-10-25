import React, { useState, useEffect } from 'react';
import { Button, Input, Form, FormGroup, Label, Container, Card, CardBody, CardTitle, CardText, Row, Col, Spinner, Alert } from 'reactstrap';
import * as XLSX from 'xlsx';  // Import the xlsx library
import { ProductsDownload } from '../pageComponents/productManager/ProductsDownload';
import { api } from '../Auth/apiService'; // Importing from your custom API service

export const ProductManager: React.FC = () => {
    const [productsList, setProductsList] = useState<any[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: 0 });
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [excelFile, setExcelFile] = useState<File | null>(null);  // State to handle the uploaded Excel file

    // Fetch all products and user role on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const userResponse = await api.auth.getUser(); // Get user role via API (token handled via interceptor)
                setUserRole(userResponse.data.user_type);

                if (userResponse.data.user_type === 'admin') {
                    const response = await api.products.all(); // Use `api.products.all` to fetch products
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
        return <Spinner color="primary" />;
    }

    // Add new product using `api.products.addProduct`
    const addNewProduct = async () => {
        try {
            const response = await api.products.addProduct(newProduct);
            setProductsList([...productsList, response.data.product]);
            setNewProduct({ name: '', price: 0 });
            setEditingProduct(null); // Reset edit state after add
            alert('Product added successfully!');
        } catch (err) {
            console.error('Error adding product:', err);
            setError('Error adding product. Please try again.');
        }
    };

    // Handle editing a product
    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        setNewProduct({ name: product.name, price: product.price });
    };

    // Update product using `api.products.updateProduct`
    const updateProduct = async () => {
        try {
            const response = await api.products.updateProduct(editingProduct.id, newProduct);
            const updatedProductsList = productsList.map(product =>
                product.id === editingProduct.id ? response.data.product : product
            );
            setProductsList(updatedProductsList);
            setEditingProduct(null);
            setNewProduct({ name: '', price: 0 }); // Reset form after edit
            alert('Product updated successfully!');
        } catch (err) {
            console.error('Error updating product:', err);
            setError('Error updating product. Please try again.');
        }
    };

    // Delete product using `api.products.deleteProduct`
    const deleteProduct = async (productId: any) => {
        try {
            await api.products.deleteProduct(productId);
            setProductsList(productsList.filter(product => product.id !== productId));
            alert('Product deleted successfully!');
        } catch (err) {
            console.error('Error deleting product:', err);
            setError('Error deleting product. Please try again.');
        }
    };

    // Delete all products using `api.products.deleteAllProducts`
    const deleteAllProducts = async () => {
        try {
            await api.products.deleteAllProducts();
            setProductsList([]);
            alert('All products deleted and auto-increment reset successfully!');
        } catch (err) {
            console.error('Error deleting all products:', err);
            setError('Error deleting all products. Please try again.');
        }
    };

    // Handle Excel file upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel")) {
            setExcelFile(file);
        } else {
            alert('Please upload a valid Excel file.');
            setExcelFile(null);
        }
    };

    // Upload products via Excel using `api.products.bulkUpload`
    const handleUploadExcel = async () => {
        if (!excelFile) {
            alert('Please upload an Excel file.');
            return;
        }

        try {
            const data = await excelFile.arrayBuffer();
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Check for empty rows or invalid data
            const productsToAdd = jsonData.slice(1).map((row: any) => {
                if (!row[0] || !row[1]) {
                    throw new Error('Invalid row format. Ensure that both "Name" and "Price" are present.');
                }
                return {
                    name: row[0],
                    price: parseFloat(row[1])
                };
            });

            const response = await api.products.bulkUpload({ products: productsToAdd });
            setProductsList([...productsList, ...response.data.products]);
            alert('Products added successfully!');
        } catch (err) {
            console.error('Error uploading Excel file:', err);
            setError('Error uploading Excel file.');
        }
    };

    return (
        <Container className="mt-5">
            {error && <Alert color="danger">{error}</Alert>} {/* Show error alert if there's an error */}
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

                    {/* Excel Upload Section */}
                    <Card className="mt-4">
                        <CardBody>
                            <CardTitle tag="h5">Upload Products via Excel</CardTitle>
                            <FormGroup>
                            <Label for="fileUpload">Select Excel File</Label>
                                <Input type="file" id="fileUpload" accept=".xlsx, .xls" onChange={handleFileUpload} />
                            </FormGroup>
                            <Button color="success" onClick={handleUploadExcel}>
                                Upload Products
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Delete All Products Button */}
                    <Card className="mt-4">
                        <CardBody>
                            <Button color="danger" block onClick={deleteAllProducts}>
                                Delete All Products
                            </Button>
                        </CardBody>
                    </Card>

                    <Card className="mt-4">
                        <CardBody>
                            <ProductsDownload />
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
                                <Col md="6" lg="4" key={product.id}>
                                    <Card className="mb-3">
                                        <CardBody>
                                            <CardTitle tag="h5">{product.name}</CardTitle>
                                            <CardText>Price: ₹{product.price}</CardText>
                                            <Button
                                                color="warning"
                                                style={{ marginRight: '10px' }}
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
