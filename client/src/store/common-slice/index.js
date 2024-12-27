import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Dynamically determine the BASE_URL based on the environment
const BASE_URL =
  import.meta.env.VITE_API_URL || // Use environment variable for flexibility
  (import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "/");

const initialState = {
  isLoading: false,
  featureImageList: [],
  error: null, // Add error state for better error tracking
};

// Fetch feature images
export const getFeatureImages = createAsyncThunk(
  "/common/getFeatureImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/common/feature/get`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching feature images");
    }
  }
);

// Add a new feature image
export const addFeatureImage = createAsyncThunk(
  "/common/addFeatureImage",
  async (image, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/common/feature/add`, { image });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error adding feature image");
    }
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    clearFeatureImages: (state) => {
      state.featureImageList = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Feature Images
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data || [];
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add Feature Image
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally update featureImageList if necessary
        state.featureImageList = [...state.featureImageList, action.payload.data];
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeatureImages, clearError } = commonSlice.actions;

export default commonSlice.reducer;
