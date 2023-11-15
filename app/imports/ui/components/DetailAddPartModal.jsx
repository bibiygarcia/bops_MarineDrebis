import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

const distributionTypes = {
  1: 'Recycled',
  2: 'Reused',
  3: 'Turned into Power',
};

const DetailAddPartModal = ({ isModalOpen, closeModal, handlePartAdd, restWeight }) => {
  const [newPart, setNewPart] = useState({ name: '', distribution: 1, weight: 0 });

  const handleSubmit = () => {
    handlePartAdd(newPart);
    setNewPart({ name: '', distribution: 1, weight: 0 });
    closeModal();
  };

  return (
    <Modal show={isModalOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Part</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <label htmlFor="partName"> Name:
            <input type="text" value={newPart.name} onChange={e => setNewPart({ ...newPart, name: e.target.value })} />
          </label>
          <label htmlFor="partWeight"> Weight:
            <input
              type="number"
              min="0"
              max={restWeight}
              value={newPart.weight}
              onChange={e => {
                const newValue = parseFloat(e.target.value);
                if (newValue > restWeight) {
                  swal('Error', `Combined parts weight cannot exceed dry weight. Remaining weight is ${restWeight} kg`, 'error');
                  return;
                }
                setNewPart({ ...newPart, weight: newValue });
              }}
            />
          </label>
          <label htmlFor="partDistribution"> Distribution Type:
            <select value={newPart.distribution} onChange={e => setNewPart({ ...newPart, distribution: parseInt(e.target.value, 10) })}>
              {Object.entries(distributionTypes).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DetailAddPartModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handlePartAdd: PropTypes.func.isRequired,
  restWeight: PropTypes.number.isRequired,
};

export default DetailAddPartModal;
