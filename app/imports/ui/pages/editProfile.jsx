import { Card, Col, Container, Row } from 'react-bootstrap';
import {
  AutoForm,  TextField, LongTextField, SelectField, SubmitField,
} from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import React from 'react';




const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the Page for adding a document. */
const EditProfile = () => {
  const [emailState, setEmailState] = useState('');

  /* On submit, try to insert the data. If successful, reset the form. */
  const submit = (data, formRef) => {
    let insertError;
    const {
      firstName, lastName, email, bio, password,
    } = data;
    EditProfile.insert(
      {
        firstName, lastName, email, bio, password
      },
      (error) => { insertError = error; },
    );
    if (insertError) {
      swal('Error', insertError.message, 'error');
    } else {
        swal('Success', 'Profile record was created.', 'success');
        setEmail(email);
        formRef.reset();
      }
    }
  };
  const transform = (label) => ` ${label}`;

  /* Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  let fRef = null;
  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <h2 className="text-center">Edit Profile</h2>
          <AutoForm ref={(ref) => { fRef = ref; }} schema={bridge} onSubmit={(data) => submit(data, fRef)}>
            <Card className="p-2">
              <Row>
                <Col><TextField name="firstName" showInlineError placeholder="Change First Name" /></Col>
                <Col><TextField name="lastName" showInlineError placeholder="Change Last Name" /></Col>
                <Col><TextField name="email" showInlineError placeholder="Change Email" /></Col>
                <Col><TextField name="bio" showInlineError placeholder="Change Bio" /></Col>
                <Col><TextField name="password" showInlineError placeholder="Change Password" /></Col>
              </Row>
              <LongTextField name="bio" showInlineError placeholder="A bit about you" />
              <Row>
                <Col>
                  <SelectField
                    name="state"
                    showInlineError
                    help="What state do you live in? (required)"
                    helpClassName="text-danger"
                  />
                </Col>
              </Row>
              <SubmitField value="Submit" />
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );


export default EditProfile;
