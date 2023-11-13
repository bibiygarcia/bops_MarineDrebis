import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row, Image, Button } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SelectField, SubmitField, TextField, ListField, NumField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Events } from '../../api/debris/Event';
import LoadingSpinner from '../components/LoadingSpinner';
import DetailDistributionField from '../components/DetailDistributionField';
import DetailProtocolField from '../components/DetailProtocolField';
import DetailWeightField from '../components/DetailWeightField';
import DetailDisplayPieGraph from '../components/DetailDisplayPieGraph';
import DetailAddPartModal from '../components/DetailAddPartModal';

const bridge = new SimpleSchema2Bridge(Events.schema);

const Detail = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  // useParams was not working so switched to window.location.href
  const url = window.location.href;
  const parts = url.split('/');
  const _id = parts[parts.length - 1];
  const { doc, ready } = useTracker(() => {
    const subscription = Meteor.subscribe(Events.adminPublicationName);
    const rdy = subscription.ready();
    const document = Events.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);

  const protocolValue = doc && doc.protocol;

  const submit = (data) => {
    // eslint-disable-next-line no-shadow
    const { name, status, type, located, describe, island, protocol, facility, distribution, wetWeight, dryWeight, parts } = data;
    Events.collection.update(_id, { $set: { name, status, type, located, describe, island, protocol, facility, distribution, wetWeight, dryWeight, parts } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Event updated successfully', 'success')));
  };
  const [showModal, setShowModal] = useState(false);
  const [partsWeightTotal, setPartsWeightTotal] = useState(0);

  useEffect(() => {
    if (doc?.parts) {
      const totalWeight = doc.parts.map(part => part.weight).reduce((a, b) => a + b, 0);
      setPartsWeightTotal(totalWeight);
    }
  }, [doc]);

  const restWeight = (doc?.dryWeight || 0) - partsWeightTotal;

  const handlePartAdd = (newPart) => {
    const updatedParts = doc?.parts ? [...doc.parts, newPart] : [newPart];

    Events.collection.update(_id, { $set: { parts: updatedParts } }, error => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        const updatedDoc = Events.collection.findOne(_id);

        if (updatedDoc?.parts) {
          const totalWeight = updatedDoc.parts.map(part => part.weight)
            .reduce((a, b) => a + b, 0);
          setPartsWeightTotal(totalWeight);
        }

        swal('Success', 'Part added successfully', 'success');
      }
    });
  };

  const handlePartDelete = (index) => {
    const updatedParts = [...doc.parts];
    updatedParts.splice(index, 1);

    Events.collection.update(_id, { $set: { parts: updatedParts } }, error => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        const updatedDoc = Events.collection.findOne(_id);

        if (updatedDoc?.parts) {
          const totalWeight = updatedDoc.parts.map(part => part.weight)
            .reduce((a, b) => a + b, 0);
          setPartsWeightTotal(totalWeight);
        }

        swal('Success', 'Part deleted successfully', 'success');
      }
    });
  };

  return ready ? (

    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Col className="text-center"><h2>Debris Event Details</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body>
                <TextField name="owner" disabled />
                <SelectField name="status" />
                <SelectField name="type" />
                <SelectField name="located" />
                <SelectField name="describe" />
                <SelectField name="island" />
                <DetailProtocolField name="protocol" protocolValue={protocolValue} />
                <TextField name="facility" />
                <DetailDistributionField name="distribution" distributionValue={doc && doc.distribution} />

                <TextField name="claimedAt" disabled />
                <TextField name="eventId" disabled />
                <DetailWeightField name="wetWeight" label="Wet Weight" />
                <DetailWeightField name="dryWeight" label="Dry Weight" />
                <TextField name="sampleIds" disabled />
                {
                  doc && doc.image
                    ? <Image src={doc.image} alt="Loaded from AWS" rounded fluid />
                    : <p>No image submitted for this event.</p>
                }

                <ListField name="parts">
                  <TextField name="$.name" />
                  <NumField name="$.distribution" decimal={false} />
                  <NumField name="$.weight" min={0} max={restWeight} />
                  <Button
                    onClick={(index) => handlePartDelete(index)}
                    variant="outline-danger"
                  >
                    Delete
                  </Button>
                  <hr style={{ color: 'black' }} />
                </ListField>

                <Button onClick={() => setShowModal(true)} disabled={!doc.dryWeight || partsWeightTotal >= doc.dryWeight}>
                  Add New Part
                </Button>
                <DetailAddPartModal isModalOpen={showModal} closeModal={() => setShowModal(false)} handlePartAdd={handlePartAdd} restWeight={restWeight} />

                <SubmitField value="Save Changes" />
                <ErrorsField />
                <HiddenField name="owner" />

              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <DetailDisplayPieGraph event={doc} />
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default Detail;
