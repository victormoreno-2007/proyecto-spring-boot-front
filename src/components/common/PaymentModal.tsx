import { useState } from 'react';
import type { CartItem } from '../../contexts/CartContext';

interface PaymentModalProps {
    items: CartItem[]; // Ahora recibe los ítems para mostrar el resumen
    total: number;
    onClose: () => void;
    onConfirmPayment: () => void;
}

export default function PaymentModal({ items, total, onClose, onConfirmPayment }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onConfirmPayment();
        }, 2000);
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 6000 }}>
            {/* Hacemos el modal más ancho para que quepan las dos columnas */}
            <div className="modal-content" style={{ maxWidth: '900px', display: 'flex', gap: '2rem', flexDirection: 'row', flexWrap: 'wrap' }}>
                
                {/* COLUMNA IZQUIERDA: RESUMEN DE FACTURA (PREVIEW) */}
                <div style={{ flex: 1, minWidth: '300px', borderRight: '1px solid #eee', paddingRight: '2rem' }}>
                    <h3 style={{ color: 'var(--imperial-blue)', marginBottom: '1rem', borderBottom: '2px solid var(--school-bus-yellow)', paddingBottom:'10px' }}>
                        🧾 Resumen de Compra
                    </h3>
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                        {items.map((item) => (
                            <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #f3f4f6' }}>
                                <img src={item.imageUrl} alt="" style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit:'cover', border: '1px solid #eee' }} />
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1rem', color:'#333' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Cantidad: <strong>{item.quantity}</strong></div>
                                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop:'4px' }}>
                                        📅 {item.startDate} ➜ {item.endDate}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', background: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--imperial-blue)' }}>
                            <span>Total a Pagar:</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: DATOS DE TARJETA */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>💳 Método de Pago</h3>
                    <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>Número de Tarjeta</label>
                            <input required type="text" placeholder="0000 0000 0000 0000" className="form-input" style={{padding: '12px'}} />
                        </div>
                        <div>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>Titular</label>
                            <input required type="text" placeholder="NOMBRE APELLIDO" className="form-input" style={{padding: '12px'}} />
                        </div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <div style={{flex:1}}>
                                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>Vencimiento</label>
                                <input required type="text" placeholder="MM/AA" className="form-input" style={{padding: '12px'}} />
                            </div>
                            <div style={{flex:1}}>
                                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>CVC</label>
                                <input required type="text" placeholder="123" className="form-input" style={{padding: '12px'}} />
                            </div>
                        </div>

                        <div className="modal-actions" style={{marginTop:'2rem'}}>
                            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                            <button 
                                type="submit" 
                                className="btn-save" 
                                disabled={isProcessing} 
                                style={{flex:1, background: '#10b981'}}
                            >
                                {isProcessing ? 'Procesando...' : 'Pagar y Generar Factura ✨'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}