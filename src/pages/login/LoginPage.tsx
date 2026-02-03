import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Si ya está autenticado, no tiene nada que hacer aquí.
        if (isAuthenticated) {
            // Lo mandamos a su panel correspondiente según su rol
            if (user?.role === 'ADMIN') {
                navigate('/admin/users', { replace: true });
            } else {
                navigate('/my-home', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            // 1. Esperamos a que el login termine y nos devuelva el usuario
            const loggedUser: any = await login(email, password);
            
            // 2. DECIDIMOS A DÓNDE IR SEGÚN EL ROL
            if (loggedUser?.role === 'ADMIN') {
                navigate('/admin/users');
            } else {
                // Si es Cliente o Proveedor, va a su home
                navigate('/my-home'); 
            }

        } catch (err) {
            console.error(err);
            setError('Credenciales inválidas o error de conexión');
        }
    };
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">ConstruRenta Admin</h2>
                
                {error && (
                    <div className="error-msg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@ejemplo.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-login">
                        Ingresar
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        ¿Eres nuevo? <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>Crea una cuenta</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}