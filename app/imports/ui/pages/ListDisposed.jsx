import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Events } from '../../api/debris/Event';
import LoadingSpinner from '../components/LoadingSpinner';
import DisposedItem from '../components/DisposedItem';

const ListDisposed = () => {
  const { ready, events } = useTracker(() => {
    const subscription = Meteor.subscribe(Events.disposed);
    const rdy = subscription.ready();
    const disposedItems = Events.collection.find().fetch();

    return {
      events: disposedItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>DFG Events that have been Distributed</h2>
            <p>This debris has been recycled, reused, etc. Samples may have been collected and these can still be viewed anytime.</p>
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
              {events.map((event) => <DisposedItem key={event._id} event={event} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListDisposed;
