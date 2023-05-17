import React, { useRef, useEffect, useState } from 'react';
import ImageUploader from './ImageUploader';

const Canvas = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const scale = useRef(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [showHoveredColor, setShowHoveredColor] = useState(false);

  const handleImageUpload = (file) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        scale.current = 1; // Reset the scale
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = e.target.result;
      imageRef.current = image;
    };
    reader.readAsDataURL(file);
  };

  const handleColorPick = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const [r, g, b] = context.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(r, g, b);
    setSelectedColor(hexColor);
    setShowHoveredColor(false); // Hide hovered color after using it
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const [r, g, b] = context.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(r, g, b);
    if (showHoveredColor) {
      setHoveredColor(hexColor);
    }
  };

  const toggleHoveredColor = () => {
    setShowHoveredColor(!showHoveredColor);
  };

  const rgbToHex = (r, g, b) => {
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    const red = componentToHex(r);
    const green = componentToHex(g);
    const blue = componentToHex(b);
    return '#' + red + green + blue;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Customize the initial canvas appearance
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const handleClick = () => {
      setShowHoveredColor(false); // Hide hovered color when canvas is clicked
    };

    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div>
      <ImageUploader onImageUpload={handleImageUpload} />
      <div>
        <button onClick={toggleHoveredColor}>
          {showHoveredColor ? 'Hide Hovered Color' : 'Show Hovered Color'}
          
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onClick={handleColorPick}
        onMouseMove={handleMouseMove}
      />
      {selectedColor && <div>Selected Color: {selectedColor}</div>}
      {showHoveredColor && hoveredColor && <div>Hovered Color: {hoveredColor}</div>}
    </div>
  );
};

export default Canvas;
