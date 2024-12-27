import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Environment-based dynamic URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/");

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  error: null, // Added error state
};

// Create a new order
export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/shop/order/create`, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating order");
    }
  }
);

// Capture payment
export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/shop/order/capture`, {
        paymentId,
        payerId,
        orderId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error capturing payment");
    }
  }
);

// Fetch all orders by user ID
export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shop/order/list/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching orders");
    }
  }
);

// Fetch order details by ID
export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shop/order/details/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching order details");
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create New Order
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
        state.error = action.payload;
      })

      // Fetch All Orders
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.orderList = [];
        state.error = action.payload;
      })

      // Fetch Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.orderDetails = null;
        state.error = action.payload;
      })

      // Capture Payment
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(capturePayment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderDetails, clearError } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
