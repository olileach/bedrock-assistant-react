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
import { runTranscribeItem, 
         queryRecordingData,
         updateRecordNameCell,
         updateTranscribeText,
         updatedItem } from '../../Utils/RecorderUtils';
import ErrorIcon from '@mui/icons-material/Error';
import { useDispatch, useSelector } from 'react-redux';
import { setRecordingResultsValue } from '../../Redux/RecorderResultsBoxValue';
import { setResultsBox } from '../../Redux/RecordingResultsBox';
import { setQuestionBox } from '../../Redux/RecorderQuestionBox';
import { datagridRowId } from "../../Redux/DataGridRowId";

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

    const handleRowEditStop = (newRow) => {
        updateRecordNameCell(newRow.id, newRow.recorderNameForm);

    };

    const transcribeRecording = async (e) => {

        if (dataGridCheckboxRowId) { 
            dispatch(setResultsBox(true))}
        else {
            dispatch(setResultsBox(false))
        }
        const id = parseInt(e['id']);
        
        dispatch(setRecordingResultsValue("Transcription in progress. Please wait."))
        const itemStatus = await db.recording.get(id);
        const bedrockResults = await runTranscribeItem(id, itemStatus.model);
        dispatch(setRecordingResultsValue(bedrockResults));
        dispatch(setQuestionBox(true));

    }

    const columns = [
        // { field: 'id',  hide: true},
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
                        <
                            Chip
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
                        <
                            Chip
                            sx={{
                                width: '40px',
                                height: '30px',
                                paddingLeft: '12px',
                                margin: '5px',
                            }}
                            alignItems="center"
                            onClick={() => transcribeRecording({ id })}
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
                        <
                            Chip
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
                        <
                            Chip
                            sx={{
                                width: '40px',
                                height: '30px',
                                paddingLeft: '12px',
                                margin: '5px'
                            }}
                            alignItems="center"
                            disableRowSelectionOnClick
                            onClick={() => transcribeRecording({ id })}
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
                        <
                            Chip
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
                return <
                    Chip
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
                let outputText = "Recording not transcribed. " +
                    "Use the icon in the table to transcribe your recording."
                dispatch(setRecordingResultsValue(outputText))
                break;

            case 'inprogress':
                dispatch(setRecordingResultsValue("Transcription in progress. Please wait."))
                dispatch(setQuestionBox(false))
                dispatch(setResultsBox(true))
                while (true) {
                    const itemStatus = await db.recording.get(id);
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

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .no-rows-primary': {
        fill: theme.palette.mode === 'light' ? '#AEB8C2' : '#3D4751',
    },
    '& .no-rows-secondary': {
        fill: theme.palette.mode === 'light' ? '#E8EAED' : '#1D2126',
    },
}));


function RecordingDataGridNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width={96}
                viewBox="0 0 452 257"
                aria-hidden
                focusable="false"
            >
                <path
                    className="no-rows-primary"
                    d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
                />
                <path
                    className="no-rows-primary"
                    d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
                />
                <path
                    className="no-rows-secondary"
                    d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
                />
            </svg>
            <Box sx={{ mt: 2 }}>No rows</Box>
        </StyledGridOverlay>
    );
}

export default RecordDataGrid;