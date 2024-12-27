import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Environment-based dynamic URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/");

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  error: null, // Added error state for better error handling
};

// Fetch all filtered products
export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({ filterParams, sortParams }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const result = await axios.get(
        `${BASE_URL}/shop/products/get?${query}`
      );

      return result?.data;
    } catch (error) {
      // Log the error and return a meaningful error message
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response?.data || error.message || "Error fetching products");
    }
  }
);

// Fetch product details by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${BASE_URL}/shop/products/get/${id}`);
      return result?.data;
    } catch (error) {
      // Log the error and return a meaningful error message
      console.error("Error fetching product details:", error);
      return rejectWithValue(error.response?.data || error.message || "Error fetching product details");
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Filtered Products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload;
      })

      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data || null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
        state.error = action.payload;
      });
  },
});

export const { setProductDetails, clearError } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
