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

            if (transcribeResults['transcribeFailed'] === false){
                bedrockResults = bedrockSummary(id, transcribeResults['jobTextResult'], model)
            }
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

async function getItem(id) {

    const item = await db.recording.get(id);
    return (item)

}

async function updateItem(id, props) {

    await db.recording.update(
        id, props
    ).then(function (done) {
    });
}

async function bedrockSummary(id, text, model, followup = false) {

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
        await getItem(id)
        let updatedBedrockResponse = ''.concat(followup, "\n\n", bedrockResponse)
        updateItem(id, { "transcribe": true, "outputText": updatedBedrockResponse })
        return (updatedBedrockResponse);
    } else {
        updateItem(id, { "transcribe": true, "outputText": bedrockResponse })
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

        updateItem(id, {"transcribeText": transcribeResponse['jobTextResult']})

        if (transcribeResponse['transcribeFailed'] === false){

            await db.recording.where({ id: id })
                            .modify((item) => { delete item.recording })
                            .then(function (done) {
                          });
        } else {
            updateItem(id, {"transcribe" : "failed", "outputText" : transcribeResponse['jobTextResult']})
        }
        return (transcribeResponse)
    }
    catch (error) {
        throw error;
    }

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
    bedrockSummary,
    getItem,
    queryRecordingData,
    transcribeText,
    updateItem,
};