import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if a JWT token is still valid (not expired)
  const isTokenValid = (token) => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  // On startup, clear if no token and no refresh token
  const initToken = localStorage.getItem('token');
  const initRefreshToken = localStorage.getItem('refreshToken');
  if (!initToken && !initRefreshToken) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token') || !!localStorage.getItem('refreshToken'));

  // Validate token with backend — uses fetchApi so it triggers the refresh interceptor if needed
  const validateTokenWithBackend = async () => {
    try {
      await fetchApi('/api/auth/me');
      return true;
    } catch {
      return false;
    }
  };

  // On first load, verify the stored token is actually valid on the backend
  useEffect(() => {
    const verifyAndFetch = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!token && !refreshToken) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      // Check with backend before making any protected API calls
      const isValid = await validateTokenWithBackend();
      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      // Token is confirmed valid — fetch cart & wishlist
      setIsLoggedIn(true);
      try {
        const [cartData, wishlistData] = await Promise.all([
          fetchApi('/api/cart'),
          fetchApi('/api/wishlist')
        ]);
        setCartItems(Array.isArray(cartData) ? cartData : []);
        setWishlistItems(Array.isArray(wishlistData) ? wishlistData : []);
      } catch {
        setCartItems([]);
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };
    verifyAndFetch();
  }, []);

  // Listen for login/logout changes across the app
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token || refreshToken) {
        setIsLoggedIn(true);
        // Fetch cart and wishlist after login
        Promise.all([
          fetchApi('/api/cart'),
          fetchApi('/api/wishlist')
        ]).then(([cartData, wishlistData]) => {
          setCartItems(Array.isArray(cartData) ? cartData : []);
          setWishlistItems(Array.isArray(wishlistData) ? wishlistData : []);
        }).catch(() => {
          setCartItems([]);
          setWishlistItems([]);
        });
      } else {
        setIsLoggedIn(false);
        setCartItems([]);
        setWishlistItems([]);
      }
    };

    window.addEventListener('authChanged', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('authChanged', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Fetch cart (used by addToCart, updateQuantity, etc.)
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token && !refreshToken) {
      setCartItems([]);
      return;
    }
    try {
      const data = await fetchApi('/api/cart');
      setCartItems(Array.isArray(data) ? data : []);
    } catch {
      setCartItems([]);
    }
  };

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!token && !refreshToken) {
      setWishlistItems([]);
      return;
    }
    try {
      const data = await fetchApi('/api/wishlist');
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch {
      setWishlistItems([]);
    }
  };

  const addToCart = async (productId, quantity = 1, selectedSize = "L") => {
    if (!isLoggedIn) {
      throw new Error('Please log in to add items to cart');
    }
    
    const tempId = 'temp-' + Date.now();
    let wasExisting = false;
    let existingId = null;

    // Optimistic update
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === productId);
      if (existingIndex >= 0) {
        wasExisting = true;
        existingId = prev[existingIndex].id;
        const newArray = [...prev];
        newArray[existingIndex] = { ...newArray[existingIndex], quantity: newArray[existingIndex].quantity + quantity };
        return newArray;
      }
      return [...prev, { id: tempId, product: { id: productId }, quantity, selectedSize }];
    });

    try {
      const newItem = await fetchApi('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, selectedSize })
      });
      
      // Update with confirmed server data
      setCartItems(prev => {
        if (wasExisting) {
          return prev.map(item => item.id === existingId ? newItem : item);
        } else {
          return prev.map(item => item.id === tempId ? newItem : item);
        }
      });
    } catch (error) {
      console.error("Failed to add to cart", error);
      await fetchCart(); // Revert to server state on failure
      throw error;
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty <= 0) {
      return removeFromCart(cartItemId);
    }
    try {
      setCartItems(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      ));
      
      await fetchApi(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQty })
      });
    } catch (error) {
      console.error("Failed to update quantity", error);
      await fetchCart();
    }
  };

  const updateSize = async (cartItemId, newSize) => {
    try {
      setCartItems(prev => prev.map(item => 
        item.id === cartItemId ? { ...item, selectedSize: newSize } : item
      ));
      
      await fetchApi(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({ selectedSize: newSize })
      });
    } catch (error) {
      console.error("Failed to update size", error);
      await fetchCart();
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      await fetchApi(`/api/cart/${cartItemId}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Failed to remove item", error);
      await fetchCart();
    }
  };

  const addToWishlist = async (productId) => {
    if (!isLoggedIn) throw new Error('Please log in');
    try {
      const newItem = await fetchApi('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId })
      });
      setWishlistItems(prev => {
        // Prevent duplicate appending if the user clicks quickly
        if (prev.some(item => item.id === newItem.id)) return prev;
        return [...prev, newItem];
      });
    } catch (error) {
      console.error("Failed to add to wishlist", error);
      throw error;
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));
      await fetchApi(`/api/wishlist/${wishlistItemId}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
      await fetchWishlist();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setCartItems([]);
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('authChanged'));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems,
      wishlistItems, 
      loading,
      isLoggedIn,
      logout,
      fetchCart, 
      addToCart, 
      updateQuantity, 
      updateSize,
      removeFromCart,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist 
    }}>
      {children}
    </CartContext.Provider>
  );
};
