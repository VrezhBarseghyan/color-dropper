import styles from '../Styles.module.css';

const ColorPicker = ({ colorPickerEnabled, hoveredColor, hoveredColorPreviewStyle }) => (
    colorPickerEnabled && hoveredColor && (
      <div style={hoveredColorPreviewStyle} className={styles.hoveredColorPreview}>
        <span className={styles.hoveredColorSpan}>{hoveredColor}</span>
      </div>
    )
  );

export default ColorPicker;