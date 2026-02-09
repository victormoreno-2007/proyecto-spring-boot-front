import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

import '../login/LoginPage.css'; 

export default function RegisterPage() {
    const navigate = useNavigate();
    
 
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError('');

        // 1. Validaciones básicas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
           
            await authService.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password
            });

    
            alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
            navigate('/login');

        } catch (err: any) {
            console.error(err);
            setError('Error al registrarse. El correo podría estar en uso.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Crear Cuenta 🏗️</h2>
                
                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input 
                            name="firstName"
                            type="text" 
                            className="form-input"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Apellido</label>
                        <input 
                            name="lastName"
                            type="text" 
                            className="form-input"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                            name="email"
                            type="email" 
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="cliente@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input 
                            name="password"
                            type="password" 
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input 
                            name="confirmPassword"
                            type="password" 
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#2563eb', fontWeight: 'bold' }}>Inicia Sesión</Link>
                </div>
            </div>
        </div>
    );
}