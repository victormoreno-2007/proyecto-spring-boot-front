import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Tool } from '../services/toolService';

export interface CartItem extends Tool {
    // Espacio para futuras expansiones
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (tool: Tool) => void;
    removeFromCart: (toolId: string) => void;
    clearCart: () => void;
    isInCart: (toolId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (tool: Tool) => {
        if (!tool.id) return;
        if (!isInCart(tool.id)) {
            setCart([...cart, tool]);
        }
    };

    const removeFromCart = (toolId: string) => {
        setCart(cart.filter(item => item.id !== toolId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (toolId: string) => {
        return cart.some(item => item.id === toolId);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};