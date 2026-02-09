export interface User {
    id: string;          
    email: string;
    firstName: string;  
    lastName: string;
    role: 'ADMIN' | 'CUSTOMER' | 'PROVIDER'; 
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
}

export interface AuthContextType {
    user: User | null;    
    isAuthenticated: boolean; 
    isLoading: boolean;     
    login: (email: string, password: string) => Promise<any>;
    logout: () => void;     
}