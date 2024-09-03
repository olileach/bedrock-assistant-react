import React from "react";
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Dexie from 'dexie';
import Chip from '@mui/material/Chip';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';
import { createStyles, makeStyles } from "@material-ui/core";
import LoopIcon from "@material-ui/icons/Loop";
import { transcribeText, 
         bedrockSummary,
         updateItem,
         queryRecordingData,
        } from '../../Utils/RecorderUtils';
import ErrorIcon from '@mui/icons-material/Error';
import { useDispatch, useSelector } from 'react-redux';
import { setRecordingResultsValue } from '../../Redux/RecorderResultsBoxValue';
import { setResultsBox } from '../../Redux/RecordingResultsBox';
import { setQuestionBox } from '../../Redux/RecorderQuestionBox';
import { datagridRowId } from "../../Redux/DataGridRowId";
import RecordingDataGridNoRowsOverlay from "./RecorderDataGridOverlay";
import * as consts from '../../Constants';

// I think we should be useing live query instead of useState
import { useLiveQuery } from "dexie-react-hooks";

export const db = new Dexie('BedrockRecorder');

db.version(1).stores({
    recording: '++id, data' // Primary key and indexed props
});

export const datagridStyle = makeStyles(() =>
    createStyles({
        rotateIcon: {
            animation: "$spin 2s linear infinite"
        },
        "@keyframes spin": {
            "0%": {
                transform: "rotate(360deg)"
            },
            "100%": {
                transform: "rotate(0deg)"
            }
        }
    })
);

