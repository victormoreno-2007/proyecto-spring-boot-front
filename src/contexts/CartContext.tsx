import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Tool } from '../services/toolService';


// 1. Interfaz del Ítem con cantidad
export interface CartItem extends Tool {
    quantity: number;
}

// 2. Definimos qué funciones tendrá nuestro contexto
interface CartContextType {
    cart: CartItem[];
    addToCart: (tool: Tool) => void;
    removeFromCart: (toolId: string) => void;
    updateQuantity: (toolId: string, quantity: number) => void; // <--- FALTABA ESTA
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
        
        // Verificamos si ya existe
        const existingItem = cart.find(item => item.id === tool.id);

        if (existingItem) {
            // Si ya existe, le sumamos 1 a la cantidad
            setCart(cart.map(item => 
                item.id === tool.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            ));
        } else {
            // Si es nuevo, lo agregamos e INICIALIZAMOS quantity en 1
            // (Esto soluciona el error de TypeScript)
            setCart([...cart, { ...tool, quantity: 1 }]);
        }
    };

    const removeFromCart = (toolId: string) => {
        setCart(cart.filter(item => item.id !== toolId));
    };

    // 👇 ESTA ES LA FUNCIÓN NUEVA PARA LOS BOTONES +/-
    const updateQuantity = (toolId: string, quantity: number) => {
        if (quantity < 1) return; // Evitamos negativos
        setCart(cart.map(item => 
            item.id === toolId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const isInCart = (toolId: string) => {
        return cart.some(item => item.id === toolId);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};