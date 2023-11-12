import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const ReportedItems = ({ stuff }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleDetailsClick = () => {
    navigate(`/details/${stuff._id}`);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClaim = () => {
    Meteor.call('stuffs.claim', stuff._id, Meteor.user().username, (error) => {
      if (error) {
        console.log(`Claiming ${stuff._id} failed`);
      } else {
        handleClose();
      }
    });
  };

  return (
    <>
      <tr>
        <td>{stuff.island}</td>
        <td>{stuff.city}</td>
        <td>{stuff.type}</td>
        <td>{stuff.customTypeDescription}</td>
        <td>{stuff.located}</td>
        <td>{stuff.customLocatedDescription}</td>
        <td>{stuff.describe}</td>
        <td>{stuff.customDescriptionDescription}</td>
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
/* Renders a table containing all of the Stuff documents. Use <ReportedItems> to render each row. */
const ListReported = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.unclaimed);
    const rdy = subscription.ready();
    const reportedItems = Stuffs.collection.find().fetch();

    return {
      stuffs: reportedItems,
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
              {stuffs.map((stuff) => <ReportedItems key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListReported;
