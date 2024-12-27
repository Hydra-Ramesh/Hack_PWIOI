import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Dynamically determine the BASE_URL based on the environment
const BASE_URL =
  import.meta.env.VITE_API_URL || // Use environment variable for flexibility
  (import.meta.env.MODE === "development" 
    ? "http://localhost:8000/api" 
    : "/");

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null, // Add error state for better error tracking
};

// Async thunk to register user
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error during registration");
    }
  }
);

// Async thunk to login user
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error during login");
    }
  }
);

// Async thunk to logout user
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error during logout");
    }
  }
);

// Async thunk to check authentication
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/check-auth`, {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error checking authentication");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Check authentication
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer;
