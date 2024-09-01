import { createSlice } from '@reduxjs/toolkit';

const OptionsToggle= {
  value: true
}

export const OptionsToggleSlice = createSlice({
  name: 'OptionsToggle',
  initialState: OptionsToggle,
  reducers: {
    OptionsSwitch: (state) => {
      state.value = !state.value;
    },
  },
})

export const { OptionsSwitch } = OptionsToggleSlice.actions;
export default OptionsToggleSlice.reducer;