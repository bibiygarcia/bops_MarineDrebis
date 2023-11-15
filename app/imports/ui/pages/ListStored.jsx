import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button, Modal, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Debris } from '../../api/debris/Debris';
import LoadingSpinner from '../components/LoadingSpinner';
import { Samples } from '../../api/debris/Sample';

const StoredItems = ({ debris }) => {
  const navigate = useNavigate();
  const [showDispose, setShowDispose] = useState(false);
  const [showNewSample, setShowNewSample] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(0);

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${debris._id}`);
  };

  // Action for "Transfer" button
  const handleTransferClick = () => {
    navigate(`/transfer/${debris._id}`);
  };

  // Actions for "Sample" button

  const handleExistingSampleClick = () => {
    navigate(`/analysis#${debris.event_id}`);
  };

  // if none exists: ask what sample protocol they are using 1-6 via dropdown
  // generally: open form with corresponding questions
  const handleCloseNewSample = () => setShowNewSample(false);
  const handleShowNewSample = () => setShowNewSample(true);
  const handleNewSample = () => {
    // create new sample
    console.log(selectedProtocol);
    const newSampleId = Samples.collection.insert({
      name: 'Sample Initial',
      event_id: 'a', // debris.eventId
      sample_id: '0001',
    }, (err, _id) => { // callback function to get the _id of the inserted document
      if (err) {
        console.error('Could not insert new sample:', err);
      } else {
        Meteor.call('debris.linkSamplesWithEvent', debris._id, [newSampleId], selectedProtocol, (error) => {
          if (error) {
            console.log(`Creating a sample for ${debris._id} failed${error}`);
          } else {
            handleCloseNewSample();
          }
        });
      }
    });
  };

  const handleProtocolChange = (e) => {
    setSelectedProtocol(+e.target.value);
  };

  const handleCloseDispose = () => setShowDispose(false);
  const handleShowDispose = () => setShowDispose(true);

  const handleDispose = () => {
    Meteor.call('debris.dispose', debris._id, (error) => {
      if (error) {
        console.log(`Marking ${debris._id} as disposed failed`);
      } else {
        handleCloseDispose();
      }
    });
  };

  const eventItem = Debris.collection.findOne(debris._id);

  const SampleButton = (eventItem && (!eventItem.sampleIds || eventItem.sampleIds.length === 0)) ?
    <Button onClick={handleShowNewSample}>Create Sample</Button> :
    <Button onClick={handleExistingSampleClick}>Open Sample</Button>;

  return (
    <>
      <tr>
        <td>{debris.facility}</td>
        <td>{debris.type}</td>
        <td><Button onClick={handleDetailsClick}>Details</Button></td>
        <td><Button onClick={handleTransferClick}>Transfer</Button></td>
        <td>{SampleButton}</td>
        <td><Button onClick={handleShowDispose}>Dispose</Button></td>
      </tr>

      <Modal show={showDispose} onHide={handleCloseDispose}>
        <Modal.Header closeButton>
          <Modal.Title>Disposed Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to mark this debris as disposed?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDispose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDispose}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewSample} onHide={handleCloseNewSample}>
        <Modal.Header closeButton>
          <Modal.Title>Sample Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to log samples for this event?
          <br />
          <Form>
            <Form.Group controlId="protocol-select">
              <Form.Label>Select the Protocol you are using:</Form.Label>
              <Form.Control as="select" value={selectedProtocol} onChange={handleProtocolChange}>
                <option value="">...</option>
                <option value="1">Measure and Dispose</option>
                <option value="2">Four Corners</option>
                <option value="3">One of All</option>
                <option value="4">Hybrid</option>
                <option value="5">Disentanglement</option>
                <option value="6">Reverse Engineer</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewSample}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNewSample}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

const ListStored = () => {
  const { ready, debris } = useTracker(() => {
    const subscription = Meteor.subscribe(Debris.stored);
    const rdy = subscription.ready();
    const storedItems = Debris.collection.find().fetch();

    return {
      debris: storedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>DFG Events in Storage</h2>
            <p>This debris has been collected and is being stored by your organization</p>
          </Col>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Facility</th>
              <th>Type</th>
              <th>Details</th>
              <th>Transfer</th>
              <th>Sample</th>
              <th>Disposed</th>
            </tr>
            </thead>
            <tbody>
            {debris.map((debris) => <StoredItems key={debris._id} debris={debris} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListStored;
