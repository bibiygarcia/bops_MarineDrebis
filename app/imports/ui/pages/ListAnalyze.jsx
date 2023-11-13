import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Col, Container, Row, Table, Button, Card, Collapse } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { Debris } from '../../api/debris/Debris';
import LoadingSpinner from '../components/LoadingSpinner';
import { Samples } from '../../api/debris/Sample';
import { Subsamples } from '../../api/debris/Subsample';

const AnalysisItems = ({ debris, samples }) => {
  const [open, setOpen] = useState(false);
  const [showSubsamples, setShowSubsamples] = useState({});
  const navigate = useNavigate();

  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/details/${debris._id}`);
  };

  // Action for "Split" button
  const handleSplitClick = () => {
    navigate(`/split/${debris._id}`);
  };

  const relevantSamples = samples.filter(sample => debris.sampleIds.includes(sample._id));

  const { subsamples } = useTracker(() => {
    const subsamplesSubscription = Meteor.subscribe(Subsamples.analysis);

    const rdy = subsamplesSubscription.ready();

    const analysisItemsSubsamples = Subsamples.collection.find().fetch();

    return {
      subsamples: analysisItemsSubsamples,
      ready: rdy,
    };
  }, []);

  const protocolNames = {
    1: 'Measure and Dispose',
    2: 'Four Corners',
    3: 'One of All',
    4: 'Hybrid',
    5: 'Disentanglement',
    6: 'Reverse Engineer',
  };
  const protocolName = protocolNames[debris.protocol];

  const toggleSubsamples = (sampleId) => {
    setShowSubsamples(prevState => ({
      ...prevState,
      [sampleId]: !prevState[sampleId],
    }));
  };

  const sampleCount = debris && debris.sampleIds ? debris.sampleIds.length : 'error';
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{debris.name}</Card.Title>
        <Row>
          <Col>This event has {sampleCount} sample{sampleCount > 1 ? 's' : ''} so far. Following the <b>{protocolName}</b> protocol.</Col>
        </Row>
        <Row>
          <Col className="text-right">
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="example-collapse-text"
              aria-expanded={open}
            >
              {open ? 'Close Samples' : 'Show Samples'}
            </Button>
          </Col>
        </Row>
        <Collapse in={open}>
          <div id="example-collapse-text">
            <Table>
              {/* Table code for samples comes here */}
              <thead>
              <tr>
                <th>Sample ID</th>
                <th>Name</th>
                <th>_id</th>
              </tr>
              </thead>
              <tbody>
              {relevantSamples.map((sample) => {
                const { sample_id: sampleId, name: sampleName, _id: sample_Id, subsampleIds = [] } = sample;
                const isOpen = showSubsamples[sampleId] || false;

                const relevantSubsamples = subsamples.filter(subsample => subsampleIds.includes(subsample._id));

                return (
                  <React.Fragment key={sampleId}>
                    <tr>
                      <td>{sampleId}</td>
                      <td>{sampleName}</td>
                      <td>{sample_Id}</td>
                      <td>
                        <Button
                          onClick={() => toggleSubsamples(sampleId)}
                          aria-controls={`subsample-collapse-${sampleId}`}
                          aria-expanded={isOpen}
                        >
                          {isOpen ? 'Hide Subsamples' : `Show Subsamples (${subsamples.length})`}
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4">
                        <Collapse in={isOpen}>
                          <div id={`subsample-collapse-${sampleId}`}>
                            <Table>
                              <thead>
                              <tr>
                                <th>Subsample ID</th>
                                <th>_id</th>
                              </tr>
                              </thead>
                              <tbody>
                              {relevantSubsamples.map((subsample) => {
                                const { subample_id: subsampleId, name: subsampleName, _id: subsample_Id = [] } = subsample;
                                return (
                                  <tr key={subsample_Id}>
                                    <td>{subsampleId}</td>
                                    <td>{subsampleName}</td>
                                    <td>{subsample_Id}</td>
                                  </tr>
                                );
                              })}
                              </tbody>
                            </Table>

                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
              </tbody>
            </Table>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

const ListAnalysis = () => {
  const { _id } = useParams();
  const { ready, debris, samples } = useTracker(() => {
    const subscription = Meteor.subscribe(Debris.analysis);
    const subscriptionSamples = Meteor.subscribe(Samples.analysis);

    const rdy = subscription.ready() && subscriptionSamples.ready();

    const analysisItemsDebris = Debris.collection.find().fetch();
    const analysisItemsSamples = Samples.collection.find().fetch();
    const doc = Debris.collection.findOne(_id);

    return {
      debris: analysisItemsDebris,
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

            {debris.map((debris) => <AnalysisItems key={debris._id} debris={debris} samples={samples} />)}

          </Container>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListAnalysis;
