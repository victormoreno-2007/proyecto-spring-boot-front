import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '2rem', 
                color: 'var(--imperial-blue)', 
                fontWeight: 'bold'
            }}>
                Cargando autenticación...
            </div>
        );
    }

    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;