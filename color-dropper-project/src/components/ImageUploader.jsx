import styles from '../Styles.module.css';

const ImageUploader = ({ handleImageUpload }) => (
  <div className={styles.inputButton}>
    <label> Upload Image
      <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
    </label>
  </div>
);

export default ImageUploader;