import React, { useEffect, useRef, useState } from 'react';
import { TextField, Typography, Box, Grid, Tooltip } from '@mui/material';
import IconButton from '@material-ui/core/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSelector, useDispatch } from 'react-redux';
import Separator from '../Utils/Separator';
import { InputAdornment } from '@mui/material';
import { bedrockText, getIndexedDbValueFromId } from '../../Utils/RecorderUtils';
import { setQuestionBox } from '../../Redux/RecorderQuestionBox';
import { setRecordingResultsValue } from '../../Redux/RecorderResultsBoxValue';
import ModelDropdown from '../Models/ModelDropdown';
import { updateItem } from '../../Utils/RecorderUtils';
import * as consts from '../../Constants';


const RecorderSummaryBox = () => {

    const dispatch = useDispatch()

    let [resultBoxValue, setResultBoxValue] = useState()
    let resultsText = useSelector((state) => state.recorderResultsValue.results);
    let showResultsBox = useSelector((state) => state.resultsBox.value);
    const showQuestionBox = useSelector((state) => state.questionBox.value);
    const dataGridCheckboxRowId = useSelector((state) => state.datagridRowId.value);
    const recorderModelForm = useSelector((state) => state.recorderModelForm.value);

    useEffect(() => {
        setResultBoxValue(resultsText)
    }, [resultsText])

    let resultBoxRef = useRef(null);

    const copyText = (event) => {
        if (event.type === "click") {
            event.preventDefault();
            navigator.clipboard.writeText(resultsText);
        }
    };

    const runBedrockQuestion = async (e) => {


        let modelUsed;
        dispatch(setQuestionBox(false))

        let items = await getIndexedDbValueFromId(dataGridCheckboxRowId);

        if (recorderModelForm === undefined) {
            modelUsed = items.model;
          } else { 
            modelUsed = recorderModelForm
        }
        
        const now = new Date();
        const date = now.toLocaleString();

        let text = "".concat(items.transcribeText, "\n\n", e.target.value)
        let updatedText = ''.concat(resultsText,
            "\n\n\nFollow up question on: ",
            date,
            "\n\n",
            "Question asked: " + e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1),
            "\n_______________________________________________________________\n")
        const tempResultBoxValue = resultsText + consts.BEDROCK_FOLLOW_UP_WAIT
        dispatch(setRecordingResultsValue(tempResultBoxValue))
        let bedrockResponse = await bedrockText(dataGridCheckboxRowId, text, modelUsed, updatedText)
        await updateItem(dataGridCheckboxRowId, {'model' : modelUsed})
        dispatch(setRecordingResultsValue(bedrockResponse))
        dispatch(setQuestionBox(true))

    }

    const commonStyles = {

        bgcolor: "white",
        border: 1,
        boxShadow: 2,
        borderRadius: 1
    };

    return (
        <>
            {showResultsBox &&

                <Box sx={{ ...commonStyles, borderColor: 'primary.light' }}>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                        </Grid>
                        <Grid item xs={6} sm={6}
                            alignItems="flex-end">
                            <Typography
                                sx={{
                                    fontFamily: "Jost",
                                    fontSize: '30px',
                                    paddingTop: '10px',
                                    flexGrow: 1,
                                    textAlign: "center",
                                    lineHeight: 1
                                }}
                            >
                                Bedrock Summary Results
                            </Typography>
                            <Separator></Separator>

                        </Grid>
                        <Grid item xs={6} sm={3}

                            container
                            direction="column"
                            alignItems="flex-end"
                            justify="flex-start"
                        >
                            {/* <Fab variant="outlined"> */}
                            <Tooltip title="Copy text" placement="right">
                                <IconButton
                                    onClick={copyText}
                                >
                                    <ContentCopyIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            {/* </Fab> */}
                        </Grid>
                        <Grid item xs={12} sm={12}
                            container
                            direction="row"
                            justifyContent="flex-start"
                            justify="center"
                        >
                            <TextField
                                sx={{
                                    "& fieldset": { border: 'none' },
                                    width: "99%"
                                }}
                                id="resultBox"
                                multiline
                                value={resultsText}
                                inputRef={resultBoxRef}
                                
                            ></TextField>
                        </Grid>
                        <Grid item xs={2} sm={2}>
                        </Grid>
                        {showQuestionBox &&
                            <Grid 
                                item
                                container
                                direction="column"
                                alignItems="center"
                                justify="center"
                            >
                                <TextField size="small"
                                    sx={{ width: 800 }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            runBedrockQuestion(e)
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment 
                                                position="top"                                                
                                                >
                                                <Typography style={{color:"#a3a2a2"}}>
                                                    Ask a followup question:
                                                </Typography>
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>
                            </Grid>
                        }
                        {showQuestionBox &&
                            <Grid
                                item
                                container
                                direction="column"
                                alignItems="center"
                                justify="center"
                            >
                                <ModelDropdown  width={800} textFieldText={consts.CONFIGURE_SUMMARY_MODEL}></ModelDropdown>
                            </Grid>
                        }
                        <Grid>
                            <div style={{ padding: 20 }} />
                        </Grid>


                    </Grid>
                </Box>


            }
        </>
    )
}

export default RecorderSummaryBox;