import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

const HomeClosingBanner = () => (
  <Container className="pb-lg-5">
    <Row className="text-center pb-lg-4">
      <h2><strong>Clean the ocean, help the planet</strong></h2>
    </Row>
    <Row className="pb-lg-4">
      <Col className="py-sm-2">
        <Image fluid src="images/MultiLayers.png" />
      </Col>
      <Col className="py-sm-2">
        <Image fluid src="images/MultiLayers.png" />
      </Col>
      <Col className="py-sm-2">
        <Image fluid src="images/MultiLayers.png" />
      </Col>
      <Col className="py-sm-2">
        <Image fluid src="images/MultiLayers.png" />
      </Col>
    </Row>
    <Row className="text-center">
      <h2><strong>Join the movement today</strong></h2>
    </Row>
  </Container>
);

export default HomeClosingBanner;
