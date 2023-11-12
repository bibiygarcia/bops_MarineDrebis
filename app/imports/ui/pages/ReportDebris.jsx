import React, { useState, useRef } from 'react';
import { Card, Col, Container, Row, Form } from 'react-bootstrap';
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
    allowedValues: ['A mass of netting and/or fishing gear', 'An abandoned/derelict boat', 'A container/drum/cylinder', 'A large concentration of plastics', 'Potential Japan tsunami marine debris', 'Other'],
    defaultValue: 'A mass of netting and/or fishing gear',
  },
  located: {
    type: String,
    allowedValues: ['At sea, BEYOND three miles ' +
    'from nearest land', 'At sea, WITHIN three miles of nearest land', 'In the shore break', 'On the beach BELOW the high wash of the waves', 'On the beach ABOVE the high wash of the waves', 'Other'],
    defaultValue: '',
  },
  describe: {
    type: String,
    allowedValues: ['caught on the reef or is ' +
    'partially buried in sand', 'loose in the shore ' +
    'break or on the shoreline and could go ' +
    'back out to sea', 'trapped in a tide pool and ' +
    'cannot escape', 'loose on the shore but caught in ' +
    'the vegetation line', 'tied to a fixed object so it cannot be swept away', 'pushed inland above the high wash of the waves so it cannot be swept away', 'Other - please explain how urgent recovery/removal is'],
    defaultValue: '',
  },
  island: {
    type: String,
    allowedValues: ['Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai', 'Lanai', 'Kahoolawe', 'Niihau'],
    defaultValue: '',
  },
  image: {
    type: String,
    optional: true,
  },
  customTypeDescription: {
    type: String,
    optional: true,
    custom() {
      // Custom validation logic for the customTypeDescription field
      const typeValue = this.field('type').value;
      const customValue = this.value;

      if (typeValue === 'Other - please explain below' && !customValue) {
        return 'Custom description is required for "Other" type.';
      }

      return undefined; // Validation passed
    },
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const ReportDebris = () => {
  const [imageFile, setImageFile] = useState(null); // State hook for the image file
  const fRef = useRef(null); // This reference is used to reset the form
  const [showTextField, setShowTextField] = useState(false);
  const [customTypeDescription, setCustomTypeDescription] = useState('');
  const [type, setType] = useState('');

  const submit = (data) => {
    console.log('Type', type);

    const { located, describe, island, image } = data;
    let DFG_ID = 'DFG';
    DFG_ID += '00'; // island
    DFG_ID += '00'; // org
    // date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    DFG_ID += year.toString() + month.toString() + day.toString();

    let isUnique = 0;
    let proposedID = 'FFFFFFFFF';
    do {
      proposedID = [...Array(9)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
      isUnique = Stuffs.collection.countDocuments({ DFG_ID: proposedID });
    } while (!isUnique);

    DFG_ID += proposedID; // id_main 9 characters
    // 0 if no further subcategories exist
    DFG_ID += '00000'; // id_part_1
    DFG_ID += '0000'; // id_part_2
    DFG_ID += '000'; // id_part_3
    DFG_ID += '000'; // id_part_4
    DFG_ID += '000'; // id_part_5
    DFG_ID += '000'; // id_part_6

    const owner = Meteor.user().username;

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileContent = reader.result.split(',')[1];

        Meteor.call('uploadFile', fileContent, imageFile.name, imageFile.type, (error, response) => {
          if (error) {
            console.error('Error during image upload', error);
          } else {
            console.log('Image uploaded successfully at', response);

            // Add Image URL to the data
            // eslint-disable-next-line no-param-reassign
            data.image = response;

            Stuffs.collection.insert({ type, located, describe, island, owner, DFG_ID, image: response }, () => {
              if (error) {
                swal('Error', error.message, 'error');
              } else {
                swal('Success', 'Item added successfully', 'success');
                setImageFile(null); // Reset the imageFile state
                fRef.current.reset();
              }
            });
          }
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      Stuffs.collection.insert({ type, located, describe, island, owner, DFG_ID, image }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
        }
      });
    }
    Stuffs.collection.update({ _id: stuff._id }, { $set: { type, located, describe, island, image } });
    swal('Success', 'Item updated successfully', 'success');
    swal('Error', error.message, 'error');
  };

  const handleCapture = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCustomTypeDescriptionChange = (event) => {
    // Update the state with the entered text
    const customValue = event.target.value;
    setCustomTypeDescription(String(customValue));
    //setType(customValue);
  };
  const handleSelectChange = (value) => {
    console.log('Selected value:', value);
    // Check against the actual option values
    if (value === 'Other') {
      setShowTextField(true);
      setType(value);
      console.log('Selected value:', value);

    } else {
      setShowTextField(false);
      setType(value);
    }
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>REPORT MARINE DEBRIS</h2></Col>
          <h5>Use this form if you found marine debris you cannot remove by yourself that is:</h5>
          <h6>1) Drifting in State waters or washed up on the shoreline,</h6>
          <h6>2) Removed from the water and is secured on land, or</h6>
          <h6>3) So large or heavy that you need help to remove it.</h6>
          <AutoForm schema={bridge} onSubmit={submit} ref={fRef}>
            <Card>
              <Card.Body>
                <SelectField name="type" label="Select Type" onChange={(value) => handleSelectChange(value)} value = {type}/>
                {showTextField && (
                  <Form.Group controlId="otherDescription">
                    <Form.Label>Please enter your own description of the type of debris found:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Other - please explain"
                      onChange={handleCustomTypeDescriptionChange}
                      value={customTypeDescription}
                    />
                  </Form.Group>
                )}
                <SelectField name="located" label="THIS DEBRIS IS LOCATED" />
                {/* {showTextField && ( */}
                {/*  <Form.Group controlId="other"> */}
                {/*    <Form.Label>If located offshore, enter latitude and longitude (i.e. 21.3161 -157.8906) or provide a position description and any information on currents and winds that could help in relocating the debris.:</Form.Label> */}
                {/*    <Form.Control type="text" placeholder="please explain" /> */}
                {/*  </Form.Group> */}
                {/* )} */}
                <SelectField name="describe" label="THE DEBRIS IS BEST DESCRIBED AS:" />
                <SelectField name="island" label="If on land or in the nearshore waters - indicate which island" />
                <input type="file" accept="image/*" capture="camera" onChange={handleCapture} />
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
