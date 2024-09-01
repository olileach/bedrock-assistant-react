import { createSlice } from '@reduxjs/toolkit';

const AutoTranscribeToggle= {
  value: true
}

export const AutoTranscribeToggleSlice = createSlice({
  name: 'AutoTranscribetoggle',
  initialState: AutoTranscribeToggle,
  reducers: {
    AutoTranscribeSwitch: (state) => {
      state.value = !state.value;
    },
  },
})

export const { AutoTranscribeSwitch } = AutoTranscribeToggleSlice.actions;
export default AutoTranscribeToggleSlice.reducer;