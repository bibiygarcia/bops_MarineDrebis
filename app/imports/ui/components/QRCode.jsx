import React, { useEffect, useRef } from 'react';
import QRious from 'qrious';

const QRCode = ({ value, size }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const qr = new QRious({
        element: canvasRef.current,
        value: value,
        size: size,
      });
    }
  }, [value, size]);

  return <canvas ref={canvasRef} />;
};

export default QRCode;
