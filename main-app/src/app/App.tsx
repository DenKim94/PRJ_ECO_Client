import styles from './App.module.scss';
import { useAuth } from '../hooks/useAuth';

function App() {
  const { user, isAuthenticated, showSessionWarning, isLoading, errorMsg } = useAuth();
  
  return (
    <div className={styles.appContainer}> 
      <p>Placeholder</p>
    </div>
  );
}

export default App;
