import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';

export default function ProfilePage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                password: '' // Siempre vacía por seguridad
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        try {
            await userService.updateUser(user.id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                // Solo enviamos password si el usuario escribió algo
                password: formData.password.trim() === '' ? null : formData.password
            });
            alert("¡Perfil actualizado correctamente! 💾");
            // Recargamos para ver los cambios reflejados en el Header
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Hubo un error al actualizar tus datos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '500px' }}>
            <h1 className="page-title" style={{ textAlign: 'center' }}>👤 Mi Perfil</h1>

            <div style={{ 
                background: 'white', padding: '2rem', borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
                {/* Avatar Visual */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ 
                        width: '90px', height: '90px', background: '#fdc500', 
                        color: '#00296b', fontSize: '2.5rem', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%', margin: '0 auto 10px auto'
                    }}>
                        {user?.firstName?.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ margin: 0, color: '#666', fontWeight: '500' }}>{user?.email}</p>
                    <span style={{ fontSize: '0.8rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '10px' }}>
                        {user?.role}
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Nombre</label>
                        <input 
                            type="text"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Apellido</label>
                        <input 
                            type="text"
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>
                            Cambiar Contraseña <span style={{ fontWeight: 'normal', color: '#888', fontSize: '0.9rem' }}>(Opcional)</span>
                        </label>
                        <input 
                            type="password"
                            placeholder="Dejar vacía para mantener la actual"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn"
                        style={{ 
                            width: '100%', background: '#00296b', color: 'white', 
                            padding: '12px', fontSize: '1rem', opacity: loading ? 0.7 : 1 
                        }}
                    >
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
}