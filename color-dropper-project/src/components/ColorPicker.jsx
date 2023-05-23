import styles from '../Styles.module.css';

const ColorPicker = ({ colorPickerEnabled, hoveredColor, hoveredColorPreviewStyle }) => (
    colorPickerEnabled && hoveredColor && (
      <div style={hoveredColorPreviewStyle} className={styles.hoveredColorPreview}>
        <div className={styles.hoveredColorSpan}></div>
      </div>
    )
  );

export default ColorPicker;