import { createSlice } from '@reduxjs/toolkit';

const DatagridRowIdValue = {
  value: false
}

export const DatagridRowIdSlice = createSlice({
  name: 'DataGridRowId',
  initialState: DatagridRowIdValue,
  reducers: {
    datagridRowId: (state, action) => {
      state.value = action.payload;
    },
  },
})

export const { datagridRowId} = DatagridRowIdSlice.actions;
export default DatagridRowIdSlice.reducer;