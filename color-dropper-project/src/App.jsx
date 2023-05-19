import Canvas from './components/Canvas';
import styles from './Styles.module.css';

const App = () => {
  return (
    <div>
      <h1 className={styles.titleText}>Canvas Example</h1>
      <Canvas />
    </div>
  );
};

export default App;
