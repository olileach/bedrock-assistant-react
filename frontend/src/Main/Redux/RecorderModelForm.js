import { createSlice } from "@reduxjs/toolkit";


// initial global state of the app
const initialState = {
  value: undefined
}

// create a slice object
const recorderModelSlice = createSlice({
  name: "text",
  initialState,

  // creating reducers to manipulate state
  reducers: {
    setRecordingModel: (state, action) => {
      state.value = action.payload;
    }
  }
});

// exporting actions and reducers
export const { setRecordingModel } = recorderModelSlice.actions;
export default recorderModelSlice.reducer;