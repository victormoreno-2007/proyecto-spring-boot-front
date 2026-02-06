import { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../../services/bookingService';
import { toolService } from '../../services/toolService';
import '../../pages/user/UsersPage.css';
import InvoiceModal from '../../components/common/invoiceModal';

// 👇 CORRECCIÓN AQUÍ: 'InvoiceModal' con mayúscula, igual que el nombre del archivo

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para modales
    const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const data = await bookingService.getMyBookings();
            const fullData = await Promise.all(data.map(async (b) => {
                try {
                    const tool = await toolService.getToolById(b.toolId);
                    return { ...b, tool };
                } catch { return b; }
            }));
            // Ordenar por fecha (más reciente primero)
            setBookings(fullData.reverse());
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 className="page-title">💳 Registro de Pagos y Reservas</h1>
            
            {loading ? <p>Cargando historial...</p> : (
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Fecha Transacción</th>
                                <th>Concepto</th>
                                <th>Valor Pagado</th>
                                <th>Estado</th>
                                <th style={{textAlign:'right'}}>Comprobante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td>
                                        <div style={{fontWeight:'bold'}}>{new Date().toLocaleDateString()}</div>
                                        <small style={{color:'#666'}}>{b.paymentId || 'Pendiente'}</small>
                                    </td>
                                    <td>
                                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                            <img src={b.tool?.imageUrl} style={{width:'30px', height:'30px', borderRadius:'4px'}} />
                                            <span>{b.tool?.name || 'Herramienta'}</span>
                                        </div>
                                    </td>
                                    <td style={{fontWeight:'bold', color:'var(--imperial-blue)'}}>
                                        ${b.totalPrice.toLocaleString()}
                                    </td>
                                    <td>
                                        <span className={`role-badge ${b.status === 'CONFIRMED' ? 'role-customer' : 'role-provider'}`}>
                                            {b.status === 'CONFIRMED' ? 'PAGADO' : b.status}
                                        </span>
                                    </td>
                                    <td style={{textAlign:'right'}}>
                                        {b.status === 'CONFIRMED' && (
                                            <button 
                                                onClick={() => setSelectedBookingForInvoice(b)}
                                                className="btn"
                                                style={{padding:'5px 10px', fontSize:'0.85rem', background:'#e0f2fe', color:'#0284c7'}}
                                            >
                                                📄 Ver Factura
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODAL DE FACTURA */}
            {selectedBookingForInvoice && (
                <InvoiceModal 
                    booking={selectedBookingForInvoice} 
                    onClose={() => setSelectedBookingForInvoice(null)} 
                />
            )}
        </div>
    );
}