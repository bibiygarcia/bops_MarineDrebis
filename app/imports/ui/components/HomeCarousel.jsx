import React from 'react';
import { Carousel, Container, Image } from 'react-bootstrap';

/* Images should be at max 1000 px in width
*  and 300 px in height preferably */
const HomeCarousel = () => (
  <Carousel id="CarouselSlides" className="pt-sm-5 d-grid" lg={5}>
    <Carousel.Item>
      <Container className="d-grid justify-content-center small" title="MultiLayers">
        <Image
          src="images/AdobeStock_620088765_Preview.png"
          alt="AdobeStock_620088765_Preview.jpeg"
        />
      </Container>
      <Carousel.Caption>
        <h3>Make a Difference Today</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <Container className="d-grid justify-content-center small" title="MultiLayers">
        <Image
          src="images/AdobeStock_623981730_Preview.png"
          alt="AdobeStock_623981730_Preview.jpeg"
        />
      </Container>
      <Carousel.Caption>
        <h3>Sign Up for Volunteer Events</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </Carousel.Caption>
    </Carousel.Item>

  </Carousel>
);

export default HomeCarousel;
