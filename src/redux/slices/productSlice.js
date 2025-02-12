import { createSlice } from '@reduxjs/toolkit';

// Initial state for the products
const initialState = {
    products: [],
    wishlist: (() => {
        try {
            return JSON.parse(localStorage.getItem('wishlist')) || [];
        } catch (error) {
            console.error('Error parsing wishlist from localStorage:', error);
            return [];
        }
    })(),
    loading: false,
    error: null,
};

// Create the product slice
const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setLoading(state) {
            state.loading = true;
        },
        setProducts(state, action) {
            state.products = action.payload;
            state.loading = false;
        },
        deleteProduct(state, action) {
            state.products = state.products.filter(product => product.id !== action.payload);
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        addToWishlist(state, action) {
            const productId = action.payload;
            if (!state.wishlist.includes(productId)) {
                state.wishlist.push(productId);
                localStorage.setItem('wishlist', JSON.stringify(state.wishlist)); 
            }
        },
        removeFromWishlist(state, action) {
            const productId = action.payload;
            state.wishlist = state.wishlist.filter(id => id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(state.wishlist)); 

        },
        setWishlist(state, action) {
            state.wishlist = action.payload; // Set wishlist with initial values if needed
        },
    },
});

export const { setLoading, setProducts, deleteProduct, addToWishlist, removeFromWishlist, setWishlist, setError } = productSlice.actions;

export default productSlice.reducer;
