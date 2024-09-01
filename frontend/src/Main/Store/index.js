import { configureStore } from '@reduxjs/toolkit';
import tableSwitchReducer from '../Redux/TableSwitchToggle';
import chartSwitchReducer from '../Redux/ChartSwitchToggle';
import timerSwitchReducer from '../Redux/TimerSwitchToggle';
import autoTranscribeSwitchReducer from '../Redux/AutoTranscribeSwitchToggle';
import recordModelFormReducer from '../Redux/RecorderModelForm';
import recordNameFormReducer from '../Redux/RecorderNameForm';
import recordTimerFormReducer from '../Redux/RecorderTimerForm';
import setRecordingResultsValueReducer from '../Redux/RecorderResultsBoxValue';
import optionsSwitchReducer from '../Redux/OptionsSwitchToggle';
import datagridRowIdReducer from '../Redux/DataGridRowId';
import questionBoxReducer from '../Redux/RecorderQuestionBox';
import resultsBoxReducer from '../Redux/RecordingResultsBox';

export const store = configureStore({
  reducer: {
    tableToggle: tableSwitchReducer,
    chartToggle: chartSwitchReducer,
    timerToggle: timerSwitchReducer,
    autoTranscribeToggle: autoTranscribeSwitchReducer,
    recorderModelForm: recordModelFormReducer,
    recorderNameForm: recordNameFormReducer,
    recorderTimerForm: recordTimerFormReducer,
    recorderResultsValue: setRecordingResultsValueReducer,
    optionsSwitch: optionsSwitchReducer,
    datagridRowId: datagridRowIdReducer,
    questionBox: questionBoxReducer,
    resultsBox: resultsBoxReducer,
  },
})