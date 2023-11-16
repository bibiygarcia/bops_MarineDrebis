import React, { useState, useRef } from 'react';
import { Card, Col, Container, Row, Form, Button, Spinner } from 'react-bootstrap';
import { AutoForm, ErrorsField, SelectField, SubmitField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Events } from '../../api/debris/Event';

// Create a schema to specify the structure of the data to appear in the form.
/* eslint-disable no-console */
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
    defaultValue: 'At sea, BEYOND three miles from nearest land',
  },
  describe: {
    type: String,
    allowedValues: ['caught on the reef or is ' +
    'partially buried in sand', 'loose in the shore ' +
    'break or on the shoreline and could go ' +
    'back out to sea', 'trapped in a tide pool and ' +
    'cannot escape', 'loose on the shore but caught in ' +
    'the vegetation line', 'tied to a fixed object so it cannot be swept away', 'pushed inland above the high wash of the waves so it cannot be swept away', 'Other'],
    defaultValue: 'caught on the reef or is partially buried in sand',
  },
  island: {
    type: String,
    allowedValues: ['Oahu', 'Maui', 'Big Island', 'Kauai', 'Molokai', 'Lanai', 'Kahoolawe', 'Niihau'],
    defaultValue: 'Oahu',
  },
  image: {
    type: String,
    optional: true,
  },
  customTypeDescription: {
    type: String,
    optional: true,
  },
  customLocatedDescription: {
    type: String,
    optional: true,
  },
  customDescriptionDescription: {
    type: String,
    optional: true,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const isMobileDevice = () => {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return true;
  }
  if (typeof window.orientation !== 'undefined') {
    return window.orientation !== undefined;
  }
  return navigator.userAgent.indexOf('IEMobile') !== -1;
};
const ReportDebris = () => {
  const [imageFile, setImageFile] = useState(null); // State hook for the image file
  const fRef = useRef(null); // This reference is used to reset the form
  const fileInputRef = React.useRef();
  const [fileName, setFileName] = useState('');
  const [showTextField1, setShowTextField1] = useState(false);
  const [showTextField2, setShowTextField2] = useState(false);
  const [showTextField3, setShowTextField3] = useState(false);
  const [customTypeDescription, setCustomTypeDescription] = useState('');
  const [customLocatedDescription, setCustomLocatedDescription] = useState('');
  const [customDescriptionDescription, setCustomDescriptionDescription] = useState('');
  const [type, setType] = useState(bridge.getInitialValue('type'));
  const [located, setLocated] = useState(bridge.getInitialValue('located'));
  const [describe, setDescribe] = useState(bridge.getInitialValue('describe'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    fRef.current.reset();
    setImageFile(null); // Reset the imageFile state
    setFileName(''); // Reset filename state
    setCustomTypeDescription(''); // Reset the state
    setCustomLocatedDescription(''); // Reset the state
    setCustomDescriptionDescription(''); // Reset the state
    setType('');
    setLocated('');
    setDescribe('');
    setShowTextField1(false);
    setShowTextField2(false);
    setShowTextField3(false);
  };
  const submit = (data) => {
    if (isSubmitting) return;
    console.log('Type', type);
    const { island, image } = data;
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
      isUnique = Events.collection.countDocuments({ DFG_ID: proposedID });
    } while (!isUnique);

    DFG_ID += proposedID; // id_main 9 characters
    // 0 if no further subcategories exist
    DFG_ID += '00000'; // id_part_1
    DFG_ID += '0000'; // id_part_2
    DFG_ID += '000'; // id_part_3
    DFG_ID += '000'; // id_part_4
    DFG_ID += '000'; // id_part_5
    DFG_ID += '000'; // id_part_6

    const owner = Meteor.user() ? Meteor.user().username : 'anonymous';

    if (imageFile) {
      setIsSubmitting(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileContent = reader.result.split(',')[1];

        Meteor.call('uploadFile', fileContent, imageFile.name, imageFile.type, (error, response) => {
          if (error) {
            console.error('Error during image upload', error);
            setIsSubmitting(false);
          } else {
            console.log('Image uploaded successfully at', response);

            // Add Image URL to the data
            // eslint-disable-next-line no-param-reassign
            data.image = response;

            Events.collection.insert({ type, located, describe, island, owner, DFG_ID, image: response, customTypeDescription, customLocatedDescription, customDescriptionDescription }, () => {
              if (error) {
                swal('Error', error.message, 'error').finally(() => {});
              } else {
                swal('Success', 'Item added successfully', 'success').finally(() => {});
                setImageFile(null); // Reset the imageFile state
              }
              setIsSubmitting(false);
            });
          }
          resetForm();
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      Events.collection.insert({ type, located, describe, island, owner, DFG_ID, image, customTypeDescription, customLocatedDescription, customDescriptionDescription }, (error) => {
        if (error) {
          swal('Error', error.message, 'error').finally(() => {});
        } else {
          swal('Success', 'Item added successfully', 'success').finally(() => {});
          fRef.current.reset();
        }
      });
      resetForm();
    }
  };

  const handleCapture = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFileName(file.name);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleCustomTypeDescriptionChange = (event) => {
    // Update the state with the entered text
    const customValue = event.target.value;
    setCustomTypeDescription(String(customValue));
    // setType(customValue);
  };

  const handleCustomLocatedChange = (event) => {
    // Update the state with the entered text
    const customValue = event.target.value;
    setCustomLocatedDescription(String(customValue));
    // setType(customValue);
  };

  const handleCustomDescriptionChange = (event) => {
    // Update the state with the entered text
    const customValue = event.target.value;
    setCustomDescriptionDescription(String(customValue));
    // setType(customValue);
  };

  const handleSelectChange1 = (value) => {
    console.log('Selected value:', value);
    // Check against the actual option values
    if (value === 'Other') {
      setShowTextField1(true);
      setType(value);
      console.log('Selected value:', value);
    } else {
      setShowTextField1(false);
      setType(value);
    }
  };

  const handleSelectChange2 = (value) => {
    console.log('Selected value:', value);
    // Check against the actual option values
    if (value === 'Other') {
      setShowTextField2(true);
      setLocated(value);
      console.log('Selected value:', value);
    } else {
      setShowTextField2(false);
      setLocated(value);
    }
  };

  const handleSelectChange3 = (value) => {
    console.log('Selected value:', value);
    // Check against the actual option values
    if (value === 'Other') {
      setShowTextField3(true);
      setDescribe(value);
      console.log('Selected value:', value);
    } else {
      setShowTextField3(false);
      setDescribe(value);
    }
  };

  let buttonText;
  if (fileName) {
    buttonText = `Change Image (Selected: ${fileName})`;
  } else {
    buttonText = isMobileDevice() ? 'Take Photo' : 'Upload Image';
  }

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
                <SelectField name="type" label="I FOUND/LOCATED THE FOLLOWING" onChange={(value) => handleSelectChange1(value)} value={type} />
                {showTextField1 && (
                  <Form.Group controlId="otherDescription">
                    <Form.Label>Please enter your own description of the type of debris found:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Other - please explain"
                      value={customTypeDescription}
                      onChange={(value) => handleCustomTypeDescriptionChange(value)}
                    />
                  </Form.Group>
                )}
                <SelectField name="located" label="THIS DEBRIS IS LOCATED" onChange={(value) => handleSelectChange2(value)} value={located} />
                {showTextField2 && (
                  <Form.Group controlId="other">
                    <Form.Label>If located offshore, enter latitude and longitude (i.e. 21.3161 -157.8906) or provide a position description and any information on currents and winds that could help in relocating the debris.:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Other - Please explain"
                      value={customLocatedDescription}
                      onChange={(value) => handleCustomLocatedChange(value)}
                    />
                  </Form.Group>
                )}

                <SelectField name="describe" label="THE DEBRIS IS BEST DESCRIBED AS:" onChange={(value) => handleSelectChange3(value)} value={describe} />
                {showTextField3 && (
                  <Form.Group controlId="other">
                    <Form.Label>
                      Enter custom description of the debris:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Other - Please describe"
                      value={customDescriptionDescription}
                      onChange={(value) => handleCustomDescriptionChange(value)}
                    />
                  </Form.Group>
                )}

                <SelectField name="island" label="If on land or in the nearshore waters - indicate which island" />
                <input
                  type="file"
                  accept="image/*"
                  capture="camera"
                  onChange={handleCapture}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <Button
                  variant={fileName ? 'outline-secondary' : 'secondary'}
                  onClick={handleClick}
                >
                  {buttonText}
                </Button>
                <SubmitField style={{ display: 'none' }} />
                <div style={{ paddingTop: 10 }}>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      &nbsp;Uploading...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>

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
