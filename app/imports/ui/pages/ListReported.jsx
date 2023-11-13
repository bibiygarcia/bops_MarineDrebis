import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Debris } from '../../api/debris/Debris';
import LoadingSpinner from '../components/LoadingSpinner';

const ReportedItems = ({ debris }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleDetailsClick = () => {
    navigate(`/details/${debris._id}`);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClaim = () => {
    Meteor.call('debris.claim', debris._id, Meteor.user().username, (error) => {
      if (error) {
        console.log(`Claiming ${debris._id} failed`);
      } else {
        handleClose();
      }
    });
  };

  return (
    <>
      <tr>
        <td>{debris.island}</td>
        <td>{debris.city}</td>
        <td>{debris.type}</td>
        <td>{debris.customTypeDescription}</td>
        <td>{debris.located}</td>
        <td>{debris.customLocatedDescription}</td>
        <td>{debris.describe}</td>
        <td>{debris.customDescriptionDescription}</td>
        <td><Button onClick={handleDetailsClick}>Details</Button></td>
        <td><Button onClick={handleShow}>Claim</Button></td>
      </tr>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Claim Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to claim this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClaim}>
            Claim
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};
/* Renders a table containing all of the debris documents. Use <ReportedItems> to render each row. */
const ListReported = () => {
  const { ready, debris } = useTracker(() => {
    const subscription = Meteor.subscribe(Debris.unclaimed);
    const rdy = subscription.ready();
    const reportedItems = Debris.collection.find().fetch();

    return {
      debris: reportedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Reported & Unclaimed Debris</h2>
            <p>This debris has been reported by individuals from the public and organizations within this program.</p>
          </Col>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Island</th>
              <th>City</th>
              <th>Type</th>
              <th>Type: Other</th>
              <th>Located</th>
              <th>Located: Other</th>
              <th>Describe</th>
              <th>Describe: Other</th>
              <th>Details</th>
              <th>Claim</th>
            </tr>
            </thead>
            <tbody>
            {debris.map((debris) => <ReportedItems key={debris._id} debris={debris} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListReported;
