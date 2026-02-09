import { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService'; 
import { api } from '../../services/api';
import '../../styles/MyBookingPage.css'; 
import type { Tool } from '../../services/toolService';

// --- INTERFACES ---
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Payment {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  status: string;
}

interface DashboardStats {
  totalUsers: number;
  activeBookings: number;
  totalRevenue: number;
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topTools, setTopTools] = useState<Tool[]>([]);
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reports, setReports] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [reportsData, statsRes, toolsRes, usersRes, paymentsRes] = await Promise.all([
        bookingService.getAllDamageReports().catch(err => { console.error("Error reportes", err); return []; }),
        api.get('/admin/reports/dashboard').catch(err => { console.error("Error dashboard", err); return null; }),
        api.get('/admin/reports/top-tools').catch(err => { console.error("Error tools", err); return { data: [] }; }),
        api.get('/admin/reports/top-users').catch(err => { console.error("Error users", err); return { data: [] }; }),
        api.get('/admin/payments').catch(err => { console.error("Error pagos", err); return { data: [] }; })
      ]);

      setReports(reportsData || []);
      if (statsRes) setStats(statsRes.data);
      if (toolsRes) setTopTools(toolsRes.data);
      if (usersRes) setTopUsers(usersRes.data);

      const listaPagos = paymentsRes?.data || [];
      const pagosOrdenados = listaPagos.sort((a: Payment, b: Payment) => 
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      );
      setPayments(pagosOrdenados);

    } catch (error) {
      console.error("Error general cargando el panel:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{padding:'2rem', textAlign:'center'}}><h3>Cargando Panel de Control... 📊</h3></div>;

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="page-title">📊 Panel de Control & Reportes</h1>

      {/* --- SECCIÓN 1: TARJETAS DE ESTADÍSTICAS --- */}
      {/* CORRECCIÓN RESPONSIVE: minmax cambiado de 250px a 200px para móviles pequeños */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="stat-card" style={{ background: '#e3f2fd', padding: '20px', borderRadius: '10px' }}>
          <h3>👥 Usuarios</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card" style={{ background: '#fff3e0', padding: '20px', borderRadius: '10px' }}>
          <h3>📅 Reservas Activas</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.activeBookings || 0}</p>
        </div>
        <div className="stat-card" style={{ background: '#e8f5e9', padding: '20px', borderRadius: '10px' }}>
          <h3>💰 Ingresos</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'green' }}>
            ${stats?.totalRevenue?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* --- SECCIÓN 2: TOPS (Esta sección ya era responsive por el grid auto-fit) --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        {/* TOP HERRAMIENTAS */}
        <div>
          <h3 style={{borderBottom:'2px solid #ddd', paddingBottom:'10px'}}>🏆 Top Herramientas</h3>
          <ul style={{listStyle:'none', padding:0}}>
            {topTools.slice(0, 5).map((tool, index) => (
              <li key={tool.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderBottom:'1px solid #eee'}}>
                <span style={{fontWeight:'bold', fontSize:'1.2rem', color:'#f59e0b'}}>#{index + 1}</span>
                <img src={tool.imageUrl} alt={tool.name} style={{width:'40px', height:'40px', borderRadius:'5px', objectFit:'cover'}} />
                <div><strong>{tool.name}</strong></div>
              </li>
            ))}
          </ul>
        </div>

        {/* TOP CLIENTES */}
        <div>
          <h3 style={{borderBottom:'2px solid #ddd', paddingBottom:'10px'}}>🥇 Top Clientes</h3>
          <ul style={{listStyle:'none', padding:0}}>
            {topUsers.slice(0, 5).map((user, index) => (
              <li key={user.id} style={{display:'flex', alignItems:'center', gap:'10px', padding:'10px', borderBottom:'1px solid #eee'}}>
                <span style={{fontWeight:'bold', fontSize:'1.2rem', color:'#3b82f6'}}>#{index + 1}</span>
                <div style={{background:'#eee', width:'30px', height:'30px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    {user.firstName.charAt(0)}
                </div>
                <div><strong>{user.firstName} {user.lastName}</strong></div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* --- SECCIÓN 3: REPORTES DE DAÑOS --- */}
      <h2 style={{color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
         🛡️ Monitor de Daños y Garantías
      </h2>
      
      {/* CORRECCIÓN: Usamos 'table-responsive' para el scroll horizontal */}
      <div className="table-responsive" style={{marginTop: '1rem', marginBottom: '50px'}}>
        <table className="users-table">
            <thead>
                <tr>
                    <th>ID Reserva</th>
                    <th>Descripción</th>
                    <th>Costo</th>
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

      {/* --- SECCIÓN 4: HISTORIAL DE PAGOS --- */}
      <h2 style={{color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px'}}>
        💳 Historial de Pagos
      </h2>
      
      {/* CORRECCIÓN: 'table-responsive' ya estaba aquí, se mantiene */}
      <div className="table-responsive">
        <table className="users-table">
            <thead>
              <tr style={{background:'#f8f9fa'}}>
                <th>Fecha y Hora</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                 <tr><td colSpan={4} style={{textAlign: 'center', padding:'2rem'}}>💰 No hay pagos registrados.</td></tr>
              )}
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>
                    {new Date(payment.paymentDate).toLocaleDateString()} <small style={{color:'#666'}}>({new Date(payment.paymentDate).toLocaleTimeString()})</small>
                  </td>
                  <td style={{fontWeight:'bold', color: '#059669'}}>${payment.amount.toLocaleString()}</td>
                  <td>{payment.method}</td>
                  <td>
                    <span style={{
                      padding:'4px 8px', borderRadius:'4px', fontSize:'0.8rem',
                      background: payment.status === 'COMPLETED' ? '#dcfce7' : '#fee2e2',
                      color: payment.status === 'COMPLETED' ? '#166534' : '#991b1b'
                    }}>
                      {payment.status === 'COMPLETED' ? 'EXITOSO' : payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>

    </div>
  );
}