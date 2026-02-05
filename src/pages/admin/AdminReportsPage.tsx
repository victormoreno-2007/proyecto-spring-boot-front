import { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await bookingService.getAllDamageReports();
            setReports(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 className="page-title">🛡️ Monitor de Reportes</h1>
            <p style={{ marginBottom: '20px' }}>Supervisión de daños y conflictos reportados.</p>

            {loading ? <p>Cargando...</p> : (
                <div className="table-container">
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
                                <tr><td colSpan={4} style={{textAlign: 'center'}}>No hay reportes.</td></tr>
                            )}
                            {reports.map((report) => (
                                <tr key={report.id}>
                                    <td>
                                        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                                            {report.bookingId.substring(0, 8)}...
                                        </span>
                                    </td>
                                    <td>{report.description}</td>
                                    <td>
                                        {report.repairCost > 0 ? (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>${report.repairCost}</span>
                                        ) : (
                                            <span style={{ color: 'green' }}>$0 (Garantía)</span>
                                        )}
                                    </td>
                                    <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}