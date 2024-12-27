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
  searchResults: [],
  error: null, // Added error state to track errors
};

// Get search results based on a keyword
export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/shop/search/${keyword}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "Error fetching search results");
    }
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle search results
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;  // Reset error on new search
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.searchResults = [];
        state.error = action.payload;  // Set the error message
      });
  },
});

export const { resetSearchResults, clearError } = searchSlice.actions;

export default searchSlice.reducer;
