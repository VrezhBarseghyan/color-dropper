const PencilTool = ({ pencilEnabled, pickedColor, togglePencil }) => (
    <button onClick={togglePencil} disabled={!pickedColor}>
      {pencilEnabled ? 'Disable Pencil' : 'Enable Pencil'}
    </button>
  );
  
  export default PencilTool;