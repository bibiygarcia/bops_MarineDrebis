import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button, Modal } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Debris } from '../../api/debris/Debris';
import LoadingSpinner from '../components/LoadingSpinner';

const ClaimedItems = ({ debris }) => {
  const navigate = useNavigate();
  const [showRelease, setShowRelease] = useState(false);
  const [showStore, setShowStore] = useState(false);

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${debris._id}`);
  };

  // Action for "Release" button
  const handleCloseRelease = () => setShowRelease(false);
  const handleShowRelease = () => setShowRelease(true);

  const handleCloseStore = () => setShowStore(false);
  const handleShowStore = () => setShowStore(true);

  const handleRelease = () => {
    Meteor.call('debris.release', debris._id, (error) => {
      if (error) {
        console.log(`Releasing ${debris._id} failed`);
      } else {
        handleCloseRelease();
      }
    });
  };

  const handleStore = () => {
    Meteor.call('debris.store', debris._id, (error) => {
      if (error) {
        console.log(`Moving ${debris._id} to storage failed`);
      } else {
        handleCloseStore();
      }
    });
  };

  return (
    <>
      <tr>
        <td>{debris.island}</td>
        <td>{debris.city}</td>
        <td>{debris.type}</td>
        <td>{debris.located}</td>
        <td><Button onClick={handleDetailsClick}>Details</Button></td>
        <td><Button onClick={handleShowRelease}>Release</Button></td>
        <td><Button onClick={handleShowStore}>Store</Button></td>
      </tr>

      <Modal show={showRelease} onHide={handleCloseRelease}>
        <Modal.Header closeButton>
          <Modal.Title>Release Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to release this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRelease}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRelease}>
            Release
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showStore} onHide={handleCloseStore}>
        <Modal.Header closeButton>
          <Modal.Title>Move Debris to Storage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Has this debris been collected and moved to storage?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStore}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStore}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/* Renders a table containing all of the debris documents. Use <ClaimedItems> to render each row. */
const ListClaimed = () => {
  const { ready, debris } = useTracker(() => {
    const subscription = Meteor.subscribe(debris.claimed);
    const rdy = subscription.ready();
    const claimedItems = Debris.collection.find().fetch();
    return {
      debris: claimedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Claimed Debris</h2>
            <p>This debris has been claimed your organization but you have not yet reported it as collected</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Island</th>
                <th>City</th>
                <th>Type</th>
                <th>Located</th>
                <th>Details</th>
                <th>Release</th>
                <th>Store</th>
              </tr>
            </thead>
            <tbody>
              {debris.map((debris) => <ClaimedItems key={debris._id} debris={debris} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListClaimed;
