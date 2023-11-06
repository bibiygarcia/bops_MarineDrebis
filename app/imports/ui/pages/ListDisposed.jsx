import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const DisposedItems = ({ stuff }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${stuff._id}`);
  };

  return (
    <tr>
      <td>{stuff.result}</td>
      <td>{stuff.type}</td>
      <td><Button onClick={handleDetailsClick}>Details</Button></td>
    </tr>
  );
};

const ListDisposed = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.disposed);
    const rdy = subscription.ready();
    const disposedItems = Stuffs.collection.find().fetch();

    return {
      stuffs: disposedItems,
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
              {stuffs.map((stuff) => <DisposedItems key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListDisposed;
