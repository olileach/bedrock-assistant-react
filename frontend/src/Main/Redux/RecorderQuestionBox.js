import { createSlice } from "@reduxjs/toolkit";


// initial global state of the app
const initialState = {
  value: false
}

// create a slice object
const recorderSummaryProgressSlice = createSlice({
  name: "questionBox",
  initialState,

  // creating reducers to manipulate state
  reducers: {
    setQuestionBox: (state, action) => {
      state.value = action.payload
    }
  }
});

// exporting actions and reducers
export const { setQuestionBox } = recorderSummaryProgressSlice.actions;
export default recorderSummaryProgressSlice.reducer;