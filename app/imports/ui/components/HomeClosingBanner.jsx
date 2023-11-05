import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

const HomeClosingBanner = () => (
  <Container className="">
    <Row className="pb-4 text-center">
      <h2><strong>Clean the Ocean, Help the Planet</strong></h2>
    </Row>
    <Row className="pb-4" xs={2} sm={4} med={4}>
      <Col className="p-1">
        <Image fluid src="images/AdobeStock_270833758_Preview.png" alt="AdobeStock_270833758_Preview.png" />
      </Col>
      <Col className="p-1">
        <Image fluid src="images/AdobeStock_280117452_Preview.png" alt="AdobeStock_280117452_Preview.png" />
      </Col>
      <Col className="p-1">
        <Image fluid src="images/AdobeStock_294464135_Preview.png" alt="AdobeStock_294464135_Preview.png" />
      </Col>
      <Col className="p-1">
        <Image fluid src="images/AdobeStock_642954921_Preview.png" alt="AdobeStock_642954921_Preview.png" />
      </Col>
    </Row>
    <Row className="pb-5 text-center">
      <h2><strong>Join Repport Today</strong></h2>
    </Row>
  </Container>
);

export default HomeClosingBanner;
