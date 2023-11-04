import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-dark">
    <Container>
      <Row>
        <Col>
          <h4>Temporary Links</h4>
          <a href="/">Civilian Home</a>
          <br />
          <a href="/org">Organization Home</a>
        </Col>
        <Col className="text-center">
          Department of Information and Computer Sciences
          {' '}
          <br />
          University of Hawaii
          <br />
          Honolulu, HI 96822
          {' '}
          <br />
          <a href="http://ics-software-engineering.github.io/meteor-application-template-react">
            Template Home
            Page
          </a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
