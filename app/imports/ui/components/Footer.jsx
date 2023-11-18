import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { ChatQuote } from 'react-bootstrap-icons';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3 bg-dark">
    <Container>
      <Row className="p-2">
        <Col className="text-center">
          <h3>Repport <ChatQuote /></h3>
          <h5>Report Debris, Support Hawai&apos;i</h5>
          Supporting Hawai&apos;i in the efforts against pollution since 2023.
          <br />
          <hr />
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <h4>Temporary Links</h4>
          <a href="/organization-signin">Organization Sign In</a>
          <br />
          <a href="/organization-signup">Organization Sign Up</a>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
