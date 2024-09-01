import { createSlice } from '@reduxjs/toolkit';

const ChartToggle = {
  value: false,
}

export const chartToggleSlice = createSlice({
  name: 'ChartToggle',
  initialState: ChartToggle,
  reducers: {
    ChartSwitch: (state) => {
      state.value = !state.value;
    },
  },
})

export const { ChartSwitch } = chartToggleSlice.actions;
export default chartToggleSlice.reducer;