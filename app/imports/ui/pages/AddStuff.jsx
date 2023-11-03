import React, { useState, useRef } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Stuffs } from '../../api/stuff/Stuff';

const formSchema = new SimpleSchema({
  name: String,
  quantity: Number,
  condition: {
    type: String,
    allowedValues: ['excellent', 'good', 'fair', 'poor'],
    defaultValue: 'good',
  },

  image: {
    type: String,
    optional: true,
  },
});

const bridge = new SimpleSchema2Bridge(formSchema);

const AddStuff = () => {
  const [imageFile, setImageFile] = useState(null); // State hook for the image file
  const fRef = useRef(null); // This reference is used to reset the form
  const submit = (data) => {
    const { name, quantity, condition } = data;

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
            data.image = response;

            Stuffs.collection.insert({ name, quantity, condition, owner, DFG_ID, image: response }, (error) => {
              if (error) {
                swal('Error', error.message, 'error');
              } else {
                swal('Success', 'Item added successfully', 'success');
                setImageFile(null);
                fRef.current.reset();
              }
            });
          }
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      Stuffs.collection.insert({ name, quantity, condition, owner, DFG_ID }, (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
        }
      });
    }
  };

  const handleCapture = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Add Stuff</h2></Col>
          <AutoForm schema={bridge} onSubmit={submit} ref={fRef}>
            <Card>
              <Card.Body>
                <TextField name="name" />
                <NumField name="quantity" decimal={null} />
                <SelectField name="condition" />
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

export default AddStuff;
