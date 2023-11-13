import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Button, Modal } from 'react-bootstrap';
import { CheckSquareFill, PencilSquare } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

const ReportedItem = ({ stuff }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClaim = () => {
    Meteor.call('stuffs.claim', stuff._id, Meteor.user().username, (error) => {
      if (error) {
        console.log(`Claiming ${stuff._id} failed`);
      } else {
        handleClose();
      }
    });
  };

  return (
    <>
      <tr>
        <td>{stuff.island}</td>
        <td>{stuff.city}</td>
        {stuff.type === 'Other' ? <td>{stuff.customTypeDescription}</td> : <td>{stuff.type}</td>}
        {stuff.located === 'Other' ? <td>{stuff.customLocatedDescription}</td> : <td>{stuff.located}</td>}
        {stuff.describe === 'Other' ? <td>{stuff.customDescriptionDescription}</td> : <td>{stuff.describe}</td>}
        <td><Button variant="secondary" onClick={handleDetailsClick}><PencilSquare /></Button></td>
        <td><Button onClick={handleShow}><CheckSquareFill /></Button></td>
      </tr>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Claim Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to claim this debris for your organization?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClaim}>
            Claim
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

ReportedItem.propTypes = {
  stuff: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    island: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    customTypeDescription: PropTypes.string,
    located: PropTypes.string.isRequired,
    customLocatedDescription: PropTypes.string,
    describe: PropTypes.string.isRequired,
    customDescriptionDescription: PropTypes.string,
  }).isRequired,
};

export default ReportedItem;
