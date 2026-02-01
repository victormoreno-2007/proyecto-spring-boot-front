import { useAuth } from '../contexts/AuthContext';

export default function ClientHomePage() {
    const { logout, user } = useAuth();

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Bienvenido, {user?.firstName}</h1>
            <p>Este es tu panel de Cliente.</p>
            <p>Aquí podrás ver tu historial y alquilar herramientas.</p>
            
            <button 
                onClick={logout}
                style={{
                    backgroundColor: '#ef4444', color: 'white', padding: '10px 20px', 
                    border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px'
                }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
}