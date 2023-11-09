import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Container } from 'react-bootstrap';

const Profile = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <Container className="py-3">
      <h2>Profile</h2>
      Everyone can see me!

      {currentUser ? ([
        <div>Only Users can see me.</div>,
      ]) : ''}

      {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
        <div>Only Admins can see me.</div>
      ) : ''}

      {currentUser === '' ? (
        <div>The public can see me but NOT Users or Admins.</div>
      ) : ''}
    </Container>
  );
};

export default Profile;
