import React from 'react';
import UnderConstruction from '../components/UnderConstruction';
import DebrisMap from './DebrisMap';

const LandingOrganization = () => (
  <div className="d-flex flex-column min-vh-100">
    <DebrisMap />
    <UnderConstruction />
  </div>
);

export default LandingOrganization;
