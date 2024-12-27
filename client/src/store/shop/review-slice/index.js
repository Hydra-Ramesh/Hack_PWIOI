import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Environment-based dynamic URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/");

const initialState = {
  isLoading: false,
  reviews: [],
  error: null, // Added error state for better error handling
};

// Add a review
export const addReview = createAsyncThunk(
  "review/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/shop/review/add`,
        formdata
      );
      return response.data;
    } catch (error) {
      console.error("Error adding review:", error);
      return rejectWithValue(error.response?.data || error.message || "Error adding review");
    }
  }
);

// Get reviews by product ID
export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shop/review/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return rejectWithValue(error.response?.data || error.message || "Error fetching reviews");
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally, you could update the reviews list with the new review
        state.reviews.push(action.payload.data);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data || [];
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload;
      });
  },
});

export const { clearError } = reviewSlice.actions;

export default reviewSlice.reducer;
