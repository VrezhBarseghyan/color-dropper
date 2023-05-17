import React, { useState, useRef, useEffect } from 'react';
import styles from '../Styles.module.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [colorPickerEnabled, setColorPickerEnabled] = useState(false);
  const [pickedColor, setPickedColor] = useState('');
  const [hoveredColor, setHoveredColor] = useState('');
  const [pencilEnabled, setPencilEnabled] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    if (image) {
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [image]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleCanvasClick = (event) => {
    if (colorPickerEnabled) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b, a] = imageData.data;
      const hex = rgbToHex(r, g, b);
      setPickedColor(hex);
      setColorPickerEnabled(false);
      setHoveredColor('');
    }
  };

  const handleMouseMove = (event) => {
    if (colorPickerEnabled) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b, a] = imageData.data;
      const hex = rgbToHex(r, g, b);
      setHoveredColor(hex);
    }

    if (pencilEnabled && isDrawing) {
      drawOnCanvas(event);
    }
  };

  const handleMouseOut = () => {
    setHoveredColor('');
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

  const togglePencil = () => {
    setPencilEnabled(!pencilEnabled);
  };

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  return (
    <div className={styles.canvasContainer}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        className={styles.canvas}
      ></canvas>
      <button onClick={() => setColorPickerEnabled(!colorPickerEnabled)}>
        {colorPickerEnabled ? 'Disable Color Picker' : 'Enable Color Picker'}
      </button>
      <div>
        Picked Color: <span>{pickedColor}</span>
      </div>
      {hoveredColor && (
        <div>
          Hovered Color: <span>{hoveredColor}</span>
        </div>
      )}
      <button onClick={togglePencil} disabled={!pickedColor}>
        {pencilEnabled ? 'Disable Pencil' : 'Enable Pencil'}
      </button>
    </div>
  );
};

export default Canvas;
