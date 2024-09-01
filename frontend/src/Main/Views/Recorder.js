import React from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import RecordForm from '../Components/Recorder/RecorderForm';
import RecordDataGrid from '../Components/Recorder/RecorderDataGrid';
import RecordOptions from '../Components/Recorder/RecorderOptions';
import { useSelector } from 'react-redux';
import RecorderSummaryBox from '../Components/Recorder/RecorderSummaryTextbox';

export default function Recording() {

  const domain = process.env.REACT_APP_BASE_URL;

  const toggleTable = useSelector((state) => state.tableToggle.value);
  const showResultsTextBox = useSelector((state) => state.resultsBox.value);

  const recorderStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      fontFamily: 'Jost',
      backgroundColor: 'grey',
      overflow: "visible",
      paddingTop: 40
    },
    paper: {
      padding: theme.spacing(),
      margin: "auto",
      maxWidth: 1200,
      paddingBottom: 50

    },
    gridRows: {
      borderBottom: "0px solid white",
      paddingBottom: "20px",
      paddingTop: 10
      
    },
  }));


  const classes = recorderStyles();

  return (
    <>

      <Grid container >
        <Grid container direction="row" item xs={12}>
          <Grid
            item
            xs
            justify="center"
          >
            < RecordOptions ></RecordOptions>
          </Grid>
        </Grid>
      </Grid>

      <Box className={classes.paper}  >
        <Grid container >
          <Grid container direction="row" item xs={12}>
            <Grid
              item
              xs
              justify="center"
            >
              < RecordForm></RecordForm>
            </Grid>
          </Grid>
          <Grid container direction="row" item xs={12}>
            <Grid
              item
              xs
              className={classes.gridRows}
              justify="center"
            >
              {toggleTable &&
                <RecordDataGrid></RecordDataGrid>
              }

            </Grid>
          </Grid>
          {showResultsTextBox &&
            <Grid container direction="row" item xs={12}>
              <Grid
                item
                xs
                justify="center"
                className={classes.gridRows}
              >
                <Typography
                  sx={{
                    fontFamily: "Jost",
                    fontSize: '30px',
                    flexGrow: 1,
                    textAlign: "center",
                    lineHeight: 2
                  }}>
                </Typography>

                < RecorderSummaryBox ></RecorderSummaryBox>
              </Grid>
            </Grid>
          }
        </Grid>
      </Box>
    </>
  );
}