import styles from '../Styles.module.css';

const ColorPreview = ({ pickedColor }) => (
    <div className={styles.colorContainer}>
      <div className={styles.pickedColor} style={{ backgroundColor: pickedColor }}></div>
      <div className={styles.titleText}>
        <span>{pickedColor}</span>
      </div>
    </div>
  );

  export default ColorPreview;