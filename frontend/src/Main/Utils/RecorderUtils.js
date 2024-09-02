import Dexie from 'dexie';
import * as consts from '../Constants/index'

const db = new Dexie('BedrockRecorder');

db.version(1).stores({
    recording: '++id, data' // Primary key and indexed props
});

async function indexDbController(blob = false, transcribe, recorderNameForm = false, model, recorderTimerForm = false) {

    if (transcribe === false) {
        addRecordingData(blob,
            recorderNameForm,
            model,
            transcribe,
            recorderTimerForm);
    }

    let id;
    let transcribeResults;
    let bedrockResults;
    let outputText;

    try {

        if (transcribe === true) {
            id = await addRecordingData(blob,
                recorderNameForm,
                model,
                transcribe = "inprogress",
                recorderTimerForm,
                outputText = consts.TRANSCRIPTION_IN_PROGRESS);
            transcribeResults = await transcribeText(id, blob);
            bedrockResults = bedrockText(id, transcribeResults, model)
        }
    }
    catch (error) {
        console.error(error)
        await db.recording.update(
            id, { transcribe: "failed", error: true, outputText: error }
        )
    }
}

async function queryRecordingData() {

    let rowsArray = [];
    const all = await db.recording.toArray()

    for (let i = 0; i < all.length; i++) {

        rowsArray.push({

            'id': all[i].id,
            'recorderNameForm': all[i].recorderNameForm,
            'recording': all[i].recording,
            'model': all[i].model,
            'date': all[i].date,
            'transcribe': all[i].transcribe
        });
    }

    return rowsArray
};

async function getIndexedDbValueFromId(id) {

    const item = await db.recording.get(id);
    return (item)

}

async function updateItem(id, props) {

    console.log(props)
    await db.recording.update(
        id, props
    ).then(function (done) {
        console.log(done)
    });
}

async function bedrockText(id, text, model, followup = false) {

    const bedrockPayload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "x-model-name": model
        },
        body: text
    };

    const bedrockRequest = await fetch(`${process.env.REACT_APP_BASE_URL}` + "/api/bedrock", bedrockPayload);
    let bedrockResponse = await bedrockRequest.text();

    if (followup !== false) {
        await getIndexedDbValueFromId(id)
        let updatedBedrockResponse = ''.concat(followup, "\n\n", bedrockResponse)
        updateBedrockText(id, updatedBedrockResponse);
        return (updatedBedrockResponse);
    } else {
        updateBedrockText(id, bedrockResponse);
        return (bedrockResponse);
    }
};

async function transcribeText(id, blob) {

    try {
        const transcribePayload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: blob
        };
        const transcribeRequest = await fetch(`${process.env.REACT_APP_BASE_URL}` + "/api/transcribe", transcribePayload);
        const transcribeResponse = await transcribeRequest.json();
        updateTranscribeText(id, transcribeResponse['jobTextResult']);

        await db.recording.where({ id: id })
                          .modify((item) => { delete item.recording })
                          .then(function (done) {
                        });

        return (transcribeResponse['jobTextResult'])
    }
    catch (error) {
        throw error;
    }

}

async function updateRecordNameCell(id, text) {

    await db.recording.update(
        id, { recorderNameForm: text }
    )
}

async function updateTranscribeText(id, transcribeText) {

    await db.recording.update(
        id, { transcribeText: transcribeText }
    ).then(function (update) {
        if (update === 1 ? "updated" : "notupdated");
    });
}

async function updateBedrockText(id, bedrockText) {

    await db.recording.update(
        id, { transcribe: true, outputText: bedrockText }
    ).then(function (update) {
    });
}

async function runTranscribeItem(id, model) {

    const item = await db.recording.get(id);
    await db.recording.update(id, { transcribe: "inprogress", outputText: consts.TRANSCRIPTION_IN_PROGRESS });
    const transcribeRequest = await transcribeText(id, item.recording);
    const bedrockResults = await bedrockText(id, transcribeRequest, model);
    await db.recording.update(id, { transcribe: true });
    return bedrockResults;


}

async function addRecordingData(blob, recorderNameForm, model, transcribe, recorderTimerForm, outputText = false) {

    const now = new Date();
    const date = now.toLocaleString();

    if (recorderTimerForm === undefined ? recorderTimerForm = false : recorderTimerForm);

    const id = await db.table('recording').add({
        date: date
    })

    if (recorderNameForm === "null" ? recorderNameForm = "Recording " + id : recorderNameForm);

    await db.recording.update(
        id, {
        recording: blob, recorderNameForm: recorderNameForm, model: model, transcribe: transcribe,
        recorderTimerForm: recorderTimerForm, outputText: outputText
    }
    ).then(function (update) {
    });

    return (id);
}

export default indexDbController;
export {
    bedrockText,
    getIndexedDbValueFromId,
    queryRecordingData,
    runTranscribeItem,
    updateItem,
    updateRecordNameCell,
    updateTranscribeText,
};