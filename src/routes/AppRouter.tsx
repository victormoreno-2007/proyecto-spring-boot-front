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
import MyBookingsPage from '../client/MyBookingsPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import ProfilePage from '../pages/profile/ProfilePage';

export default function AppRouter() {
    return (
        <Routes>

            <Route element={<MainLayout />}>


                <Route path="/" element={<HomePage />} />


                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

            </Route>

            {/* RUTAS PRIVADAS (Protegidas) */}
            <Route element={<MainLayout />}>
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
                            <MyBookingsPage />
                        </PrivateRoute>
                    }
                />
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
                <Route path="/admin/reports" element={
                    <PrivateRoute>
                        <AdminReportsPage />
                    </PrivateRoute>
                } />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
            </Route>




            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}