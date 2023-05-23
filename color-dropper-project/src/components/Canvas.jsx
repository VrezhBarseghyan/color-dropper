import React, { useState, useRef, useEffect } from 'react';
import styles from '../Styles.module.css';
import ColorPicker from './ColorPicker';
import ColorPreview from './ColorPreview';
import ImageUploader from './ImageUploader';
import PencilTool from './PencilTool';

const Canvas = () => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [colorPickerEnabled, setColorPickerEnabled] = useState(false);
  const [pickedColor, setPickedColor] = useState('');
  const [hoveredColor, setHoveredColor] = useState('');
  const [leftColor, setLeftColor] = useState('');
  const [topColor, setTopColor] = useState('');
  const [rightColor, setRightColor] = useState('');
  const [bottomColor, setBottomColor] = useState('');
  const [pencilEnabled, setPencilEnabled] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      const [r, g, b] = imageData.data;
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
      const [r, g, b] = imageData.data;
      const hex = rgbToHex(r, g, b);
      setHoveredColor(hex);
      setMousePosition({ x: event.clientX, y: event.clientY });

      // Get the colors of the adjacent pixels
      const imageDataLeft = ctx.getImageData(x - 1, y, 1, 1).data;
      const imageDataTop = ctx.getImageData(x, y - 1, 1, 1).data;
      const imageDataRight = ctx.getImageData(x + 1, y, 1, 1).data;
      const imageDataBottom = ctx.getImageData(x, y + 1, 1, 1).data;

      const hexLeft = rgbToHex(imageDataLeft[0], imageDataLeft[1], imageDataLeft[2]);
      const hexTop = rgbToHex(imageDataTop[0], imageDataTop[1], imageDataTop[2]);
      const hexRight = rgbToHex(imageDataRight[0], imageDataRight[1], imageDataRight[2]);
      const hexBottom = rgbToHex(imageDataBottom[0], imageDataBottom[1], imageDataBottom[2]);

      // Update the colors of the adjacent pixels
      setLeftColor(hexLeft);
      setTopColor(hexTop);
      setRightColor(hexRight);
      setBottomColor(hexBottom);
    }

    if (pencilEnabled && isDrawing) {
      drawOnCanvas(event);
    }
  };

  const handleMouseOut = () => {
    setHoveredColor('');
    setLeftColor('');
    setTopColor('');
    setRightColor('');
    setBottomColor('');
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

    if (!isDrawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const togglePencil = () => {
    setPencilEnabled(!pencilEnabled);
  };

  const startDrawing = () => {
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
  };

  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  const surroundingSquares = {
    left: { left: mousePosition.x - 30, top: mousePosition.y - 10 },
    top: { left: mousePosition.x - 10, top: mousePosition.y - 30 },
    right: { left: mousePosition.x + 10, top: mousePosition.y - 10 },
    bottom: { left: mousePosition.x - 10, top: mousePosition.y + 10 },
  };

  return (
    <div className={styles.canvasContainer}>
      <ImageUploader handleImageUpload={handleImageUpload} />

      <div>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          className={styles.canvas}
        ></canvas>

        {/* Render the surrounding squares */}
        {colorPickerEnabled && (
        <>
            <div
            className={`${styles.hoveredColorPreview} ${styles.squareLeft}`}
            style={{
                left: surroundingSquares.left.left,
                top: surroundingSquares.left.top,
                backgroundColor: leftColor,
            }}
            ></div>
            <div
            className={`${styles.hoveredColorPreview} ${styles.squareTop}`}
            style={{
                left: surroundingSquares.top.left,
                top: surroundingSquares.top.top,
                backgroundColor: topColor,
            }}
            ></div>
            <div
            className={`${styles.hoveredColorPreview} ${styles.squareCenter}`}
            style={{
                left: mousePosition.x - 10,
                top: mousePosition.y - 10,
                backgroundColor: hoveredColor,
            }}
            ></div>
            <div
            className={`${styles.hoveredColorPreview} ${styles.squareRight}`}
            style={{
                left: surroundingSquares.right.left,
                top: surroundingSquares.right.top,
                backgroundColor: rightColor,
            }}
            ></div>
            <div
            className={`${styles.hoveredColorPreview} ${styles.squareBottom}`}
            style={{
                left: surroundingSquares.bottom.left,
                top: surroundingSquares.bottom.top,
                backgroundColor: bottomColor,
            }}
            ></div>
        </>
        )}

      </div>

      <button onClick={() => setColorPickerEnabled(!colorPickerEnabled)}>
        {colorPickerEnabled ? 'Disable Color Picker' : 'Enable Color Picker'}
      </button>

      <ColorPreview pickedColor={pickedColor} />

      <PencilTool
        pencilEnabled={pencilEnabled}
        pickedColor={pickedColor}
        togglePencil={togglePencil}
      />
    </div>
  );
};

export default Canvas;
