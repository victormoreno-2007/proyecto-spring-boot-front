import { useEffect, useState } from 'react';
import { bookingService, type Booking } from '../../services/bookingService';
import { toolService } from '../../services/toolService';
import InvoiceModal from '../../components/common/InvoiceModal'; 
import '../../styles/MyBookingPage.css';

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para Reportes
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [desc, setDesc] = useState('');

    // Estados para Facturas
    const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getMyHistory();
            
            const enrichedData = await Promise.all(data.map(async (b) => {
                try {
                    if (b.tool) return b;
                    const toolDetails = await toolService.getToolById(b.toolId);
                    return { ...b, tool: toolDetails };
                } catch (err) {
                    console.error("Error cargando herramienta para reserva " + b.id, err);
                    return b; 
                }
            }));
            
            setBookings(enrichedData.reverse());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async () => {
        if (!selectedId || !desc.trim()) return;
        if (!window.confirm("¿Confirmas el reporte? Esto podría cancelar la reserva actual.")) return;

        try {
            await bookingService.reportArrivalIssue(selectedId, desc);
            alert("✅ Reporte enviado con éxito.");
            setIsModalOpen(false);
            setDesc('');
            loadData(); 
        } catch (error) {
            console.error(error);
            alert("❌ Error al enviar el reporte.");
        }
    };

    if (loading) return <div className="bookings-container" style={{textAlign:'center', marginTop:'3rem'}}><h3>Cargando tus reservas... ⏳</h3></div>;

    return (
        <div className="bookings-container">
            <h1 className="page-title">📅 Mis Reservas</h1>

            {bookings.length === 0 ? (
                <div style={{textAlign:'center', padding:'3rem', background:'#f9fafb', borderRadius:'12px'}}>
                    <div style={{fontSize:'3rem', marginBottom:'1rem'}}>📭</div>
                    <h3>No tienes reservas activas</h3>
                    <p style={{color:'#666'}}>Cuando alquiles herramientas, aparecerán aquí.</p>
                </div>
            ) : (
                <div className="bookings-grid">
                    {bookings.map(booking => (
                        <div key={booking.id} className={`booking-card status-${booking.status.toLowerCase()}`}>
                            
                            {/* INFO HERRAMIENTA */}
                            <div className="tool-info">
                                <img 
                                    src={booking.tool?.imageUrl || "https://placehold.co/100?text=Tool"} 
                                    alt={booking.tool?.name || "Herramienta"} 
                                    className="tool-image"
                                />
                                <div className="tool-details">
                                    <div className="booking-id">ID: {booking.id.substring(0, 8)}...</div>
                                    <h3>{booking.tool?.name || "Herramienta Desconocida"}</h3>
                                </div>
                            </div>

                            {/* FECHAS Y PRECIO */}
                            <div className="booking-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Fecha Inicio</span>
                                    <span className="meta-value">{booking.startDate.split('T')[0]}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Fecha Fin</span>
                                    <span className="meta-value">{booking.endDate.split('T')[0]}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Total</span>
                                    <span className="meta-value" style={{color:'var(--imperial-blue)', fontSize:'1.1rem'}}>
                                        ${booking.totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* ACCIONES (Factura + Reporte) */}
                            <div className="booking-actions">
                                <span className="status-badge">
                                    {booking.status === 'CONFIRMED' ? 'Confirmada' : 
                                     booking.status === 'PENDING' ? 'Pendiente' : 
                                     booking.status === 'CANCELLED' ? 'Cancelada' : booking.status}
                                </span>

                                <div style={{display:'flex', gap:'10px', marginTop:'5px'}}>
                                    {/* BOTÓN FACTURA (Nuevo) */}
                                    {booking.status === 'CONFIRMED' && (
                                        <button 
                                            className="btn"
                                            onClick={() => setSelectedBookingForInvoice(booking)}
                                            style={{padding:'6px 12px', fontSize:'0.85rem', background:'#e0f2fe', color:'#0284c7'}}
                                            title="Ver Factura"
                                        >
                                            📄 Factura
                                        </button>
                                    )}

                                    {/* BOTÓN REPORTAR (Existente) */}
                                    {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                                        <button 
                                            className="btn-report"
                                            onClick={() => { setSelectedId(booking.id); setIsModalOpen(true); }}
                                            title="Reportar problema"
                                        >
                                            🚨 Reportar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE REPORTE */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{color:'#dc2626'}}>Reportar Problema</h2>
                        <p style={{fontSize:'0.9rem', color:'#666'}}>
                            Describe el daño o problema con la herramienta al recibirla.
                        </p>
                        <textarea 
                            placeholder="Ej: El taladro no enciende, tiene el cable roto..." 
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            autoFocus
                        />
                        <div style={{display:'flex', gap:'10px', justifyContent:'flex-end'}}>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                style={{padding:'10px 20px', background:'white', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer'}}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleReport}
                                className="btn"
                                style={{background:'#dc2626', color:'white', border:'none', padding:'10px 20px'}}
                            >
                                Enviar Reporte
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE FACTURA (Recuperado) */}
            {selectedBookingForInvoice && (
                <InvoiceModal 
                    booking={selectedBookingForInvoice} 
                    onClose={() => setSelectedBookingForInvoice(null)} 
                />
            )}
        </div>
    );
}