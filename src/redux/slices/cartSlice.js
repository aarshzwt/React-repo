import { createSlice } from '@reduxjs/toolkit';

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
        setCartItems(state, action) {
            state.cartItems = action.payload;
            state.loading = false;
        },
        addToCart(state, action) {
            const { product_id } = action.payload;
            const existingItem = state.cartItems.find(item => item.product.id === product_id);
            console.log(existingItem);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ product_id, quantity: 1 });
            }
        },
        removeFromCart(state, action) {
            const { id } = action.payload;
            console.log("id", id)
            state.cartItems = state.cartItems.filter(item => item.id !== id);
        },
        updateCartQuantity(state, action) {
            const { product_id, quantity } = action.payload;
            const existingItem = state.cartItems.find(item => item.product.id === product_id);
            if (existingItem) {
                existingItem.quantity = quantity;
            }
        },
        setOrderData: (state, action) => {
            state.orderData = action.payload;
        },
    },
});

export const { setLoading, setError, setCartItems, addToCart, removeFromCart, updateCartQuantity, setOrderData } = cartSlice.actions;

export default cartSlice.reducer;
