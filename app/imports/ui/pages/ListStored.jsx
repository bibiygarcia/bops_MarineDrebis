import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Events } from '../../api/debris/Event';
import LoadingSpinner from '../components/LoadingSpinner';
import StoredItem from '../components/StoredItem';

const ListStored = () => {
  const { ready, events } = useTracker(() => {
    const subscription = Meteor.subscribe(Events.stored);
    const rdy = subscription.ready();
    const storedItems = Events.collection.find().fetch();

    return {
      events: storedItems,
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
                <th>Distributed</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => <StoredItem key={event._id} event={event} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListStored;
