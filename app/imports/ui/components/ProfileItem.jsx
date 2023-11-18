import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ProfileItem = ({ profile }) => (
  <Container className="py-3">
    <Row className="justify-content-center">
      <Col className="text-center" />
      <h2>My Profile</h2>
      <table className="table table-sm">
        <tbody>
          <tr>
            <th>Email:</th>
            <td>{profile.email}</td>
          </tr>
          <tr>
            <th>First Name:</th>
            <td>{profile.firstName}</td>
          </tr>
          <tr>
            <th>Last Name:</th>
            <td>{profile.lastName}</td>
          </tr>
          <tr>
            <th>Age:</th>
            <td>{profile.age}</td>
          </tr>
          <tr>
            <th>Bio:</th>
            <td>{profile.bio} </td>
          </tr>
          <tr>
            <Link to={`/edit/${profile._id}`}>Edit</Link>
          </tr>
        </tbody>
      </table>
    </Row>
  </Container>

);

// Require a document to be passed to this component.
ProfileItem.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    age: PropTypes.string,
    bio: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfileItem;
