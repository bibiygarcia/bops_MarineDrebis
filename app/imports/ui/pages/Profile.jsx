import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Profiles } from '../../api/profile/Profiles';
import ProfileItem from '../components/ProfileItem';
import LoadingSpinner from '../components/LoadingSpinner';

/*
Consider looking at this for account stuff: https://docs.meteor.com/api/accounts.html#Meteor-users
 */

const Profile = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  // eslint-disable-next-line no-unused-vars
  const { ready, profiles } = useTracker(() => {
    // Note that this subscription will get cleaned up
    // when your component is unmounted or deps change.
    // Get access to Stuff documents.
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
      <Row className="justify-content-center">
        <Col className="text-center" />
        <Card>
          <Card.Body>
            <div className="card-header"><h2>My Profile</h2>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">First Name </li>
              <li className="list-group-item">Last Name</li>
              <li className="list-group-item">Age</li>
              <li className="list-group-item">Email Address</li>
              <li className="list-group-item">About yourself</li>
            </ul>
            {/* <TextField name="firstName" placeholder="First Name" /> */}
            {/* <TextField name="lastName" placeholder="Last Name" /> */}
            {/* <TextField name="age" placeholder="Age" /> */}
            {/* <TextField name="email" placeholder="Email" /> */}
            {/* <TextField name="password" placeholder="Password" /> */}
            {/* <LongTextField name="bio" placeholder="About Yourself" /> */}

          </Card.Body>
        </Card>
        <tbody>
          {profiles.map((profile) => <ProfileItem key={profile._id} profile={profile} />)}
        </tbody>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Profile;
