import React from 'react';
import { Button, Col, Container, Image, Row } from 'react-bootstrap';

const HomeSubmit = () => (
  <Container className="p-lg-5">
    <Row sm={1} lg={2}>
      <Col className="py-sm-2">
        <Image fluid src="images/Turtle-in-Marine-Debris.png" alt="https://www.deeperblue.com/noaa-seeks-comments-for-upcoming-marine-debris-strategic-plan/" />
      </Col>
      <Col className="py-sm-2">
        <h4>You Can Help Us Keep Our Oceans and Beaches Clean. Report Debris To Support Hawai&apos;i!</h4>
        <p className="pb-1">
          Help us report trash and other debris you find by land and sea!
          We&apos;ll send someone to clean up debris, free of charge! Report and make a difference. Every pound of trash we remove from the environment is another life saved.
        </p>
        <div className="d-grid gap-2">
          <Button variant="danger" href="/">
            Report Debris
          </Button>
        </div>
      </Col>
    </Row>
  </Container>
);

export default HomeSubmit;
