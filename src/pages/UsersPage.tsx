import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { User } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import './UsersPage.css';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    // ESTADOS PARA EL MODAL DE CREACIÓN
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'CUSTOMER' // Por defecto Cliente
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (error) {
                alert('Error al eliminar usuario');
            }
        }
    };

    // Manejar cambios en los inputs del formulario
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Enviar el formulario
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault(); // Evitar recarga
        try {
            // 1. Llamar al backend
            const newUser = await userService.createUser(formData);
            
            // 2. Agregar el nuevo usuario a la tabla visualmente
            setUsers([...users, newUser]);
            
            // 3. Cerrar modal y limpiar
            setIsModalOpen(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'CUSTOMER' });
            
            alert('Usuario creado con éxito');
        } catch (error) {
            alert('Error al crear usuario. Verifica los datos.');
        }
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="title">Gestión de Usuarios</h1>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* 👇 BOTÓN NUEVO USUARIO */}
                    <button onClick={() => setIsModalOpen(true)} className="btn-create">
                        + Nuevo Usuario
                    </button>
                    
                    <button onClick={logout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Tabla */}
            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando usuarios...</div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <strong>{user.firstName} {user.lastName}</strong>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleDelete(user.id)}
                                            className="btn-delete"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* 👇 EL MODAL (VENTANA EMERGENTE) */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Registrar Nuevo Usuario</h2>
                        
                        <form onSubmit={handleCreateUser}>
                            <div className="form-row">
                                <label>Nombre</label>
                                <input 
                                    name="firstName" 
                                    value={formData.firstName} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-row">
                                <label>Apellido</label>
                                <input 
                                    name="lastName" 
                                    value={formData.lastName} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-row">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-row">
                                <label>Contraseña</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-row">
                                <label>Rol</label>
                                <select name="role" value={formData.role} onChange={handleInputChange}>
                                    <option value="CUSTOMER">Cliente</option>
                                    <option value="PROVIDER">Proveedor</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-save">
                                    Guardar Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}