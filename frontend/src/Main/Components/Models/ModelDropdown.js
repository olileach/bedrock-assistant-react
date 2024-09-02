import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRecordingModel } from '../../Redux/RecorderModelForm';

export default function ModelDropdown() {

  const dispatch = useDispatch();

  const [modelList, getModelList] = useState([]);
  const [modelUsed, getModelUsed] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}`+"/api/models")
      .then(response => {
        return response.json();
      }).then(response => {
        getModelList(response)
      }).catch(e => {
        console.error(e.message)
      });
  }, [])

  useEffect(() => {
    getModelUsed(localStorage.getItem("modelTextUsed"));
  }, [modelUsed])

  const recordNameForm = (e, value) => {
    let model;
    if (value){
      model = value;
    } else {
      model = localStorage.getItem("modelTextUsed")
    }
    dispatch(setRecordingModel(model))
  }

  return (
    <>

      <FormControl >
        <Autocomplete
          disablePortal
          id="model-config"
          focus={true}
          onChange={(e, value) => recordNameForm(e, value)}
          options={modelList.map((option) => option.model)}
          sx={{ width: 600, background: "white", zIndex: 2 }}
          renderInput={(params) => (
            <TextField {...params}
              placeholder='Choose a model or use the default configured'
              size="small"
            >
            </TextField>
          )}
        />
      </FormControl>
    </>
  );
}
