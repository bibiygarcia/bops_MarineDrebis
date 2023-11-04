import React from 'react';
import { Carousel, Container, Image } from 'react-bootstrap';

const HomeCarousel = () => (
  <Carousel className="pt-lg-5">
    <Carousel.Item>
      <Container className="d-grid justify-content-center small" title="MultiLayers">
        <Image
          src="images/MultiLayers.png"
          alt="MultiLayers.png"
          height={300}
          width={1000}
        />
      </Container>
      <Carousel.Caption>
        <h3>First slide label</h3>
        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
      </Carousel.Caption>
    </Carousel.Item>
    <Carousel.Item>
      <Container className="d-grid justify-content-center small" title="MultiLayers">
        <Image
          src="images/MultiLayers.png"
          alt="MultiLayers.png"
          height={300}
          width={1000}
        />
      </Container>
      <Carousel.Caption>
        <h3>Second slide label</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </Carousel.Caption>
    </Carousel.Item>
  </Carousel>
);

export default HomeCarousel;
