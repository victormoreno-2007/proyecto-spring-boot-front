import { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService'; // Para los reportes
import { api } from '../../services/api'; // Para las estadísticas nuevas
import '../../styles/MyBookingPage.css';

// Interfaz para los números de arriba
interface DashboardStats {
    totalUsers: number;
    activeBookings: number;
    totalRevenue: number;
}

export default function AdminReportsPage() {
    // Estado para Estadísticas (Dashboard)
    const [stats, setStats] = useState<DashboardStats | null>(null);
    
    // Estado para Tabla de Reportes
    const [reports, setReports] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            // Cargar ambas cosas en paralelo para que sea rápido
            const [statsRes, reportsData] = await Promise.all([
                api.get<DashboardStats>('/admin/reports/dashboard').catch(() => null), // Si falla, no rompe todo
                bookingService.getAllDamageReports().catch(() => [])
            ]);

            if (statsRes) setStats(statsRes.data);
            setReports(reportsData || []);
            
        } catch (error) {
            console.error("Error cargando panel admin:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{textAlign:'center', padding:'3rem'}}><h3>Cargando Panel de Control... 📊</h3></div>;

    return (
        <div className="bookings-container">
            <h1 className="page-title">📊 Panel Administrativo</h1>
            
            {/* --- SECCIÓN 1: TARJETAS DE ESTADÍSTICAS (Lo Nuevo) --- */}
            <div style={{
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '2rem',
                marginBottom: '3rem'
            }}>
                {/* TARJETA 1: INGRESOS */}
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '12px', padding: '2rem', color: 'white',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}>
                    <div style={{fontSize:'3rem', marginBottom:'10px'}}>💰</div>
                    <h3 style={{margin:0, opacity:0.9}}>Ingresos Totales</h3>
                    <div style={{fontSize:'2.5rem', fontWeight:'bold'}}>
                        ${stats?.totalRevenue.toLocaleString() || 0}
                    </div>
                </div>

                {/* TARJETA 2: RENTAS ACTIVAS */}
                <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '12px', padding: '2rem', color: 'white',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
                }}>
                    <div style={{fontSize:'3rem', marginBottom:'10px'}}>🏗️</div>
                    <h3 style={{margin:0, opacity:0.9}}>Rentas Activas</h3>
                    <div style={{fontSize:'2.5rem', fontWeight:'bold'}}>
                        {stats?.activeBookings || 0}
                    </div>
                    <p style={{margin:0, fontSize:'0.9rem', opacity:0.8}}>Herramientas en uso</p>
                </div>

                {/* TARJETA 3: USUARIOS */}
                <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '12px', padding: '2rem', color: 'white',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                }}>
                    <div style={{fontSize:'3rem', marginBottom:'10px'}}>👥</div>
                    <h3 style={{margin:0, opacity:0.9}}>Usuarios</h3>
                    <div style={{fontSize:'2.5rem', fontWeight:'bold'}}>
                        {stats?.totalUsers || 0}
                    </div>
                    <p style={{margin:0, fontSize:'0.9rem', opacity:0.8}}>Clientes y Proveedores</p>
                </div>
            </div>

            {/* --- SECCIÓN 2: TABLA DE REPORTES DE DAÑOS (Lo que ya tenías) --- */}
            <h2 style={{color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
                🛡️ Monitor de Daños y Garantías
            </h2>
            
            <div className="table-container" style={{marginTop: '1rem'}}>
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID Reserva</th>
                            <th>Descripción del Daño</th>
                            <th>Costo Reparación</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 && (
                            <tr><td colSpan={4} style={{textAlign: 'center', padding:'2rem'}}>✅ No hay reportes de daños pendientes.</td></tr>
                        )}
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td>
                                    <span style={{ fontWeight: 'bold', fontFamily: 'monospace', background:'#f3f4f6', padding:'2px 6px', borderRadius:'4px' }}>
                                        {report.bookingId.substring(0, 8)}...
                                    </span>
                                </td>
                                <td>{report.description}</td>
                                <td>
                                    {report.repairCost > 0 ? (
                                        <span style={{ color: '#dc2626', fontWeight: 'bold', background:'#fee2e2', padding:'2px 8px', borderRadius:'12px' }}>
                                            -${report.repairCost.toLocaleString()}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#059669', background:'#d1fae5', padding:'2px 8px', borderRadius:'12px', fontSize:'0.85rem' }}>
                                            🛡️ Garantía
                                        </span>
                                    )}
                                </td>
                                <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}