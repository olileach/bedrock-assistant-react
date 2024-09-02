import React from "react";
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import ModelConfig from "../Components/Models/ModelForm";

export default function Models() {

  const questionStyles = makeStyles((theme) => ({
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


  const classes = questionStyles();

  return (
    <>

      <Box className={classes.paper}  >
        <Grid container >
          <Grid container direction="row" item xs={12} style={{ paddingTop: 20 }}>
            <Grid
              item
              xs
              justify="center"
            >
              < ModelConfig></ModelConfig>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
