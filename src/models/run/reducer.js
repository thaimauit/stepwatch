import { last } from 'lodash';
import { Utils } from 'src/utils';
import { types } from './actions';

const initState = {
  currentProgress: {},
  histories: [],
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case types.SAVE_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case types.START:
      const now = Date.now();
      const nowValue = now - (now % 1000);

      return {
        ...state,
        currentProgress: {
          createdAt: nowValue,
          startTime: nowValue,
          endTime: nowValue,
          duration: 0,
          steps: 0,
          distance: 0,
          currentLocation: null,
          locations: [],
          watch: action.payload.watch,
        },
      };
    case types.UPDATE:
      return {
        ...state,
        currentProgress: {
          ...state.currentProgress,
          ...action.payload,
        },
      };
    case types.UPDATE_TIMER:
      return {
        ...state,
        currentProgress: {
          ...state.currentProgress,
          endTime: action.payload
            ? action.payload
            : state.currentProgress.endTime + 1000,
        },
      };
    case types.UPDATE_STEP:
      return {
        ...state,
        currentProgress: {
          ...state.currentProgress,
          steps: state.currentProgress.steps + action.payload,
        },
      };

    case types.UPDATE_LOCATION:
      const lastLocation = last(state.currentProgress.locations);
      const newLocation = {
        ...action.payload,
        steps: state.currentProgress.steps || 0,
      };
      let newDistance = 0;
      if (lastLocation) {
        const hasStep = lastLocation.steps !== state.currentProgress.steps;
        if (hasStep) newDistance = Utils.getDistance(lastLocation, newLocation);
      }

      const newLocations = [...state.currentProgress.locations, newLocation];
      return {
        ...state,
        currentProgress: {
          ...state.currentProgress,
          distance:
            state.currentProgress.distance +
            (state.currentProgress.steps && state.currentProgress.steps > 5
              ? newDistance
              : 0),
          locations: newLocations,
          currentLocation: newLocation,
        },
      };
    case types.PAUSE:
      return {
        ...state,
        currentProgress: {
          ...state.currentProgress,
          duration:
            state.currentProgress.duration +
            (state.currentProgress.endTime - state.currentProgress.startTime),
          startTime: 0,
          endTime: 0,
          isPaused: true,
        },
      };
    case types.RESUME:
      const nowResume = Date.now();
      const nowResumeValue = nowResume - (nowResume % 1000);
      return {
        ...state,
        currentProgress: {
          ...state.currentProgress,
          startTime: nowResumeValue,
          endTime: nowResumeValue,
          isPaused: false,
        },
      };
    case types.STOP:
      return {
        ...state,
        currentProgress: {},
      };
    case types.UPDATE_EST_EARN:
      return {
        ...state,
        currentProgress: {
          ...state.currentProgress,
          estimateEarn: action.payload,
        },
      };

    default:
      return state;
  }
}
