import { useState } from 'react';
import type { CartItem } from '../../contexts/CartContext';

interface PaymentModalProps {
    items: CartItem[];
    total: number;
    onClose: () => void;
    onConfirmPayment: () => void;
}

export default function PaymentModal({ items, total, onClose, onConfirmPayment }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Estados del formulario
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    // Estado de errores
    const [errors, setErrors] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    // --- FORMATEADORES (Input Masks) ---

    // 1. Formato Tarjeta: 0000 0000 0000 0000
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Solo números
        if (val.length > 16) val = val.slice(0, 16); // Máximo 16 dígitos
        
        // Agrega espacio cada 4 números
        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        
        setCardData({ ...cardData, number: formatted });
        if (errors.number) setErrors({ ...errors, number: '' }); // Limpiar error al escribir
    };

    // 2. Formato Fecha: MM/AA
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Solo números
        if (val.length > 4) val = val.slice(0, 4); // Máximo 4 dígitos (MMAA)

        // Si escribe más de 2 números, poner la barra /
        if (val.length >= 2) {
            val = `${val.slice(0, 2)}/${val.slice(2)}`;
        }

        setCardData({ ...cardData, expiry: val });
        if (errors.expiry) setErrors({ ...errors, expiry: '' });
    };

    // 3. Formato CVC: 000
    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 4) val = val.slice(0, 4);
        setCardData({ ...cardData, cvc: val });
        if (errors.cvc) setErrors({ ...errors, cvc: '' });
    };

    // --- VALIDACIONES ---
    const validate = () => {
        const newErrors = { number: '', name: '', expiry: '', cvc: '' };
        let isValid = true;

        // Validar Número (Simple: longitud 19 contando espacios)
        if (cardData.number.length < 19) {
            newErrors.number = 'Número incompleto (16 dígitos)';
            isValid = false;
        }

        // Validar Nombre
        if (cardData.name.trim().length < 5) {
            newErrors.name = 'Ingresa el nombre completo';
            isValid = false;
        }

        // Validar Fecha (Lógica real de expiración)
        const [month, year] = cardData.expiry.split('/');
        const currentYear = new Date().getFullYear() % 100; // Tomamos solo los últimos 2 dígitos (26)
        const currentMonth = new Date().getMonth() + 1;

        if (!month || !year || month.length < 2 || year.length < 2) {
            newErrors.expiry = 'Fecha incompleta';
            isValid = false;
        } else {
            const m = parseInt(month, 10);
            const y = parseInt(year, 10);

            if (m < 1 || m > 12) {
                newErrors.expiry = 'Mes inválido (01-12)';
                isValid = false;
            } else if (y < currentYear || (y === currentYear && m < currentMonth)) {
                newErrors.expiry = 'Tarjeta vencida';
                isValid = false;
            }
        }

        // Validar CVC
        if (cardData.cvc.length < 3) {
            newErrors.cvc = 'Mínimo 3 dígitos';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return; // Si falla la validación, no procesa

        setIsProcessing(true);
        // Simulamos espera de red
        setTimeout(() => {
            setIsProcessing(false);
            onConfirmPayment();
        }, 2000);
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 6000 }}>
            <div className="modal-content" style={{ maxWidth: '900px', display: 'flex', gap: '2rem', flexDirection: 'row', flexWrap: 'wrap' }}>
                
                {/* COLUMNA IZQUIERDA: RESUMEN (Igual que antes) */}
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

                {/* COLUMNA DERECHA: FORMULARIO VALIDADO */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>💳 Método de Pago</h3>
                    <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        
                        {/* NÚMERO DE TARJETA */}
                        <div>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>Número de Tarjeta</label>
                            <div style={{position: 'relative'}}>
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    className="form-input" 
                                    style={{padding: '12px', borderColor: errors.number ? '#ef4444' : '#ddd', width:'100%'}} 
                                    value={cardData.number}
                                    onChange={handleCardNumberChange}
                                    maxLength={19}
                                />
                                {/* Icono de tarjeta simulado */}
                                <span style={{position:'absolute', right:'10px', top:'12px', fontSize:'1.2rem'}}>💳</span>
                            </div>
                            {errors.number && <span style={{color: '#ef4444', fontSize: '0.8rem'}}>{errors.number}</span>}
                        </div>

                        {/* TITULAR */}
                        <div>
                            <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>Titular</label>
                            <input 
                                type="text" 
                                placeholder="NOMBRE APELLIDO" 
                                className="form-input" 
                                style={{padding: '12px', borderColor: errors.name ? '#ef4444' : '#ddd', textTransform: 'uppercase'}} 
                                value={cardData.name}
                                onChange={(e) => {
                                    setCardData({...cardData, name: e.target.value});
                                    if(errors.name) setErrors({...errors, name: ''});
                                }}
                            />
                            {errors.name && <span style={{color: '#ef4444', fontSize: '0.8rem'}}>{errors.name}</span>}
                        </div>

                        {/* FECHA Y CVC */}
                        <div style={{display:'flex', gap:'15px'}}>
                            <div style={{flex:1}}>
                                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>Vencimiento</label>
                                <input 
                                    type="text" 
                                    placeholder="MM/AA" 
                                    className="form-input" 
                                    style={{padding: '12px', borderColor: errors.expiry ? '#ef4444' : '#ddd', width:'100%'}} 
                                    value={cardData.expiry}
                                    onChange={handleExpiryChange}
                                    maxLength={5}
                                />
                                {errors.expiry && <span style={{color: '#ef4444', fontSize: '0.8rem'}}>{errors.expiry}</span>}
                            </div>
                            <div style={{flex:1}}>
                                <label style={{display:'block', marginBottom:'5px', fontWeight:'bold', fontSize:'0.9rem'}}>CVC</label>
                                <div style={{position: 'relative'}}>
                                    <input 
                                        type="password" 
                                        placeholder="123" 
                                        className="form-input" 
                                        style={{padding: '12px', borderColor: errors.cvc ? '#ef4444' : '#ddd', width:'100%'}} 
                                        value={cardData.cvc}
                                        onChange={handleCvcChange}
                                        maxLength={4}
                                    />
                                    <span style={{position:'absolute', right:'10px', top:'12px', fontSize:'1rem'}}>🔒</span>
                                </div>
                                {errors.cvc && <span style={{color: '#ef4444', fontSize: '0.8rem'}}>{errors.cvc}</span>}
                            </div>
                        </div>

                        <div className="modal-actions" style={{marginTop:'2rem'}}>
                            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                            <button 
                                type="submit" 
                                className="btn-save" 
                                disabled={isProcessing} 
                                style={{flex:1, background: isProcessing ? '#6ee7b7' : '#10b981', transition: 'all 0.3s'}}
                            >
                                {isProcessing ? 'Procesando Pago...' : `Pagar $${total.toLocaleString()}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}