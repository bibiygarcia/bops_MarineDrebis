import React from 'react';
import { Container } from 'react-bootstrap';
import HomeCarousel from '../components/HomeCarousel';
import HomeSubmit from '../components/HomeSubmit';
import HomeClosingBanner from '../components/HomeClosingBanner';

const Landing = () => (
  <Container className="p-1 d-grid">
    <HomeCarousel />
    <HomeSubmit />
    <HomeClosingBanner />
  </Container>
);

export default Landing;
