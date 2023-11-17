import React from 'react';
import { Container } from 'react-bootstrap';
import UnderConstruction from '../components/UnderConstruction';
import HomeClosingBanner from '../components/HomeClosingBanner';
import DebrisMap from '../components/DebrisMap';

const LandingOrganization = () => (
  <Container className="p-1 d-grid">
    <DebrisMap />
    <UnderConstruction />
    <HomeClosingBanner />
  </Container>
);

export default LandingOrganization;
