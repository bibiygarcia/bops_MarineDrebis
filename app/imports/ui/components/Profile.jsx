import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const Profile = ({ profile }) => (
  <Card>
    <Card.Header>
      <Image width={75} src={profile.image} />
      <Card.Title>{profile.firstName} {profile.lastName}</Card.Title>
    </Card.Header>
    <Card.Body>
      <Card.Subtitle>Username: {profile.owner}</Card.Subtitle>
      <Card.Subtitle>Age: {profile.age}</Card.Subtitle>
      <Card.Subtitle>Bio: </Card.Subtitle>
      <Card.Text>{profile.bio}</Card.Text>
      <Link to={`/edit/${profile._id}`}>Edit</Link>
    </Card.Body>
  </Card>
);

// Require a document to be passed to this component.
Profile.propTypes = {
  profile: PropTypes.shape({
    image: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    age: PropTypes.string,
    bio: PropTypes.string,
    owner: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default Profile;
