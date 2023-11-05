import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/Stuff';
// import StuffItem from '../components/StuffItem'; // You don't use this anymore
import LoadingSpinner from '../components/LoadingSpinner';

const ClaimedItems = ({ stuff }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${stuff._id}`);
  };

  // Action for "Release" button
  const handleRelease = () => {
    navigate(`/release/${stuff._id}`);
  };

  return (
    <tr>
      <td>{stuff.island}</td>
      <td>{stuff.city}</td>
      <td>{stuff.type}</td>
      <td>{stuff.located}</td>
      <td><Button onClick={handleDetailsClick}>Details</Button></td>
      <td><Button onClick={handleRelease}>Release</Button></td>
    </tr>
  );
};

/* Renders a table containing all of the Stuff documents. Use <ClaimedItems> to render each row. */
const ListClaimed = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.claimed);
    const rdy = subscription.ready();
    const claimedItems = Stuffs.collection.find().fetch();
    return {
      stuffs: claimedItems,
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
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <ClaimedItems key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListClaimed;
