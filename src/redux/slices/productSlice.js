import { createSlice } from '@reduxjs/toolkit';

// Initial state for the products
const initialState = {
    products: [],
    wishlist: [],
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
            const {productId, userId} = action.payload;
            const existingProductInWishlist = state.wishlist.filter(item => item.user_id === userId && item.product_id === productId );
            if (!state.wishlist.includes(existingProductInWishlist)) {
                state.wishlist.push(existingProductInWishlist);
            }
        },
        removeFromWishlist(state, action) {
            const {productId, userId} = action.payload;
            state.wishlist = state.wishlist.filter(item => item.user_id !== userId && item.product_id !== productId );
        },
        
    },
});

export const { setLoading, setProducts, deleteProduct, addToWishlist, removeFromWishlist, setError } = productSlice.actions;

export default productSlice.reducer;
