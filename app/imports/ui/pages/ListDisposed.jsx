import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Debris } from '../../api/debris/Debris';
import LoadingSpinner from '../components/LoadingSpinner';

const DisposedItems = ({ debris }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${debris._id}`);
  };

  return (
    <tr>
      <td>{debris.result}</td>
      <td>{debris.type}</td>
      <td><Button onClick={handleDetailsClick}>Details</Button></td>
    </tr>
  );
};

const ListDisposed = () => {
  const { ready, debris } = useTracker(() => {
    const subscription = Meteor.subscribe(Debris.disposed);
    const rdy = subscription.ready();
    const disposedItems = Debris.collection.find().fetch();

    return {
      debris: disposedItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>DFG Events that have been Disposed</h2>
            <p>This debris has been recycled, burned, or thrown into a landfill 🚯</p>
          </Col>
          <Table striped bordered hover>
            <thead>
            <tr>
              <th>Result</th>
              <th>Type</th>
              <th>Details</th>
            </tr>
            </thead>
            <tbody>
            {debris.map((debris) => <DisposedItems key={debris._id} debris={debris} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListDisposed;
