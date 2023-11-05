import React from 'react';
import { Container } from 'react-bootstrap';
import HomeClosingBanner from '../components/HomeClosingBanner';
import OtherSubmit from '../components/OtherSubmit';

const DebrisMap = () => (
  <div className="d-flex flex-column min-vh-100 text-center">
    <OtherSubmit />
    <Container className=" py-lg-3 text-center justify-content-center">
      <iframe
        title="MAPLINE"
        src="https://app.mapline.com/map/map_446dbb16/eVV2bnVieXZEUWlqZUJ6bXU2d3pEcFZNa1JlNUxVdXc0UWhLUE"
        allow="geolocation *"
        height={500}
        width="100%"
      />
      <div>
        <a href="https://mapline.com" target="_blank" rel="noreferrer">Mapping by Mapline</a>
      </div>
    </Container>
    <HomeClosingBanner />
  </div>
);

export default DebrisMap;
