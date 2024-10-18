import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { EditUser } from '../pageComponents/userPage/EditUser';
import { AddUser } from '../pageComponents/userPage/AddUser';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Spinner,
  Alert,
} from 'reactstrap';

export const User: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to toggle the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Container className="mt-5">
      <Row className="align-items-center mb-3">
        <Col md="6">
          <h2>Registered Users</h2>
        </Col>
        <Col md="6" className="text-md-end">
          <Button color="primary" onClick={toggleModal}>
            Add User
          </Button>
        </Col>
      </Row>

      {loading && <Spinner color="primary" />} {/* Loading spinner */}
      {error && <Alert color="danger">{error}</Alert>}

      <ListGroup className="user-list">
        {users.map((user) => (
          <ListGroupItem key={user.id} className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{user.name}</strong> ({user.email}) - {user.user_type}
            </div>
            <EditUser user={user} />
          </ListGroupItem>
        ))}
      </ListGroup>

      {/* Modal for adding a user */}
      <Modal isOpen={isModalOpen} toggle={toggleModal} className="half-screen-modal">
        <ModalHeader toggle={toggleModal}>Add New User</ModalHeader>
        <ModalBody>
          <AddUser />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};
