import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: (() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
      }
    }
    return null; 
  })(),
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  role: (() => {
    const role = localStorage.getItem('role');
    if (role) {
      try {
        return role;
      } catch (error) {
        console.error('Error parsing role from localStorage:', error);
        return null;
      }
    }
    return null;
  })(),
  isAuthenticated: !!localStorage.getItem("token"), // If token exists, user is authenticated
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },

    setUserData(state, action) {
      console.log('Action payload:', action.payload);
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      if (action.payload.token && action.payload.refreshToken) {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("role", action.payload.role);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      } else {
        console.error('Token is undefined or missing');
      }
    },

    // Clear user data on logout
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
    },

    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setUserData, logout, setError } = authSlice.actions;

export default authSlice.reducer;
