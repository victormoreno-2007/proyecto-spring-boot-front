import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import UsersPage from '../pages/user/UsersPage';

import MainLayout from '../layouts/MainLayout';
import PrivateRoute from './PrivateRoute';

import { InventoryPage } from '../pages/provider/InventoryPage';
import HomePage from '../pages/home/HomePage';
import RegisterPage from '../pages/resgister/RegisterPage';
import { CreateToolPage } from '../pages/provider/CreateToolPage';
import { EditToolPage } from '../pages/provider/EditToolPage';
// 👇 CORREGIDO: La ruta debe apuntar a ../pages/client/...
import MyBookingsPage from '../pages/client/MyBookingPage';
// Si aún no tienes estas páginas (AdminReports, Profile), coméntalas para evitar errores
// import AdminReportsPage from '../pages/admin/AdminReportsPage';
// import ProfilePage from '../pages/profile/ProfilePage';
import CartPage from '../pages/client/CartPage';
import RentalManagementPage from '../pages/provider/RentalManagementPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';

export default function AppRouter() {
    return (
        <Routes>
            {/* RUTAS PÚBLICAS */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* RUTAS PRIVADAS (Protegidas) */}
            <Route element={<MainLayout />}>
                {/* ADMIN */}
                <Route
                    path="/admin/users"
                    element={
                        <PrivateRoute>
                            <UsersPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <PrivateRoute>
                            <AdminReportsPage />
                        </PrivateRoute>
                    }
                />

                {/* CLIENTE */}
                <Route
                    path="/my-home"
                    element={
                        <PrivateRoute>
                            <MyBookingsPage />
                        </PrivateRoute>
                    }
                />
                {/* 👇 FALTABA AGREGAR ESTA RUTA PARA EL CARRITO */}
                <Route
                    path="/cart"
                    element={
                        <PrivateRoute>
                            <CartPage />
                        </PrivateRoute>
                    }
                />

                {/* PROVEEDOR */}
                <Route
                    path="/my-inventory"
                    element={
                        <PrivateRoute>
                            <InventoryPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-tool"
                    element={
                        <PrivateRoute>
                            <CreateToolPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-tool/:id"
                    element={
                        <PrivateRoute>
                            <EditToolPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/my-rentals"
                    element={
                        <PrivateRoute>
                            <RentalManagementPage />
                        </PrivateRoute>
                    }
                />
            </Route>

            {/* CUALQUIER OTRA RUTA -> HOME */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}