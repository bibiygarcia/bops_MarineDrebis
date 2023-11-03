import React from 'react';
import { Col, Container } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router';
import { Stuffs } from '../../api/stuff/Stuff';
import LoadingSpinner from '../components/LoadingSpinner';
import QRCode from '../components/QRCode';

/* Renders the EditStuff page for editing a single document. */
const QR = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditStuff', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Stuffs.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Stuffs.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);

  const curItem = Stuffs.collection.findOne(_id);
  console.log(curItem);
  let dfg;
  let curName;
  if (curItem && 'DFG_ID' in curItem) {
    dfg = curItem.DFG_ID;
    curName = curItem.name;
  } else {
    console.log('DFG_ID is not a property of the returned document.');
  }

  return ready ? (
    <Container className="py-3">
      <Col className="d-flex flex-column text-center align-items-center">
        <h2 className="section-to-print">
          QR code for {curName}{' '}
          <span style={{ color: 'gray' }}>({dfg.replace(/0+$/, '')})</span>
        </h2>
        <div className="section-to-print" style={{ height: '256px' }}>
          <QRCode value={dfg} size={256} />
        </div>
        <button style={{ width: '256px' }} className="btn btn-primary" onClick={() => window.print()}>Print QR code</button>
      </Col>
    </Container>
  ) : <LoadingSpinner />;
};

export default QR;
