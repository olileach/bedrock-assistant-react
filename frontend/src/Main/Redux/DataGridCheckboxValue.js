import { createSlice } from '@reduxjs/toolkit';

const DatagridCheckboxValue= {
  value: false
}

export const DatagridCheckboxSlice = createSlice({
  name: 'Timertoggle',
  initialState: DatagridCheckboxValue,
  reducers: {
    datagridCheckBox: (state) => {
      state.value = !state.value;
    },
  },
})

export const { datagridCheckBox } = DatagridCheckboxSlice.actions;
export default DatagridCheckboxSlice.reducer;