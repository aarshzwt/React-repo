import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Initial state for the cart
const initialState = {
    cartItems: [],
    loading: false,
    error: null,
    orderData: null,
};

// Create the cart slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setLoading(state) {
            state.loading = true;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        addToCart(state, action) {
            const { product_id } = action.payload;
            const existingItem = state.cartItems.find(item => item.product_id === product_id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ product_id, quantity: 1 });
            }
            axiosInstance.post('cart', { product_id, quantity: 1 })
                .catch((error) => {
                    state.error = "Failed to add to cart.";
                });
        },
        removeFromCart(state, action) {
            const { product_id } = action.payload;
            state.cartItems = state.cartItems.filter(item => item.product_id !== product_id);
            // Remove cart item on the server via API
            axiosInstance.delete(`cart/${product_id}`)
                .catch((error) => {
                    state.error = "Failed to remove from cart.";
                });
        },
        updateCartQuantity(state, action) {
            const { product_id, quantity } = action.payload;
            const existingItem = state.cartItems.find(item => item.product_id === product_id);
            if (existingItem) {
                existingItem.quantity = quantity;
                // Update cart quantity on the server via API
                axiosInstance.post('cart', { product_id, quantity })
                    .catch((error) => {
                        state.error = "Failed to update cart quantity.";
                    });
            }
        },
        setOrderData: (state, action) => {
            state.orderData = action.payload;
        },
    },
});

export const { setLoading, setError, addToCart, removeFromCart, updateCartQuantity, setOrderData } = cartSlice.actions;

export default cartSlice.reducer;
