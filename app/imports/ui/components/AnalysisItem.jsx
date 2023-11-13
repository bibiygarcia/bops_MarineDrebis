import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Collapse, Row, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Subsamples } from '../../api/stuff/Subsample';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from './LoadingSpinner';

const AnalysisItems = ({ stuff, samples }) => {
  const [open, setOpen] = useState(false);
  const [showSubsamples, setShowSubsamples] = useState({});

  let relevantSamples;

  const { ready, subsamples } = useTracker(() => {
    const subscriptionEvent = Meteor.subscribe(Stuffs.stored);
    const subsamplesSubscription = Meteor.subscribe(Subsamples.analysis);

    const rdy = subscriptionEvent.ready() && subsamplesSubscription.ready();

    const analysisItemsEvent = Stuffs.collection.find().fetch();
    const analysisItemsSubsamples = Subsamples.collection.find().fetch();

    return {
      stuffs: analysisItemsEvent,
      subsamples: analysisItemsSubsamples,
      ready: rdy,
    };
  }, []);

  if (stuff && stuff.sampleIds) {
    relevantSamples = samples.filter(sample => stuff.sampleIds.includes(sample._id));
  }

  const protocolNames = {
    1: 'Measure and Dispose',
    2: 'Four Corners',
    3: 'One of All',
    4: 'Hybrid',
    5: 'Disentanglement',
    6: 'Reverse Engineer',
  };
  const protocolName = protocolNames[stuff.protocol];

  const toggleSubsamples = (sampleId) => {
    setShowSubsamples(prevState => ({
      ...prevState,
      [sampleId]: !prevState[sampleId],
    }));
  };

  const sampleCount = stuff && stuff.sampleIds ? stuff.sampleIds.length : 'error';
  return (ready ? (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{stuff.name}</Card.Title>
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
  ) : <LoadingSpinner />);
};

AnalysisItems.propTypes = {
  stuff: PropTypes.shape({
    name: PropTypes.string.isRequired,
    protocol: PropTypes.number.isRequired,
    sampleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  samples: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    sample_id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    subsampleIds: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
};

export default AnalysisItems;
