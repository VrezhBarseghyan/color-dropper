import React, { useState, useRef } from 'react';
import styles from '../Styles.module.css';

const Pencil = ({ pickedColor }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
  
    const startDrawing = () => {
      setIsDrawing(true);
    };
  
    const stopDrawing = () => {
      setIsDrawing(false);
    };
  
    const drawOnCanvas = (event) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = pickedColor;
  
      ctx.lineTo(x, y);
      ctx.stroke();
    };
  
    return (
      <div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={isDrawing ? drawOnCanvas : null}
          className={styles.canvas}
        ></canvas>
      </div>
    );
  };

  export default Pencil;