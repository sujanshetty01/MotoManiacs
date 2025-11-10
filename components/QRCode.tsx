import React, { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 200, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCodeLib.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch((err) => {
        console.error('Error generating QR code:', err);
      });
    }
  }, [value, size]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas ref={canvasRef} className="rounded-lg border-2 border-gray-200 dark:border-gray-700" />
    </div>
  );
};

export default QRCode;

