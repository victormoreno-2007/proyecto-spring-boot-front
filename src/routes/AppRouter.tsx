import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/login/LoginPage';
import UsersPage from '../pages/user/UsersPage';
import type { JSX } from 'react';
import ClientHomePage from '../pages/ClientHomePage';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando sistema...</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/admin/users"
                        element={
                            <PrivateRoute>
                                <UsersPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/my-home"
                        element={
                            <PrivateRoute>
                                <ClientHomePage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}