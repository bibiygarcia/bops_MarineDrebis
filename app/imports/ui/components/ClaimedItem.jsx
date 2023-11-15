import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { CheckSquareFill, PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

const ClaimedItems = ({ stuff }) => {
  const navigate = useNavigate();
  const [showRelease, setShowRelease] = useState(false);
  const [showStore, setShowStore] = useState(false);

  const claimTime = stuff.claimedAt;
  const [timer, setTimer] = useState(claimTime ? Date.now() - claimTime : null);
  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${stuff._id}`);
  };

  // Action for "Release" button
  const handleCloseRelease = () => setShowRelease(false);
  const handleShowRelease = () => setShowRelease(true);

  const handleCloseStore = () => setShowStore(false);
  const handleShowStore = () => setShowStore(true);

  const handleRelease = () => {
    Meteor.call('stuffs.release', stuff._id, (error) => {
      if (error) {
        // TODO add error handling
        // eslint-disable-next-line no-console
        console.log(`Releasing ${stuff._id} failed`);
      } else {
        handleCloseRelease();
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (claimTime) {
        const currentTime = Date.now();
        const timeElapsed = Math.floor((currentTime - claimTime) / 1000);
        setTimer(120 * 60 * 60 - timeElapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [claimTime]);

  useEffect(() => {
    // If timer reaches 0, this releases the debris. However, this is not the best way to do this.
    // The timer should be set on the server side, and the server should release the debris when the timer reaches 0. For now this is a temporary solution.
    if (timer === 0) handleRelease();
  }, [timer]);

  const seconds = Math.floor((timer) % 60).toString().padStart(2, '0');
  const minutes = Math.floor((timer / 60) % 60).toString().padStart(2, '0');
  const hours = Math.floor((timer / 3600) % 24).toString().padStart(2, '0');
  const days = Math.floor(timer / (3600 * 24)).toString();

  const handleStore = () => {
    Meteor.call('stuffs.store', stuff._id, (error) => {
      if (error) {
        // TODO add error handling
        // eslint-disable-next-line no-console
        console.log(`Moving ${stuff._id} to storage failed`);
      } else {
        handleCloseStore();
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
        <td><Button variant="outline-danger" onClick={handleShowRelease} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><XSquareFill /> {` ${days}:${hours}:${minutes}:${seconds}`}</Button></td>
        <td><Button onClick={handleShowStore}><CheckSquareFill /></Button></td>
      </tr>

      <Modal show={showRelease} onHide={handleCloseRelease}>
        <Modal.Header closeButton>
          <Modal.Title>Unclaim Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this debris from your claimed list?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRelease}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRelease}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showStore} onHide={handleCloseStore}>
        <Modal.Header closeButton>
          <Modal.Title>Move Debris to Storage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Has this debris been collected and moved to storage?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStore}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStore}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ClaimedItems.propTypes = {
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
    claimedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClaimedItems;
