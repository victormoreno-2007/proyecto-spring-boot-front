import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Tool } from '../services/toolService';

// 1. Ahora el Ítem guarda sus propias fechas
export interface CartItem extends Tool {
    quantity: number;
    startDate?: string; // Fecha inicio específica de este ítem
    endDate?: string;   // Fecha fin específica de este ítem
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (tool: Tool) => void;
    removeFromCart: (toolId: string) => void;
    updateQuantity: (toolId: string, quantity: number) => void;
    updateDates: (toolId: string, startDate: string, endDate: string) => void; // <--- NUEVA FUNCIÓN
    clearCart: () => void;
    isInCart: (toolId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);
    
    const addToCart = (tool: Tool) => {
        if (!tool.id) return;
        const existingItem = cart.find(item => item.id === tool.id);

        if (existingItem) {
            setCart(cart.map(item => 
                item.id === tool.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            // Inicializamos sin fechas para que el usuario las elija
            setCart([...cart, { ...tool, quantity: 1, startDate: '', endDate: '' }]);
        }
    };

    const removeFromCart = (toolId: string) => {
        setCart(cart.filter(item => item.id !== toolId));
    };

    const updateQuantity = (toolId: string, quantity: number) => {
        if (quantity < 1) return; 
        setCart(cart.map(item => 
            item.id === toolId ? { ...item, quantity } : item
        ));
    };

    // 👇 AQUÍ GUARDAMOS LAS FECHAS INDIVIDUALES
    const updateDates = (toolId: string, startDate: string, endDate: string) => {
        setCart(cart.map(item => 
            item.id === toolId ? { ...item, startDate, endDate } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (toolId: string) => {
        return cart.some(item => item.id === toolId);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateDates, clearCart, isInCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};