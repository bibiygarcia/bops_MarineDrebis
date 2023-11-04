import React from 'react';
import HomeMiddle from '../components/HomeMiddle';
import HomeCarousel from '../components/HomeCarousel';
import IslandMap from '../components/IslandMap';

const HomeCivilian = () => (
  <div className="d-flex flex-column min-vh-100">
    <HomeMiddle />
    <HomeCarousel />
    <IslandMap />
  </div>
);

export default HomeCivilian;
