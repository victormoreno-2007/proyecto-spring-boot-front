import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import UsersPage from '../pages/user/UsersPage';
import ClientHomePage from '../pages/ClientHomePage';
import { InventoryPage } from '../pages/provider/InventoryPage'; // Página de Marcela
import MainLayout from '../layouts/MainLayout'; 
import PrivateRoute from './PrivateRoute'; 

export default function AppRouter() {
    return (
        <Routes>
        
            <Route element={<MainLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>

            
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
                            <ClientHomePage />
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
            </Route>

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
}