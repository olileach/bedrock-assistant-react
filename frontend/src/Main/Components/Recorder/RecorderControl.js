
import { AudioRecorder } from 'react-audio-voice-recorder';
import indexDbController from '../../Utils/RecorderUtils';
import { useSelector, useDispatch } from 'react-redux';

const RecordContol = () => {

  const dispatch = useDispatch();

  const transcribe = useSelector((state) => state.autoTranscribeToggle.value);
  const recorderNameForm = useSelector((state) => state.recorderNameForm.value);
  const recorderTimerForm = useSelector((state) => state.recorderTimerForm.number);
  let recorderModelForm = useSelector((state) => state.recorderModelForm.value);
  let addAudio;

  try {

    addAudio = (blob) => {

      if (recorderModelForm === undefined) {
        recorderModelForm = localStorage.getItem("modelTextUsed");
      }
      indexDbController(blob, transcribe, recorderNameForm, recorderModelForm, recorderTimerForm)
    }
  }
  catch {
    return transcribe = "failed";
  }

  return (
    <AudioRecorder
      onRecordingComplete={addAudio}
      audioTrackConstraints={{
        noiseSuppression: true,
        echoCancellation: true,
      }}
      downloadOnSavePress={false}
      downloadFileExtension="webm"
    />
  )
}

export default RecordContol;