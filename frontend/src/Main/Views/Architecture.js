import React from "react";
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import ArchitectureForm from '../Components/Architecture/ArchitectureForm.js';

export default function Recording() {

  const architecureStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(),
      margin: "auto",
      maxWidth: 1200,
      paddingBottom: 50

    }
  }));

  const classes = architecureStyles();

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
              < ArchitectureForm></ArchitectureForm>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
