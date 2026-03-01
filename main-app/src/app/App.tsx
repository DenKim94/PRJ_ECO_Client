import styles from './App.module.scss';
import { Outlet } from 'react-router-dom';

function App() {
  
  return (
    <main className={styles.appContainer}>
      <Outlet />
    </main>
  );
}

export default App;
