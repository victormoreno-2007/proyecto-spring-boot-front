import type { Booking } from '../../services/bookingService';

interface InvoiceModalProps {
    booking: Booking;
    onClose: () => void;
}

export default function InvoiceModal({ booking, onClose }: InvoiceModalProps) {
    const toolName = booking.tool?.name || "Herramienta Alquilada";
    const toolImage = booking.tool?.imageUrl || "https://placehold.co/100";
    
    return (
        <div className="modal-overlay" style={{ zIndex: 6000 }}>
            <div className="modal-content" style={{ maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
                {/* CABECERA DE FACTURA */}
                <div style={{ background: 'var(--imperial-blue)', color: 'white', padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ margin: 0 }}>🧾 FACTURA DE VENTA</h2>
                    <p style={{ opacity: 0.8, marginTop: '5px' }}>ConstruRenta S.A.S</p>
                    <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                        ID Transacción: <strong>{booking.paymentId || 'PENDIENTE'}</strong>
                    </div>
                </div>

                {/* CUERPO DE FACTURA */}
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <div>
                            <small style={{ color: '#666' }}>Fecha de Emisión:</small>
                            <div>{new Date().toLocaleDateString()}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <small style={{ color: '#666' }}>Estado:</small>
                            <div style={{ color: '#10b981', fontWeight: 'bold' }}>PAGADO ✅</div>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', fontSize: '0.9rem', color: '#666' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Descripción</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>Fechas</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '15px 10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <img src={toolImage} alt="tool" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit:'cover' }} />
                                    <span>{toolName}</span>
                                </td>
                                <td style={{ padding: '15px 10px', textAlign: 'center', fontSize: '0.9rem' }}>
                                    {booking.startDate.split('T')[0]} <br/> a <br/> {booking.endDate.split('T')[0]}
                                </td>
                                <td style={{ padding: '15px 10px', textAlign: 'right', fontWeight: 'bold' }}>
                                    ${booking.totalPrice.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <h3 style={{ color: 'var(--imperial-blue)', borderTop: '2px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
                                Total Pagado: ${booking.totalPrice.toLocaleString()}
                            </h3>
                        </div>
                    </div>

                    <button 
                        onClick={onClose} 
                        className="btn btn-primary" 
                        style={{ width: '100%', marginTop: '2rem' }}
                    >
                        Cerrar Comprobante
                    </button>
                </div>
            </div>
        </div>
    );
}