import React, { useState, useEffect } from 'react';
import { EditUser } from '../pageComponents/userPage/EditUser';
import { AddUser } from '../pageComponents/userPage/AddUser';
import { api } from '../Auth/apiService';
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.users.index(); // Fetch users using the API service
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

      {/* Loading and error handling */}
      {loading && <Spinner color="primary" />}
      {error && <Alert color="danger">{error}</Alert>}

      {/* User List */}
      {!loading && !error && (
        <ListGroup className="user-list">
          {users.length > 0 ? (
            users.map((user) => (
              <ListGroupItem key={user.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{user.name}</strong> ({user.email}) - {user.user_type}
                </div>
                <EditUser user={user} />
              </ListGroupItem>
            ))
          ) : (
            <Alert color="info">No users available.</Alert>
          )}
        </ListGroup>
      )}

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
