import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { PencilSquare } from 'react-bootstrap-icons';
import React from 'react';
import PropTypes from 'prop-types';

const DisposedItem = ({ event }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${event._id}`);
  };

  const distributionTypes = {
    0: 'Not reported',
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };
  const distributionType = distributionTypes[event.distribution];

  return (
    <tr>
      <td>{distributionType}</td>
      {event.type === 'Other' ? <td>{event.customTypeDescription}</td> : <td>{event.type}</td>}
      <td><Button variant="secondary" onClick={handleDetailsClick}><PencilSquare /></Button></td>
    </tr>
  );
};

DisposedItem.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    distribution: PropTypes.number,
    type: PropTypes.string.isRequired,
    customTypeDescription: PropTypes.string,
  }).isRequired,
};

export default DisposedItem;
