import { useEffect, useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core/";
import Typography from "@material-ui/core/Typography";
import TextField from '@mui/material/TextField';
import Separator from "../Utils/Separator";
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import LinearProgress from '@mui/joy/LinearProgress';

const architectuFormStyle = makeStyles((theme) => ({
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
}));


export default function RecordForm() {

  let bedrockRunning = false;
  let [showResults, setShowResults] = useState(false);
  const [showImage, showImageResults] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [bedrockResponse, setBedrockResponse] = useState();
  const [file, setFile] = useState();

  const modelUsed = "anthropic.claude-3-sonnet-20240229-v1:0"
  const classes = architectuFormStyle();

  const copyText = (event) => {
    if (event.type === "click") {
      event.preventDefault();
      navigator.clipboard.writeText(bedrockResponse);
    }
  };

  const submit = async (event) => {

    event.preventDefault();

    showImageResults(false);
    setShowResults(false);
    setShowProgress(true);
    var file64base = await fileDataURL(event.target.files[0]);
    const file = file64base.replace(/^data:image\/[a-z]+;base64,/, "");
    setFile(URL.createObjectURL(event.target.files[0]));
    showImageResults(true);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Model-Name': "anthropic.claude-3-sonnet-20240229-v1:0"
      },
      body: file
    };
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}` + "/api/architecture", requestOptions);
    const responseText = await response.text();

    setShowProgress(false);
    setShowResults(true);
    setBedrockResponse(responseText + "\n");
  };

  const fileDataURL = file => new Promise((resolve, reject) => {
    let fileRead = new FileReader();
    fileRead.onload = () => resolve(fileRead.result);
    fileRead.onerror = reject;
    fileRead.readAsDataURL(file)
  });

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });


  return (
    <div>
      <div style={{ padding: 20 }} className={classes.root}>
        <Grid container justifyContent="center" item>
          <Typography className={classes.headerTitle} >Get a Bedrock Architecture Review</Typography>
        </Grid>
        <Grid container justifyContent="center" item>
          <Typography className={classes.headerText} >Image model: {modelUsed}</Typography>
        </Grid>
        <Grid container justifyContent="center" item style={{ paddingTop: 20, paddingBottom: 30 }}>
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            endIcon={<SendIcon />}
          >
            Upload file
            <VisuallyHiddenInput
              type="file"
              onChange={submit}
            />
          </Button>
        </Grid>
        <>
        {showProgress &&
            <Grid container justifyContent="center" item >
              <Box 
              sx={{ width: '25%', pt: showProgress === true ? 1: 1.8 }} 
              style={{ paddingBottom: 30 }}>
              
                <LinearProgress 
                  color="primary"
                  size="sm"
                  variant="plain"
                />

              </Box>
            </Grid>
                          }
        </>

        {showImage &&
          <Grid 
            container
            justifyContent="center"
            className={classes.root}
            data-aos="zoom-in"
            data-aos-once="true"

            >
            <img src={file}
              alt="Uploaded file"
              width={"900px"}
            />
          </Grid>
        }

        {showResults &&

          <Grid container justifyContent="center" item style={{ paddingTop: 20, paddingBottom: 10 }}>
            <Grid>
              <Typography className={classes.headerTitle} >Bedrock Review</Typography>
              <Separator width={500}></Separator>
              <TextField
                style={{ paddingTop: 20, paddingBottom: 10 }}
                sx={{
                  "& fieldset": { border: 'black' },
                  width: 1000
                }}
                id="resultBox"
                multiline
                value={bedrockResponse}
              >
              </TextField>
            </Grid>
          </Grid>

        }

      </div>
      <div style={{ paddingBottom: 30 }} />

      {/* progress sections */}

    </div>

  )
}