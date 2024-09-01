import { createSlice } from '@reduxjs/toolkit';

const TimerToggle= {
  value: false
}

export const TimerToggleSlice = createSlice({
  name: 'Timertoggle',
  initialState: TimerToggle,
  reducers: {
    TimerSwitch: (state) => {
      state.value = !state.value;
    },
  },
})

export const { TimerSwitch } = TimerToggleSlice.actions;
export default TimerToggleSlice.reducer;