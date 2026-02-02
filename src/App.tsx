import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './routes/AppRouter';
import './index.css'; // Importamos los estilos globales aquí

function App() {
  return (
   
    <BrowserRouter>
      
      <AuthProvider>
        
        <AppRouter />
        
      </AuthProvider>
      
    </BrowserRouter>
  );
}

export default App;