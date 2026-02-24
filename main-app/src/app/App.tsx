import styles from './App.module.scss';
import { useAuth } from '../hooks/useAuth';

function App() {
  const authApi = useAuth();
  
  return (
    <div className={styles.appContainer}> 
      <p>Placeholder</p>
    </div>
  );
}

export default App;
