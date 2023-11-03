import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const QRCodeScanner = ({ onCodeDetected }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturing, setCapturing] = useState(true); // Add a state to control the capturing process

  const capture = React.useCallback(() => {
    if (!capturing) return;

    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      const image = new Image();
      image.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          console.log('Found QR code', code.data);
          onCodeDetected(code.data); // Send the detected code data to the parent component
          setCapturing(false); // Stop capturing images
        }
      };
      image.src = imageSrc;
    }
  }, [webcamRef, canvasRef, capturing, onCodeDetected]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      capture();
    }, 100);

    return () => clearInterval(intervalId);
  }, [capture]);

  return (
    <div>
      {capturing ? ( // Show webcam only when capturing
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
      ) : null}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default QRCodeScanner;
