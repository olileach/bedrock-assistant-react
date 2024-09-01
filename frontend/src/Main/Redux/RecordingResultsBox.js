import { createSlice } from "@reduxjs/toolkit";


// initial global state of the app
const resultsTextBox = {
  value: false
}

// create a slice object
const recorderResultsTextBoxSlice = createSlice({
  name: "resultsBox",
  initialState: resultsTextBox,

  // creating reducers to manipulate state
  reducers: {
    setResultsBox: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { setResultsBox } = recorderResultsTextBoxSlice.actions;
export default recorderResultsTextBoxSlice.reducer;