import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import LoadingSpinner from '../components/LoadingSpinner';
import { Profiles } from '../../api/profile/Profiles';

const bridge = new SimpleSchema2Bridge(Profiles.schema);
/* Renders the EditStuff page for editing a single document. */
const EditProfile = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = Profiles.collection.findOne();
  // console.log('EditProfile', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Profiles documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Profiles.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditStuff', doc, ready);
  // On successful submit, insert the data.
  const submit = (profile) => {
    const { image, firstName, lastName, age, bio } = profile;
    Profiles.collection.update(_id, { $set: { image, firstName, lastName, age, bio } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'My profile updated successfully', 'success')));
  };
  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col className="text-center"><h2>Edit Profile</h2></Col>
        <AutoForm schema={bridge} onSubmit={profile => submit(profile)} model={doc}>
          <Card>
            <Card.Body>
              <TextField name="image" placeholder="Image URL" />
              <TextField name="firstName" placeholder="First Name" />
              <TextField name="lastName" placeholder="Last Name" />
              <TextField name="age" placeholder="Age" />
              <LongTextField name="bio" placeholder="Bio" />
              <SubmitField value="Submit" />
              <ErrorsField />
              <HiddenField name="owner" />
            </Card.Body>
          </Card>
        </AutoForm>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};
export default EditProfile;
