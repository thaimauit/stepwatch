const types = {
  SAVE_DATA: 'run@SAVE_DATA',
  START: 'run@START',
  STOP: 'run@STOP',
  PAUSE: 'run@PAUSE',
  RESUME: 'run@RESUME',
  UPDATE_TIMER: 'run@UPDATE_TIMER',
  UPDATE_STEP: 'run@UPDATE_STEP',
  UPDATE_LOCATION: 'run@UPDATE_LOCATION',
  SUBMIT: 'run@SUBMIT',
  UPDATE: 'run@UPDATE',
  UPDATE_EST_EARN: 'run@UPDATE_EST_EARN',
};

const actions = {
  saveData: data => ({
    type: types.SAVE_DATA,
    payload: data,
  }),
  start: watch => ({
    type: types.START,
    payload: {
      watch,
    },
  }),
  stop: () => ({
    type: types.STOP,
  }),
  submit: () => ({
    type: types.SUBMIT,
  }),
  pause: () => ({
    type: types.PAUSE,
  }),
  resume: () => ({
    type: types.RESUME,
  }),
  updateTimer: endTime => ({
    type: types.UPDATE_TIMER,
    payload: endTime,
  }),
  updateStep: newSteps => ({
    type: types.UPDATE_STEP,
    payload: newSteps,
  }),
  updateLocation: newLocation => ({
    type: types.UPDATE_LOCATION,
    payload: newLocation,
  }),
  update: params => ({
    type: types.UPDATE,
    payload: params,
  }),
  updateEstEarn: newEarn => ({
    type: types.UPDATE_EST_EARN,
    payload: newEarn,
  }),
};
export { types, actions };
