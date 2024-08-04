import { createContext, useState, useEffect } from 'react';

export const CardContext = createContext({});

export function CardContextProvider({ children }) {
    const ls = typeof window !== 'undefined' ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        if (cartProducts?.length > 0) {
            ls?.setItem('cart', JSON.stringify(cartProducts));
        } else {
            ls?.removeItem('cart');
        }
    }, [cartProducts]);

    useEffect(() => {
        if (ls && ls.getItem('cart')) {
            setCartProducts(JSON.parse(ls.getItem('cart')));
        }
    }, []);

    function addProducts(productId) {
        setCartProducts(prev => [...prev, productId]);
    }

    function removeProducts(productId) {
        setCartProducts(prev => {
            const pos = prev.indexOf(productId);
            if (pos !== -1) {
                return prev.filter((value, index) => index !== pos);
            }
            return prev;
        });
    }

    function emptyArray() {
        setCartProducts([]);
    }

    return (
        <CardContext.Provider value={{ cartProducts, setCartProducts, addProducts, removeProducts, emptyArray }}>
            {children}
        </CardContext.Provider>
    );
}

export default CardContext;
