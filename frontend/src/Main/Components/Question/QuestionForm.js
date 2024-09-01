import { useEffect, useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core/";
import Typography from "@material-ui/core/Typography";
import TextField from '@mui/material/TextField';
import ModelConfig from '../Models/ModelForm';
import Separator from "../Utils/Separator";
import { useSelector } from 'react-redux';
import LinearProgress from '@mui/joy/LinearProgress';

const questionFormStyles = makeStyles((theme) => ({
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
  headerResponse: {
    fontSize: "24px",
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

export default function RecordForm() {

  let bedrockRunning = false;
  let [modelConfigured, setModelConfigured] = useState();
  let textInputRef = useRef(null);
  let [showResults, setShowResults] = useState(false);
  let [results, setResults] = useState();
  const recorderModelForm = useSelector((state) => state.recorderModelForm.value);
  const [showProgress, setShowProgress] = useState(false);
  let [modelUsed, setModelUsed] = useState();
  let [statusText, setStatusText] = useState();

  useEffect(() => {
    setModelUsed(localStorage.getItem("modelTextUsed"));
  }, [modelUsed])

  const classes = questionFormStyles();

  const copyText = (event) => {
    if (event.type === "click") {
      event.preventDefault();
      navigator.clipboard.writeText(textInputRef.current.value);
    }
  };

  const bedrockQuestion = async (e) => {


    setShowResults(false);


    if (recorderModelForm === undefined) {
      setModelConfigured(modelUsed)
    } else { setModelConfigured(recorderModelForm) }

    let input = textInputRef.current.value
    if (!input) { setShowResults(false); return }
    setStatusText("Please wait....")
    textInputRef.current.value = ''
    e.preventDefault();
    if (bedrockRunning === true) { return };
    bedrockRunning = true;
    setShowProgress(true);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-model-name": modelUsed
      },
      body: input
    };
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}` + "/api/question", requestOptions);
    const responseText = await response.text();
    let bedrockResponse = ''.concat("\n", responseText);
    setResults(bedrockResponse);
    setShowResults(true);
    setShowProgress(false);
    setStatusText("Bedrock Answer")
    bedrockRunning = false;
  }

  return (
    <div>
      <div style={{ padding: 20 }} className={classes.root}>
        <Grid container justifyContent="center" item>
          <Typography className={classes.headerTitle} >Ask Bedrock a Question</Typography>
        </Grid>
        <Grid container justifyContent="center" item>
          <Typography className={classes.headerText} >Default model configured: {modelUsed}</Typography>
        </Grid>
        <Grid container justifyContent="center" style={{ paddingTop: 30 }} item>
          <TextField
            size="small"
            style={{ width: 800 }}
            id="outlined-basic"
            label="Ask bedrock a question"
            variant="outlined"
            inputRef={textInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.type === "click" & showResults === false)
                bedrockQuestion(e)
            }
            }
            onClick={(e) => {
              if (e.key === "Enter" || e.type === "click" & showResults === false)
                bedrockQuestion(e)
            }}
          />
        </Grid>
        <Grid container justifyContent="center" style={{ paddingTop: 20, paddingBottom: 40 }} item>
          <Typography className={classes.modelText}> Model </Typography>
          <ModelConfig>
          </ModelConfig>
        </Grid>


        {showProgress &&
          <>
            <Grid container justifyContent="center" item style={{ paddingTop: 10, paddingBottom: 0 }}>
            <Typography
              className={classes.modelText}>
              Please wait while Bedrock answers your question
            </Typography>
          </Grid>
          <Grid container justifyContent="center" item style={{ paddingTop: 10, paddingBottom: 0 }}>
            <Box
              sx={{ width: '25%', pt: showProgress === true ? 1 : 1.8 }}
              style={{ paddingBottom: 30 }}>
              <LinearProgress
                color="primary"
                size="sm"
                variant="plain"
              />
            </Box>
          </Grid>
          </>
        }



      </div>
      <div style={{ paddingBottom: 30 }} />

      {/* progress sections */}



      {showResults &&
        <>
          <Grid container justifyContent="center" >

            <Typography 
              className={classes.headerTitle} >
              {statusText}
            </Typography>
            <Separator></Separator>
          </Grid>
          <Grid container justifyContent="center" item style={{ paddingBottom: 20 }}>
            <Typography className={classes.headerText} >Model used for question: {modelConfigured}</Typography>
          </Grid>
        </>
      }

      {showResults &&

        <div className={classes.root}>
          <Grid container justifyContent="center" item style={{ paddingTop: 30, paddingBottom: 40 }}>
            <Grid>
              <TextField
                sx={{
                  "& fieldset": { border: 'black' },
                  width: 1100
                }}
                id="resultBox"
                multiline
                value={results}
              >
              </TextField>
            </Grid>
          </Grid>
        </div>
      }
    </div>
  )
}