import React from 'react';
import HomeCarousel from '../components/HomeCarousel';
import HomeSubmit from '../components/HomeSubmit';
import HomeClosingBanner from '../components/HomeClosingBanner';

const HomeCiv = () => (
  <div className="d-flex flex-column min-vh-100">
    <HomeCarousel />
    <HomeSubmit />
    <HomeClosingBanner />
  </div>
);

export default HomeCiv;
