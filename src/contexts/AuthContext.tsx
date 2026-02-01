import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { ReactNode } from 'react';
import type { AuthContextType, User } from '../types/auth';

const authContext = createContext<AuthContextType | undefined>(undefined);

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('acessToken');
        if (token) {
            const userData = decodeUserFromToken(token);
            if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                // Si el token está corrupto, limpiamos
                localStorage.removeItem('accessToken');
            }
        }
        setIsLoading(false);
    }, []);

    const decodeUserFromToken = (token: string): User | null => {
        const decoded = parseJwt(token);
        if (!decoded) return null;

        return {
            id: decoded.sub, // 'sub' suele ser el ID en JWT estándar
            email: decoded.email,
            role: decoded.role, // Java manda el claim "role"
            // Estos campos son opcionales si no vienen en el token,
            // por ahora ponemos placeholders o lo que venga.
            firstName: decoded.firstName || 'Usuario', 
            lastName: decoded.lastName || ''
        };
    };

    const login = async (email: string, password: string) => {
        const data = await authService.login({ email, password });
        
        if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
            const userData = decodeUserFromToken(data.accessToken);
            setUser(userData);
            setIsAuthenticated(true);
            return userData; // 👈 Retornamos el usuario para que el Login sepa qué hacer
        }
    };
    const logout = () => {
        authService.logout(); 
        setIsAuthenticated(false); 
        setUser(null);
    };
    return (
        <authContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </authContext.Provider>
    );

}

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};