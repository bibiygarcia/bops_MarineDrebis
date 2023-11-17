import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Col, Container } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ProfileItem = ({ profile }) => (
<<<<<<< HEAD
  <Container className="py-3">
    <Col className="justify-content-end">
      <thead>
        <tr>
          <th id="firstname" scope="col">
            <tr>{profile.firstName}</tr>
          </th>
          <tr>{profile.lastName}</tr>
          <tr>{profile.age}</tr>
          <tr>{profile.email}</tr>
          <tr>{profile.password}</tr>
          <tr>{profile.bio}</tr>
          <tr>
            <Link to={`/profile/edit/${profile._id}`}>Edit</Link>
          </tr>
        </tr>
      </thead>
    </Col>
  </Container>
=======
  <tr>
    <td>{profile.firstName}</td>
    <td>{profile.lastName}</td>
    <td>{profile.age}</td>
    <td>
      <Link to={`/profile/edit/${profile._id}`}>Edit</Link>
    </td>
  </tr>
>>>>>>> parent of d089b4b (....)
);

// Require a document to be passed to this component.
ProfileItem.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    age: PropTypes.string,
    _id: PropTypes.string,
    password: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
};

export default ProfileItem;
