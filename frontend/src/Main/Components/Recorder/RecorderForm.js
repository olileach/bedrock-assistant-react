import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import RecordContol from "./RecorderControl";
import TextField from '@mui/material/TextField';
import RecordTimerInput from "./RecorderTimer";
import { useDispatch, useSelector } from 'react-redux';
import { setRecordingName } from '../../Redux/RecorderNameForm';
import ModelDropdown from '../Models/ModelDropdown';
import * as consts from '../../Constants/index';

const useStyles = makeStyles((theme) => ({
  root: {
    // fontFamily: "Jost",
    flexGrow: 1,
    boxShadow: 2,
    border: 2,
    borderColor: '#42a5f5',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: '5px',

  },
  box: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: "100%",
    background: "white",
  },
  column: {
    height: 55,
    fontSize: '5px',
    overflow: "visible"
  },
  headerTitle: {
    height: 20,
    fontSize: "32px",
    fontFamily: "Jost",
    paddingBottom: theme.spacing(5)
  },
  headerText: {
    height: 2,
    fontSize: "16px",
    fontFamily: "Jost",
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(1)
  },
}));

var modelName = localStorage.getItem("modelTextUsed");
if (!modelName){
        modelName="anthropic.claude-v2";
        localStorage.setItem("modelTextUsed", modelName);
}


export default function RecordForm() {

  const classes = useStyles();
  const dispatch = useDispatch();

  const toggleTimer = useSelector((state) => state.timerToggle.value);
  const toggleAutoTranscribe = useSelector((state) => state.autoTranscribeToggle.value);
  const toggleOptions = useSelector((state) => state.optionsSwitch.value);

  const recordNameForm = (e) => {
    dispatch(setRecordingName(e.target.value));
  }

  return (
    <>
    {toggleOptions &&
    <div style={{ maxWidth: "100%", paddingTop: "12px", paddingBottom: "20px" }}>
      <div className={classes.root}>
        {toggleOptions && 
        <Card className={classes.box} >
          <Grid container spacing={4}>
            <Grid container item xs={12}>
              <Grid
                item
                container
                justifyContent="center"
              >
                <Typography className={classes.headerTitle} >Bedrock Summariser Options</Typography>
              
              </Grid>
              <Grid
                item
                container
                justifyContent="center"
              >
                <Typography className={classes.headerText} >Default model configured: {modelName}</Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" item xs={1}>
              <Grid
                item
                className={classes.options}
                container
                direction="row"
                justifyContent="flex"
                alignItems="center"
              >
              </Grid>
            </Grid>
            <Grid container direction="column" item xs={2}>
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Typography >Recording name:</Typography>
              </Grid>
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Typography >Model:</Typography>
              </Grid>
              {toggleTimer &&
                <Grid
                  item
                  className={classes.column}
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Typography placeholder={0} >Auto Timer (mins):</Typography>
                </Grid>
              }
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Typography >Auto Transcribe:</Typography>
              </Grid>
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Typography >Record:</Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" item xs={8}>
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <TextField
                  size="small"
                  placeholder="(Optional) Default name is Recording ID"
                  style={{ width: 600 }}
                  id="outlined-basic"
                  variant="outlined"
                  onChange={recordNameForm}
                  inputProps = {
                    {
                      sx: {
                        '&::placeholder': {
                          color: '#adafb3',
                          opacity: 1, // otherwise firefox shows a lighter color
                        },
                      },
                    }
                  }
                />
              </Grid>
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                
              >
                <ModelDropdown style={{}}></ModelDropdown>
              </Grid>
              {toggleTimer &&
                <Grid
                  item
                  className={classes.column}
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <RecordTimerInput>
                  </RecordTimerInput>
                </Grid>
              }
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Typography> {toggleAutoTranscribe === true ? consts.TRANSCRIBE_ON : consts.TRANSCRIBE_OFF}</Typography>
              </Grid>
              <Grid
                item
                className={classes.column}
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
              >
                <RecordContol></RecordContol>
              </Grid>
            </Grid>
          </Grid>
        </Card>
        }
      </div>
    </div>
      }
      </>
  );
}
