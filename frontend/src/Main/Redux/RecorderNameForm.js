import { createSlice } from "@reduxjs/toolkit";


// initial global state of the app
const initialState = {
  value: "null"
}

// create a slice object
const recorderNameSlice = createSlice({
  name: "text",
  initialState,

  // creating reducers to manipulate state
  reducers: {
    setRecordingName: (state, action) => {
      state.value = action.payload;
    }
  }
});

// exporting actions and reducers
export const { setRecordingName } = recorderNameSlice.actions;
export default recorderNameSlice.reducer;