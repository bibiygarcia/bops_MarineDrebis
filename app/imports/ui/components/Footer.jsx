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
        <Col>
          <h4>Temporary Links</h4>
          <a href="/">Civilian Home</a>
          <br />
          <a href="/org">Organization Home</a>
          <br />
          <a href="/map">Debris Map</a>
          <br />
          <a href="/profile">See My Profile</a>
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
