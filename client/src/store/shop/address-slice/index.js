import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Dynamically determine the BASE_URL based on the environment
const BASE_URL =
  import.meta.env.VITE_API_URL || // Use environment variable for flexibility
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/");

// Define API paths for better maintainability
const API_PATHS = {
  GET_ALL_ADDRESSES: `${BASE_URL}/shop/addresses/get`,
  ADD_NEW_ADDRESS: `${BASE_URL}/shop/addresses/add`,
  EDIT_ADDRESS: (id) => `${BASE_URL}/shop/addresses/edit/${id}`,
  DELETE_ADDRESS: (id) => `${BASE_URL}/shop/addresses/delete/${id}`,
};

const initialState = {
  addressList: [],
  addressDetails: null,
  isLoading: false,
  error: null,
};

// Fetch all addresses
export const fetchAllAddresses = createAsyncThunk(
  "/address/fetchAllAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_PATHS.GET_ALL_ADDRESSES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching addresses");
    }
  }
);

// Add a new address
export const addNewAddress = createAsyncThunk(
  "/address/addNewAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_PATHS.ADD_NEW_ADDRESS, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding address");
    }
  }
);

// Edit an existing address
export const editAddress = createAsyncThunk(
  "/address/editAddress",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(API_PATHS.EDIT_ADDRESS(id), formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error editing address");
    }
  }
);

// Delete an address
export const deleteAddress = createAsyncThunk(
  "/address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(API_PATHS.DELETE_ADDRESS(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting address");
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all addresses
    builder
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.addressList = [];
        state.error = action.payload;
      })
      // Add new address
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList.push(action.payload.data); // Update the address list with the new address
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Edit address
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.addressList.findIndex(
          (address) => address.id === action.payload.data.id
        );
        if (index !== -1) {
          state.addressList[index] = action.payload.data; // Update the address in the list
        }
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = state.addressList.filter(
          (address) => address.id !== action.payload.data.id
        );
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
