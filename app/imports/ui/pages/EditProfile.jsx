import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import swal from 'sweetalert';
import { useParams } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import LoadingSpinner from '../components/LoadingSpinner';
import { Stuffs } from '../../api/stuff/Stuff';

const bridge = new SimpleSchema2Bridge(Stuffs.schema);
/* Renders the EditStuff page for editing a single document. */
const EditProfile = () => {
  const { _id } = useParams();
  // console.log('EditStuff', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Stuffs.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Stuffs.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
<<<<<<< Updated upstream
  const submit = (data) => {
    const { firstname, lastname, email, password, bio } = data;
    Stuffs.collection.update(_id, { $set: { firstname, lastname, email, password, bio } }, (error) => (error ?
=======
  // console.log('EditStuff', doc, ready);
  // On successful submit, insert the data.
  const submit = (profile) => {
    const { firstname, lastname, age, email, password } = profile;
    Meteor.users.update(_id, { $set: { firstname, lastname, age, email, password } }, (error) => (error ?
>>>>>>> Stashed changes
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  };
  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col className="text-center"><h2>Editing your Profile</h2></Col>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Card>
            <Card.Body>
<<<<<<< Updated upstream
              <TextField name="firstname" placeholder="First Name" />
              <TextField name="lastname" placeholder="Last Name" />
              <TextField name="email" placeholder="Email Address" />
              <TextField name="password" placeholder="Password" />
              <LongTextField name="bio" placeholder="Tell Us About Yourself" />
=======
              <TextField name="firstName" placeholder="Change First Name" />
              <TextField name="lastName" placeholder="Change Last Name" />
              <TextField name="age" placeholder="Change Age" />
              <TextField name="email" placeholder="Change Email" />
              <TextField name="password" placeholder="Change Password" />
>>>>>>> Stashed changes
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
