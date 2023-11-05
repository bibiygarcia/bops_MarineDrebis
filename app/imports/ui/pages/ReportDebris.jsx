import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, SelectField, SubmitField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Stuffs } from '../../api/stuff/Stuff';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['A mass of netting and/or fishing gear', 'An abandoned/derelict boat', 'A container/drum/cylinder', ' A large concentration of plastics', 'Potential Japan tsunami marine debris', 'Other'],
    defaultValue: 'Choose One',
  },
  located: {
    type: String,
    allowedValues: ['At sea, BEYOND three miles from nearest land', 'At sea, WITHIN three miles of nearest land', 'In the shore break', 'On the beach BELOW the high wash of the waves', 'On the beach ABOVE the high wash of the waves', 'None of the above, a description follows bellow'],
    defaultValue: 'Choose One',
  },
  describe: {
    type: String,
    allowedValues: ['caught on the reef or is partially buried in sand', 'loose in the shore break or on the shoreline and could go back out to sea', 'trapped in a tide pool and cannot escape', 'loose on the shore but caught in the vegetation line', 'tied to a fixed object so it cannot be swept away', 'pushed inland above the high wash of the waves so it cannot be swept away', 'Other - please explain how urgent recovery/removal is'],
    defaultValue: 'Choose One',
  },
  image: {
    type: String,
    optional: true,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddStuff page for adding a document. */
const ReportDebris = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { type, located, describe, image } = data;
    const owner = Meteor.user().username;
    Stuffs.collection.insert(
      { type, located, describe, image, owner },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      },
    );
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h2>REPORT MARINE DEBRIS</h2></Col>
          <h5>Use this form if you found marine debris you cannot remove by yourself that is:</h5>
          <h6>1) Drifting in State waters or washed up on the shoreline,</h6>
          <h6>2) Removed from the water and is secured on land, or</h6>
          <h6>3) So large or heavy that you need help to remove it.</h6>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <SelectField name="type" label="I FOUND/LOCATED THE FOLLOWING" />
                <SelectField name="located" label="THIS DEBRIS IS LOCATED" />
                <SelectField name="describe" label="THE DEBRIS IS BEST DESCRIBED AS:" />
                <SubmitField value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportDebris;
