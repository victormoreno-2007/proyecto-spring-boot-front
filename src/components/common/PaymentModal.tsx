import { useState } from 'react';

interface PaymentModalProps {
    total: number;
    onClose: () => void;
    onConfirmPayment: () => void;
}

export default function PaymentModal({ total, onClose, onConfirmPayment }: PaymentModalProps) {
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
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--imperial-blue)' }}>💳 Pasarela Segura</h2>
                <p style={{ textAlign: 'center' }}>Total a pagar: <strong>${total.toLocaleString()}</strong></p>
                <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input required type="text" placeholder="Número de Tarjeta" className="form-input" style={{padding: '10px'}} />
                    <div style={{display:'flex', gap:'10px'}}>
                        <input required type="text" placeholder="MM/AA" className="form-input" style={{padding: '10px', width:'50%'}} />
                        <input required type="text" placeholder="CVC" className="form-input" style={{padding: '10px', width:'50%'}} />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save" disabled={isProcessing}>
                            {isProcessing ? 'Procesando...' : 'Pagar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}