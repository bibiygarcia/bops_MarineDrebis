import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

const OtherSubmit = () => (
  <Container className="p-5">
    <Row>
      <Col className="p-2">
        <h4>Help Us Keep Our Oceans and Beaches Clean</h4>
        <h5>Report Debris To Support Hawai&apos;i</h5>
        <p>
          Help us report trash and other debris you find by land and sea!
          We&apos;ll send someone to clean up debris, free of charge! Report and make a difference. Every pound of trash we remove from the environment is another life saved.
        </p>
        <div className=" p-2 d-grid gap-2">
          <Button variant="danger" href="/" size="lg">
            Report Debris
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
);

export default OtherSubmit;
