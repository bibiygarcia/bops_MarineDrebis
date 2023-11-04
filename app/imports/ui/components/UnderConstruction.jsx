import React from 'react';
import { ConeStriped } from 'react-bootstrap-icons';
import { Col, Container, Image, Row } from 'react-bootstrap';

const UnderConstruction = () => (
  <Container className="py-lg-5">
    <Row className="py-lg-5">
      <h1 className="text-center ts-1"><ConeStriped /> UNDER CONSTRUCTION <ConeStriped /></h1>
      <h2 className="text-center">
        <br /> Important text is important.
        <br /> This message is sponsored by your local bibs.
      </h2>
    </Row>
    <Row sm={1} md={2} lg={3} className="py-lg-5">
      <Col className="py-sm-2">
        <Image src="images/noTextLogoPNG.png" height={250} />
      </Col>
      <Col className="py-sm-2">
        <h3>BOPS</h3>
        <hr />
        {/* eslint-disable-next-line react/no-unescaped-entities,max-len */}
        <p> This is a Hawaii Annual Coding Challenge (HACC) 2023 submission for the Center of Marine Debris Research, ran by Hawai'i Pacific University. The request is described as, "Large marine debris reporting, dispatching, documenting platform". </p>
      </Col>
      <Col className="py-sm-2">
        <h3>Team Members</h3>
        <hr />
        Bibiana Garcia (Captain)
        <br />
        Omar Zaidi
        <br />
        Princess Rose Balasico
        <br />
        Samantha Rose Reed
        <br />
        Heinrich Maertens
      </Col>
    </Row>
  </Container>
);

export default UnderConstruction;
