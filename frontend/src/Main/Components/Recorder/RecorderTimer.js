import * as React from 'react';
import TextField from '@mui/material/TextField';
import { setRecordingTimer } from '../../Redux/RecorderTimerForm';
import { useDispatch } from 'react-redux';

export default function RecordTimerInput() {

  const dispatch = useDispatch();
  const recordFormTimer = (e) => {
    dispatch(setRecordingTimer(e.target.value));
  }

  return (
    <TextField
          id="outlined-number"
          type="number"
          size="small"
          placeholder='0'
          onChange={recordFormTimer}
          InputLabelProps={{
            shrink: true,
          }}
    />
  );
}