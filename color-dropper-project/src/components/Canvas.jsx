import React, { useRef, useEffect } from 'react';
import styles from '../Styles.module.css';

const Canvas = () => {
    const canvasRef = useRef(null);
  
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
  
      const image = new Image();
      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = URL.createObjectURL(file);
    };
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
  
      // Customize the initial canvas appearance
      context.fillStyle = 'blue';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);
  
    return (
      <div className={styles.canvasContainer}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <canvas ref={canvasRef} width={400} height={400} />
      </div>
    );
  };
  
  export default Canvas;
