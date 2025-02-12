import { createSlice } from '@reduxjs/toolkit';

// Initial state for the categories
const initialState = {
  categories: [],
  loading: false,
  error: null,
};

// Create the category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    setCategories(state, action) {
      state.categories = action.payload;
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setCategories, setError } = categorySlice.actions;

export default categorySlice.reducer;
