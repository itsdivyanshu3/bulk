import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';  // Import xlsx library
import { saveAs } from 'file-saver';  // Import file-saver library
import { Button, Spinner, Alert, Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { api } from '../../Auth/apiService';

export const ProductsDownload: React.FC = () => {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products on component load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.products.all(); // Use `api.products.all` to fetch products
        setProductsList(Array.isArray(response.data) ? response.data : []);  // Ensure response is an array
      } catch (err) {
        setError('Error fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productsList); // Convert product list to sheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products'); // Append sheet to workbook

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'products.xlsx');
  };

  if (loading) {
    return <Spinner color="primary" />;
  }

  if (error) {
    return <Alert color="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-5">
      <Row>
        <Col md="12">
          <Button color="primary" onClick={downloadExcel}>Download Products as Excel</Button>
        </Col>
      </Row>

      <Row className="mt-4">
        {productsList.length === 0 ? (
          <Alert color="info">No products available.</Alert>
        ) : (
          productsList.map((product) => (
            <Col md="6"  lg="4" key={product.id}>
              <Card className="mb-3">
                <CardBody>
                  <CardTitle tag="h5">{product.name}</CardTitle>
                  <CardText>Price: ₹{product.price}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

