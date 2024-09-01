import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Stack, FormControl, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';

export default function ModelConfig() {

  let modelInputRef = useRef(null);
  const [modelList, getModelList] = useState([]);
  const [modelUsed, getModelUsed] = useState();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}`+"/api/models", {mode: 'cors'})
      .then(response => {
        return response.json();
      }).then(response => {
        getModelList(response)
      }).catch(e => {
        console.errpr(e.message + " " + e)
      });
  }, [])

  useEffect(() => {
    getModelUsed(localStorage.getItem("modelTextUsed"));
  }, [modelUsed])

  function setModel(){
    var modelName = modelInputRef.current.value
    if (modelName.length > 1){
      localStorage.setItem("modelTextUsed", modelName);
      getModelUsed(modelName);
    }
  }

  return (
    <>
      <Stack spacing={2} alignItems="center">
        <Typography> 
          You are currently using the {modelUsed} model
        </Typography>
      </Stack >
      <Stack spacing={2} sx={{ m: 4 }} alignItems="center">
        <FormControl>
          <Autocomplete
            disablePortal
            id="model-config"
            options={modelList.map((option) => option.model)}
            sx={{ width: 700, background: "white" }}
            renderInput={(params) => (
              <TextField {...params} label="Chose a model"
              inputRef={modelInputRef}
              >
              </TextField>
            )}
          />
        </FormControl>
      </Stack>
      <Stack spacing={2} sx={{ m: 4 }} alignItems="center">
        <Button
          style={{ backgroundColor: "#425a85" }}
          variant="contained"
          onClick={setModel}
          endIcon={<SendIcon />}>
          Set Model
        </Button>
      </Stack>
    </>
  );
}
