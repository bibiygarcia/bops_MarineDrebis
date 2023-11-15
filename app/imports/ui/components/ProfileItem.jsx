import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const ProfileItem = ({ profile }) => (
  <tr>
    <td>{profile.firstName}</td>
    <td>{profile.lastName}</td>
    <td>{profile.age}</td>
    <td>
      <Link to={`/profile/edit/${profile._id}`}>Edit</Link>
    </td>
  </tr>
);

// Require a document to be passed to this component.
ProfileItem.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    age: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ProfileItem;
