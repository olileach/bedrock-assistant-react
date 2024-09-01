import { createSlice } from "@reduxjs/toolkit";


// initial global state of the app
const initialState = {
  value: false
}

// create a slice object
const recorderResultsSlice = createSlice({
  name: "resultsBox",
  initialState,

  // creating reducers to manipulate state
  reducers: {
    setRecordingResultsValue: (state, action) => {
      state.results = action.payload;
    }
  }
});

// exporting actions and reducers
export const { setRecordingResultsValue } = recorderResultsSlice.actions;
export default recorderResultsSlice.reducer;