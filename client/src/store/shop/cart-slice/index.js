import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dynamic BASE_URL based on environment
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/");

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null, // Add error state for better error tracking
};

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/shop/cart/add`, {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding item to cart");
    }
  }
);

// Fetch cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shop/cart/get/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching cart items");
    }
  }
);

// Delete an item from the cart
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/shop/cart/${userId}/${productId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting cart item");
    }
  }
);

// Update item quantity in cart
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/shop/cart/update-cart`, {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating cart quantity");
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || [];
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Cart Item
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = state.cartItems.filter(
          (item) => item.productId !== action.meta.arg.productId
        );
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Cart Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedItem = action.payload.data;
        state.cartItems = state.cartItems.map((item) =>
          item.productId === updatedItem.productId ? updatedItem : item
        );
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, clearError } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
