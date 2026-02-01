import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');

        try {
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
                <h2 className="login-title">ConstrurRenta Admin</h2>
                
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
                            placeholder="admin@construrrenta.com"
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
                </form>
            </div>
        </div>
    );
}