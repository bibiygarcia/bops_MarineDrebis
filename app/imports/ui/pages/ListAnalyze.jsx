import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Stuffs } from '../../api/stuff/Stuff';
import StuffItem from '../components/StuffItem';
import LoadingSpinner from '../components/LoadingSpinner';

const ListAnalysis = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready, stuffs } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Stuffs.analysis);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const stuffItems = Stuffs.collection.find({}).fetch();
    return {
      stuffs: stuffItems,
      ready: rdy,
    };
  }, []);
  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Analysis Page for Collected Debris</h2>
            <p>This page is designed to make analysis easier. You can designate existing debris in the database for future analysis. This will allow you to see all of these here.</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* GPS based info */}
                <th>Island Collected</th>
                {/* GPS based info */}
                <th>Nearest City</th>
                {/* Maybe we can simplify: fishing, boat, container, plastic, tsunami, trash, other */}
                <th>Type</th>
                {/* Maybe we can simplify: offshore >3mi, offshore <3mi, shore, beach underwater, beach over water, other */}
                <th>Located</th>
                {/* Opens detail page */}
                <th>Details</th>
                {/* Event -> Samples */}
                <th>Split</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <StuffItem key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListAnalysis;
