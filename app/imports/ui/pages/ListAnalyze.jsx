import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Events } from '../../api/debris/Event';
import LoadingSpinner from '../components/LoadingSpinner';
import { Samples } from '../../api/debris/Sample';
import AnalysisPieChart from '../components/AnalysisPieChart';
import AnalysisItems from '../components/AnalysisItem';

const ListAnalysis = () => {
  const { _id } = useParams();
  const { ready, events, samples } = useTracker(() => {
    const subscription = Meteor.subscribe(Events.analysis);
    const subscriptionSamples = Meteor.subscribe(Samples.analysis);

    const rdy = subscription.ready() && subscriptionSamples.ready();

    const analysisItemsStuffs = Events.collection.find().fetch();
    const analysisItemsSamples = Samples.collection.find().fetch();
    const doc = Events.collection.findOne(_id);

    return {
      events: analysisItemsStuffs,
      samples: analysisItemsSamples,
      ready: rdy,
      document: doc,
    };
  }, [_id]);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={9}>
          <Col className="text-center">
            <h2>Lab: Collected Samples</h2>
            <p>Any sample that you have logged will be displayed here. You can view them in more detail, record properties, and log subsamples and components.</p>
          </Col>
          <Container>
            <h3>DFG Events with Recorded Samples</h3>

            {events.map((event) => <AnalysisItems key={event._id} event={event} samples={samples} />)}

          </Container>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={9}>
          <AnalysisPieChart />
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListAnalysis;
