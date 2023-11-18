import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Events } from '../../api/debris/Event';
import LoadingSpinner from '../components/LoadingSpinner';
import ClaimedItems from '../components/ClaimedItem';

const ListClaimed = () => {
  const { ready, events } = useTracker(() => {
    const subscription = Meteor.subscribe(Events.claimed);
    const rdy = subscription.ready();
    const claimedItems = Events.collection.find().fetch();
    return {
      events: claimedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Col className="text-center">
            <h2>Claimed Debris</h2>
            <p>This debris has been claimed your organization but you have not yet reported it as collected</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Island</th>
                <th className="text-center">City</th>
                <th className="text-center">Type</th>
                <th className="text-center">Located</th>
                <th className="text-center">Description</th>
                <th className="text-center">Details</th>
                <th className="text-center">Remove</th>
                <th className="text-center">Store</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => <ClaimedItems key={event._id} event={event} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListClaimed;
