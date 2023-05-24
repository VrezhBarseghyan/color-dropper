import React, {useState, useRef, useEffect} from 'react';
import styles from '../Styles.module.css';
import ColorPreview from './ColorPreview';
import ImageUploader from './ImageUploader';
import PencilTool from './PencilTool';

const Canvas = () => {
    const squareGridRef = useRef(null);
    const canvasRef = useRef(null);
    const [image,
        setImage] = useState(null);
    const [colorPickerEnabled,
        setColorPickerEnabled] = useState(false);
    const [pickedColor,
        setPickedColor] = useState('');
    const [pencilEnabled,
        setPencilEnabled] = useState(false);
    const [isDrawing,
        setIsDrawing] = useState(false);
    const [mousePosition,
        setMousePosition] = useState({x: 0, y: 0});
    const [surroundingColors,
        setSurroundingColors] = useState([]);
    const [middleSquareIndex] = useState(40);

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

    useEffect(() => {
        if (colorPickerEnabled) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            const x = mousePosition.x - rect.left;
            const y = mousePosition.y - rect.top;
            const imageData = ctx
                .getImageData(x - 4, y - 4, 9, 9)
                .data;

            const colors = [];
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const hex = rgbToHex(r, g, b);
                colors.push(hex);
            }

            setSurroundingColors(colors);
        }
    }, [colorPickerEnabled, mousePosition]);

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
            const imageData = ctx
                .getImageData(x, y, 1, 1)
                .data;
            const [r,
                g,
                b] = imageData;
            const hex = rgbToHex(r, g, b);
            setPickedColor(hex);
            setColorPickerEnabled(false);
        }
    };

    const handleMouseMove = (event) => {
        if (colorPickerEnabled) {
            setMousePosition({x: event.clientX, y: event.clientY});
        }

        if (pencilEnabled && isDrawing) {
            drawOnCanvas(event);
        }
        if (colorPickerEnabled) {
            if (squareGridRef.current) {
                const squareGrid = squareGridRef.current;
                squareGrid
                    .classList
                    .add(`${styles.squareGrid}`);
                squareGrid.style.left = `${event.clientX - 52}px`;
                squareGrid.style.top = `${event.clientY - 138}px`;
            }
        }
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
        return `#${ ((1 << 24) | (r << 16) | (g << 8) | b)
            .toString(16)
            .slice(1)}`;
    };

    return (
        <div className={styles.canvasContainer}>
            <ImageUploader handleImageUpload={handleImageUpload}/>

            <div>
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    className={styles.canvas}></canvas>

            {colorPickerEnabled && (
                <div ref={squareGridRef} className={styles.colorPickerContainer}>
                    {[...Array(9)].map((_, row) => (
                        <div key={row} className={`${styles.squareRow}`}>
                            {[...Array(9)].map((_, col) => (
                                <div
                                    key={col}
                                    className={`${styles.surroundingSquare} ${row * 9 + col === middleSquareIndex
                                        ? styles.middleSquare
                                        : ''}`}
                                    style={{
                                        backgroundColor: surroundingColors[row * 9 + col]
                                    }}></div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            </div>

            <button onClick={() => setColorPickerEnabled(!colorPickerEnabled)}>
                {colorPickerEnabled
                    ? 'Disable Color Picker'
                    : 'Enable Color Picker'}
            </button>

            <ColorPreview pickedColor={pickedColor}/>

            <PencilTool
                pencilEnabled={pencilEnabled}
                pickedColor={pickedColor}
                togglePencil={togglePencil}/>
        </div>
    );
};

export default Canvas;