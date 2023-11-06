import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';

const AnalysisItems = ({ stuff }) => {
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${stuff._id}`);
  };

  // Action for "Split" button
  const handleSplitClick = () => {
    navigate(`/split/${stuff._id}`);
  };

  return (
    <tr>
      <td>{stuff.islandCollected}</td>
      <td>{stuff.nearestCity}</td>
      <td>{stuff.type}</td>
      <td>{stuff.located}</td>
      <td><Button onClick={handleDetailsClick}>Details</Button></td>
      <td><Button onClick={handleSplitClick}>Split</Button></td>
    </tr>
  );
};

const ListAnalysis = () => {
  const { ready, stuffs } = useTracker(() => {
    const subscription = Meteor.subscribe(Stuffs.analysis);
    const rdy = subscription.ready();
    const analysisItems = Stuffs.collection.find().fetch();

    return {
      stuffs: analysisItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={7}>
          <Col className="text-center">
            <h2>Lab: Collected Samples</h2>
            <p>Any sample that you have logged will be displayed here. You can view them in more detail, record properties, and log subsamples and components.</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Island Collected</th>
                <th>Nearest City</th>
                <th>Type</th>
                <th>Located</th>
                <th>Details</th>
                <th>Split</th>
              </tr>
            </thead>
            <tbody>
              {stuffs.map((stuff) => <AnalysisItems key={stuff._id} stuff={stuff} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListAnalysis;
