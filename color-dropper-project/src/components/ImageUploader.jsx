import React, { useRef } from 'react';

const ImageUploader = ({ onImageUpload }) => {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onImageUpload(file);
    inputRef.current.value = ''; // Reset the input value
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} ref={inputRef} />
    </div>
  );
};

export default ImageUploader;
