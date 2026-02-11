import { useEffect, useState } from 'react';
import '../../styles/MyBookingPage.css'; 
import type { Payment } from '../../services/paymentService';
import paymentService from '../../services/paymentService';

export default function MyPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await paymentService.getMyPayments();
            const sorted = data.sort((a, b) => 
                new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
            );
            setPayments(sorted);
        } catch (error) {
            console.error("Error cargando pagos:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED': return { color: 'green', fontWeight: 'bold' };
            case 'PENDING': return { color: 'orange', fontWeight: 'bold' };
            case 'FAILED': return { color: 'red', fontWeight: 'bold' };
            default: return {};
        }
    };

    return (
        <div className="my-bookings-container">
            <h1>historial de pagos</h1>
            
            {loading ? (
                <p>Cargando transacciones...</p>
            ) : (
                <div className="bookings-list"> 
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Fecha</th>
                                <th style={{ padding: '10px' }}>Monto</th>
                                <th style={{ padding: '10px' }}>Método</th>
                                <th style={{ padding: '10px' }}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                                        aun no tienes pagos.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>
                                            {new Date(p.paymentDate).toLocaleDateString()} <small>{new Date(p.paymentDate).toLocaleTimeString()}</small>
                                        </td>
                                        <td style={{ padding: '10px' }}>
                                            ${p.amount.toLocaleString()}
                                        </td>
                                        <td style={{ padding: '10px' }}>{p.method}</td>
                                        <td style={{ padding: '10px' }}>
                                            <span style={getStatusStyle(p.status)}>
                                                {p.status === 'COMPLETED' ? 'EXITOSO' : p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}