const RecordDataGrid = () => {

    const classes = datagridStyle();
    const dispatch = useDispatch();
    const dataGridCheckboxRowId = useSelector((state) => state.datagridRowId.value);

    const handleRowEditStop = (updateRow) => {
        updateItem(updateRow.id, {"recorderNameForm" : updateRow.recorderNameForm})
    };

    const runTranscribeRecording = async (e) => {

        if (dataGridCheckboxRowId) { 
            dispatch(setResultsBox(true))}
        else {
            dispatch(setResultsBox(false))
        }
        const id = parseInt(e['id']);
        
        dispatch(setRecordingResultsValue(consts.TRANSCRIPTION_IN_PROGRESS))
        const item = await db.recording.get(id);

        updateItem(id, { transcribe: "inprogress", outputText: consts.TRANSCRIPTION_IN_PROGRESS } )

        const transcribeResponse = await transcribeText(id, item.recording);

        if (transcribeResponse['transcribeFailed'] === false) {
            const bedrockResults = await bedrockSummary(id, transcribeResponse['jobTextResult'], item.model)
            dispatch(setRecordingResultsValue(bedrockResults));
            dispatch(setQuestionBox(true));

        } else if (transcribeResponse['transcribeFailed'] === true) {
            await db.recording.update(id, { transcribe: "failed", outputText: transcribeResponse['jobTextResult'] });
            dispatch(setRecordingResultsValue(transcribeResponse['jobTextResult']));
            dispatch(setQuestionBox(false));
        }
        else {
            await db.recording.update(id, { transcribe: "failed", outputText: consts.TRANSCRIPTION_FAILED });
            dispatch(setRecordingResultsValue(consts.TRANSCRIPTION_FAILED));
            dispatch(setQuestionBox(false));
        }

    }

    const columns = [

        { field: 'recorderNameForm', headerName: 'Recording Name', description: "Click cell to update the name", flex: 1, editable: true, },
        { field: 'date', headerName: 'Recording Date', flex: 1, width: 100, editable: false, },
        { field: 'model', headerName: 'Model used', flex: 1, width: 150, editable: false, },
        {
            field: 'status',
            headerName: 'Transcribe Status',
            width: 150,
            editable: false,

            renderCell: (params) => {

                const isTranscribed = params.row['transcribe']
                const id = params.row['id']
                if (isTranscribed === true) {
                    return (
                        <Chip
                            sx={{
                                width: '40px',
                                height: '30px',
                                paddingLeft: '12px',
                                margin: '5px',
                            }}
                            alignItems="center"
                            disableRowSelectionOnClick
                            icon={
                                <Tooltip title="Transcribed">
                                    <CheckIcon label={isTranscribed} style={{ color: "green" }}> </CheckIcon>
                                </Tooltip>
                            }
                        />
                    )
                }
                else if (isTranscribed === false) {
                    return (
                        <Chip
                            sx={{
                                width: '40px',
                                height: '30px',
                                paddingLeft: '12px',
                                margin: '5px',
                            }}
                            alignItems="center"
                            onClick={() => runTranscribeRecording({ id })}
                            disableRowSelectionOnClick
                            icon={
                                <Tooltip title="Click to transcribe recording">
                                    <CancelIcon style={{ color: "#488bc2" }}></CancelIcon>
                                </Tooltip>
                            }
                        />
                    )
                } else if (isTranscribed === "inprogress") {
                    return (
                        <Chip
                            sx={{
                                width: '40px',
                                height: '30px',
                                paddingLeft: '12px',
                                margin: '5px'
                            }}
                            alignItems="center"
                            disableRowSelectionOnClick
                            icon={
                                <Tooltip className={classes} title="Transcribing">
                                    <LoopIcon className={classes.rotateIcon} />
                                </Tooltip>
                            }
                        />
                    )
                }
                else if (isTranscribed === "failed") {
                    return (
                        <Chip
                            sx={{
                                width: '40px',
                                height: '30px',
                                paddingLeft: '12px',
                                margin: '5px'
                            }}
                            alignItems="center"
                            disableRowSelectionOnClick
                            onClick={() => runTranscribeRecording({ id })}
                            icon={
                                <Tooltip className={classes} title="Transcription Failed. Click to retry.">
                                    <ErrorIcon style={{ color: "#bd3e45" }} />
                                </Tooltip>
                            }
                        />
                    )

                }
                else {
                    return (
                        <Chip
                            sx={{
                                width: '40px',
                                height: '30px',
                                paddingLeft: '12px',
                                margin: '5px'
                            }}
                            alignItems="center"
                            disableRowSelectionOnClick
                        />
                    )
                }
            }
        },
        {
            field: 'deleteRow',
            headerName: 'Delete',
            width: 100,
            editable: false,

            renderCell: (params) => {
                const id = params.row['id']
                return (
                    <Chip
                        sx={{
                            width: '40px',
                            height: '30px',
                            paddingLeft: '12px',
                            margin: '5px'
                        }}
                        onClick={() => db.recording.delete(id)}
                        disableRowSelectionOnClick
                        icon={
                            <Tooltip className={classes} title="Delete recording">
                                <DeleteIcon />
                            </Tooltip>
                        }
                    />
                )
            }
        }
    ]

    const [tableData, setTableData] = useState([]);

    const addRowData = queryRecordingData()
        .then(data => setTableData(data))

    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, Math.ceil(time * 1000)))

    const onRowsSelectionHandler = async (value) => {

        if (!value.length) {
            dispatch(setResultsBox(false))
            dispatch(setQuestionBox(false))
            return
        }

        const id = value[0]
        dispatch(datagridRowId(id))
        const recordingData = await db.recording.get(id);

        switch (recordingData.transcribe) {

            case true:
                dispatch(setResultsBox(true))
                dispatch(setRecordingResultsValue(recordingData.outputText));
                dispatch(setQuestionBox(true))
                break;

            case false:
                dispatch(setQuestionBox(false))
                dispatch(setResultsBox(true));
                let outputText = consts.RECORDING_NOT_TRANSCRIBED
                dispatch(setRecordingResultsValue(outputText))
                break;

            case 'inprogress':
                dispatch(setRecordingResultsValue(consts.TRANSCRIPTION_IN_PROGRESS))
                dispatch(setQuestionBox(false))
                dispatch(setResultsBox(true))
                while (true) {
                    const itemStatus = await db.recording.get(id);
                    if (itemStatus.transcribe === 'failed') {
                        dispatch(setRecordingResultsValue(itemStatus.outputText));
                        dispatch(setQuestionBox(false));
                        dispatch(setResultsBox(true));
                        return false;
                    }    
                    if (itemStatus.transcribe !== 'inprogress') {
                        dispatch(setRecordingResultsValue(itemStatus.outputText));
                        dispatch(setQuestionBox(true))
                        return false;
                    }
                    await sleep(1)
                };

            case 'failed':
                dispatch(setQuestionBox(false))
                dispatch(setResultsBox(true))
                dispatch(setRecordingResultsValue(recordingData.outputText));
                break;

        }
    }

    return (
        <div style={{ width: '100%' }}>
            <DataGrid
                sx={{
                    boxShadow: 2,
                    border: 1,
                    backgroundColor: "white",
                    borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                        ':-ms-input-placeholder': '200px'
                    },
                    '& .super-app-theme--header': {
                        backgroundColor: '#7BF3A4',
                    },
                }}
                processRowUpdate={(updatedRow) =>
                    handleRowEditStop(updatedRow)}
                disableRowSelectionOnClick={true}
                autoHeight {...tableData}
                disableMultipleRowSelection={true}
                rows={tableData}
                columns={columns}
                slots={{ noRowsOverlay: RecordingDataGridNoRowsOverlay }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                onRowSelectionModelChange={(ids, e) => onRowsSelectionHandler(ids, e)}
            />
        </div>
    )
}

export default RecordDataGrid;