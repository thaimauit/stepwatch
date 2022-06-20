import { isEmpty } from 'lodash';
import { createSelector } from 'reselect';

export const currentProgress = state => state.run.currentProgress;

export const isStarted = createSelector(
  currentProgress,
  progress => !isEmpty(progress),
);

export const currentLocations = createSelector(
  currentProgress,
  progress => progress.locations,
);

export const isPaused = createSelector(
  currentProgress,
  progress => !isEmpty(progress) && progress.isPaused,
);
