import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button, Modal, Form } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';
import { Samples } from '../../api/stuff/Sample';

const StoredItems = ({ stuff }) => {
  const navigate = useNavigate();
  const [showDispose, setShowDispose] = useState(false);
  const [showNewSample, setShowNewSample] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('');

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${stuff._id}`);
  };

  // Action for "Transfer" button
  const handleTransferClick = () => {
    navigate(`/transfer/${stuff._id}`);
  };

  // Actions for "Sample" button

  const handleExistingSampleClick = () => {
    navigate(`/split/${stuff._id}`);
  };

  // if none exists: ask what sample protocol they are using 1-6 via dropdown
  // generally: open form with corresponding questions
  const handleCloseNewSample = () => setShowNewSample(false);
  const handleShowNewSample = () => setShowNewSample(true);
  const handleNewSample = () => {
    // create new sample
    const newSampleId = Samples.collection.insert({
      name: 'Sample Initial',
      event_id: 'a', // stuff.eventId
      sample_id: '0001',
      protocol: selectedProtocol,
    }, (err, _id) => { // callback function to get the _id of the inserted document
      if (err) {
        console.error('Could not insert new sample:', err);
      } else {
        Meteor.call('stuffs.linkSamplesWithEvent', stuff._id, [newSampleId], (error) => {
          if (error) {
            console.log(`Creating a sample for ${stuff._id} failed${error}`);
          } else {
            handleCloseNewSample();
          }
        });
      }
    });
  };

  const handleProtocolChange = (e) => {
    setSelectedProtocol(e.target.value);
  };

  const handleCloseDispose = () => setShowDispose(false);
  const handleShowDispose = () => setShowDispose(true);

  const handleDispose = () => {
    Meteor.call('stuffs.dispose', stuff._id, (error) => {
      if (error) {
        console.log(`Marking ${stuff._id} as disposed failed`);
      } else {
        handleCloseDispose();
      }
    });
  };

  const eventItem = Stuffs.collection.findOne(stuff._id);

  const SampleButton = (eventItem && (!eventItem.sampleIds || eventItem.sampleIds.length === 0)) ?
    <Button onClick={handleShowNewSample}>Create Sample</Button> :
    <Button onClick={handleExistingSampleClick}>Open Sample</Button>;

  return (
    <>
      <tr>
        <td>{stuff.facility}</td>
        <td>{stuff.type}</td>
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
                <option value="protocol1">Measure and Dispose</option>
                <option value="protocol2">Four Corners</option>
                <option value="protocol3">One of All</option>
                <option value="protocol4">Hybrid</option>
                <option value="protocol5">Disentanglement</option>
                <option value="protocol6">Reverse Engineer</option>
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
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.stored);
    const rdy = subscription.ready();
    const storedItems = Stuffs.collection.find().fetch();

    return {
      stuffs: storedItems,
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
              {stuffs.map((stuff) => <StoredItems key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListStored;
