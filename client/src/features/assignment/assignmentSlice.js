import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import assignmentService from "./assignmentService";

const initialState = {
  assignments: [],
  isError: false,
  isSucces: false,
  isLoading: false,
  message: "",
};

export const getAssignments = createAsyncThunk(
  "assignment/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await assignmentService.getAssignments(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssignments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSucces = true;
        state.assignments = action.payload;
      })
      .addCase(getAssignments, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = assignmentSlice.actions;

export default assignmentSlice.reducer;
