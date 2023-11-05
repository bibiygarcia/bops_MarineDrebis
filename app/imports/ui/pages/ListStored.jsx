import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const StoredItems = ({ stuff }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${stuff._id}`);
  };

  // Action for "Transfer" button
  const handleTransferClick = () => {
    navigate(`/transfer/${stuff._id}`);
  };

  // Action for "Split" button
  const handleSplitClick = () => {
    navigate(`/split/${stuff._id}`);
  };

  return (
    <tr>
      <td>{stuff.facility}</td>
      <td>{stuff.type}</td>
      <td><Button onClick={handleDetailsClick}>Details</Button></td>
      <td><Button onClick={handleTransferClick}>Transfer</Button></td>
      <td><Button onClick={handleSplitClick}>Split</Button></td>
    </tr>
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
            <h2>Debris in Storage</h2>
            <p>This debris has been collected and is being stored by your organization</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Facility</th>
                <th>Type</th>
                <th>Details</th>
                <th>Transfer</th>
                <th>Split</th>
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
