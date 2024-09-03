import { useEffect, useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core/";
import Typography from "@material-ui/core/Typography";
import ModelDropdown from './ModelDropdown';
import { useSelector } from 'react-redux';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

const modelConfigStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    border: 2,
    borderColor: '#42a5f5',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: '5px',
    background: 'white'

  },
  headerTitle: {
    paddingTop: theme.spacing(2),
    fontSize: "32px",
    fontFamily: "Jost",
  },
  headerText: {
    fontSize: "16px",
    fontFamily: "Jost",
    paddingBottom: theme.spacing(2),
  },
  modelText: {
    height: 2,
    paddingTop: theme.spacing(1),
    padding: theme.spacing(2),
  },
}));

var modelName = localStorage.getItem("modelTextUsed");
if (!modelName) {
  modelName = "anthropic.claude-v2";
  localStorage.setItem("modelTextUsed", modelName);
}

export default function ModelForm() {

  const recorderModelForm = useSelector((state) => state.recorderModelForm.value);
  let [modelUsed, setModelUsed] = useState();

  useEffect(() => {
    setModelUsed(localStorage.getItem("modelTextUsed"));
  }, [modelUsed])

  const classes = modelConfigStyles();

  const setModel = async (e) => {

    if (recorderModelForm === undefined) {
      console.error("User need to select a model")
      return;
    }

    localStorage.setItem("modelTextUsed", recorderModelForm);
    setModelUsed(recorderModelForm);
  }

  return (
    <>
      <div style={{ padding: 20 }} className={classes.root}>

        <Grid container justifyContent="center" item>
          <Typography className={classes.headerTitle} >Configure Default Model</Typography>
        </Grid>
        <Grid container justifyContent="center" item>
          <Typography className={classes.headerText} >Default model configured: {modelUsed}</Typography>
        </Grid>
        <Grid container justifyContent="center" style={{ paddingTop: 20, paddingBottom: 40 }} item>
          <Typography className={classes.modelText}> Model </Typography>
          <ModelDropdown width={600}>
          </ModelDropdown>
        </Grid>
        <Grid container justifyContent="center" item style={{ paddingTop: 10 }}>
          <Button
            component="label"
            variant="outlined"
            onClick={setModel}
            endIcon={<SendIcon />}
          >
            Set Model
          </Button>
        </Grid>
        <div style={{ paddingBottom: 30 }}></div>
      </div>
    </>
  )
}