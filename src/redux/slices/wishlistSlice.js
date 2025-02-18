import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    wishlistItems: [],
    loading: false,
    error: null,
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        setLoading(state) {
            state.loading = true;
        },
        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        setWishlistItems(state, action) {
            state.wishlistItems = action.payload;
            state.loading = false;
        },
        addToWishlist(state, action) {
            state.wishlistItems.push(action.payload);
        },
        removeFromWishlist(state, action) {
            const {product_id} = action.payload;
            state.wishlistItems = state.wishlistItems.filter(item => item.product.id !== product_id);
        },    
    },
});

export const { setLoading, setWishlistItems, addToWishlist, removeFromWishlist, setError } = wishlistSlice.actions;

export default wishlistSlice.reducer;
