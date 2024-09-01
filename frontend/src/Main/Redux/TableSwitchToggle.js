import { createSlice } from '@reduxjs/toolkit';

const TableToggle= {
  value: true
}

export const tableToggleSlice = createSlice({
  name: 'tabletoggle',
  initialState: TableToggle,
  reducers: {
    TableSwitch: (state) => {
      state.value = !state.value;
    },
  },
})

export const { TableSwitch } = tableToggleSlice.actions;
export default tableToggleSlice.reducer;