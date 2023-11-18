import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Container, Col, Row } from 'react-bootstrap';
import LoadingSpinner from '../components/LoadingSpinner';
import Profile from '../components/Profile';
import { Profiles } from '../../api/profile/Profiles';

/*
Consider looking at this for account stuff: https://docs.meteor.com/api/accounts.html#Meteor-users
 */

const MyProfile = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  // eslint-disable-next-line no-unused-vars
  const { ready, profiles } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to MyProfile documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the Stuff documents
    const profileItems = Profiles.collection.find({}).fetch();
    return {
      profiles: profileItems,
      ready: rdy,
    };
  }, []);
  return ready ? (
    <Container className="py-3">
      <Row className="g-4">
        <Col>
          <h2 className="text-center">My Profile</h2>
          {profiles.map((profile) => (<Profile key={profile.id} profile={profile} />))}
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default MyProfile;
