import { createSlice } from "@reduxjs/toolkit";


// initial global state of the app
const initialState = {
  value: 0
}

// create a slice object
const recorderTimerSlice = createSlice({
  name: "number",
  initialState,

  // creating reducers to manipulate state
  reducers: {
    setRecordingTimer: (state, action) => {
      state.number = parseInt(action.payload);
    }
  }
});

// exporting actions and reducers
export const { setRecordingTimer } = recorderTimerSlice.actions;
export default recorderTimerSlice.reducer;