import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Dynamically determine the BASE_URL based on the environment
const BASE_URL = import.meta.env.VITE_API_URL || // Use environment variable for flexibility
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/");

// Define API paths for better maintainability
const API_PATHS = {
  ADD_NEW_PRODUCT: `${BASE_URL}/admin/products/add`,
  GET_ALL_PRODUCTS: `${BASE_URL}/admin/products/get`,
  EDIT_PRODUCT: (id) => `${BASE_URL}/admin/products/edit/${id}`,
  DELETE_PRODUCT: (id) => `${BASE_URL}/admin/products/delete/${id}`,
};

const initialState = {
  isLoading: false,
  productList: [],
};

// Add new product
export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(API_PATHS.ADD_NEW_PRODUCT, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return result?.data;
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(API_PATHS.GET_ALL_PRODUCTS);

    return result?.data;
  }
);

// Edit product
export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(API_PATHS.EDIT_PRODUCT(id), formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return result?.data;
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(API_PATHS.DELETE_PRODUCT(id));

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default AdminProductsSlice.reducer;
