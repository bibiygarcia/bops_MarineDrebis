import React, { useState } from 'react';
import { Col, Container, Image, Row, Table } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Stuffs } from '../../api/stuff/Stuff';
import QRCodeScanner from '../components/QRCodeScanner';

const Scan = () => {
  const [qrCodeData, setQrCodeData] = useState(null);

  const handleCodeDetected = (data) => {
    console.log('QR code data received in Scan: ', data);
    setQrCodeData(data);
  };

  const { isLoading, stuffDocument } = useTracker(() => {
    const noDataAvailable = { stuffDocument: null };
    if (!Meteor.user()) {
      return { ...noDataAvailable, isLoading: false };
    }
    const handler = Meteor.subscribe(Stuffs.userPublicationName);
    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const stuffDocument = Stuffs.collection.findOne({ trackCMDR: qrCodeData });

    console.log('Fetched document: ', stuffDocument); // log your document here
    return { isLoading: false, stuffDocument };
  });

  return (
    <Container id="scan-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
          <Image roundedCircle src="/images/meteor-logo.png" width="150px" />
        </Col>

        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>QR Scanner</h1>
          {!qrCodeData && <><p>Please hold the QR code in front of the camera</p><QRCodeScanner onCodeDetected={handleCodeDetected} /></>}
          {qrCodeData && (
            <><p>Scanned QR Code is: {qrCodeData}</p>
              {isLoading ? 'Loading data...' :
                stuffDocument && (
                  <Table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Owner</th>
                        <th>Condition</th>
                        <th>Track CMDR</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={stuffDocument._id}>
                        <td>{stuffDocument.name}</td>
                        <td>{stuffDocument.quantity}</td>
                        <td>{stuffDocument.owner}</td>
                        <td>{stuffDocument.condition}</td>
                        <td>{stuffDocument.trackCMDR}</td>
                      </tr>
                    </tbody>
                  </Table>
                )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Scan;
