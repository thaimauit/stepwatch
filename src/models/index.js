import { all } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import {
  actions as commonActions,
  types as commonTypes,
  selectors as commonSelectors,
  reducer as commonReducer,
  saga as commonSaga,
} from './common';

import {
  actions as profileActions,
  types as profileTypes,
  selectors as profileSelectors,
  reducer as profileReducer,
  saga as profileSaga,
} from './profile';

import {
  actions as runActions,
  types as runTypes,
  selectors as runSelectors,
  reducer as runReducer,
} from './run';

import {
  actions as walletActions,
  types as walletTypes,
  selectors as walletSelectors,
  reducer as walletReducer,
  saga as walletSaga,
} from './wallet';

const selectors = {
  common: commonSelectors,
  profile: profileSelectors,
  run: runSelectors,
  wallet: walletSelectors,
};

const actionTypes = {
  common: commonTypes,
  profile: profileTypes,
  run: runTypes,
  wallet: walletTypes,
};

const actions = {
  common: commonActions,
  profile: profileActions,
  run: runActions,
  wallet: walletActions,
};

const rootReducer = combineReducers({
  common: commonReducer,
  profile: profileReducer,
  run: runReducer,
  wallet: walletReducer,
});

function* rootSaga() {
  yield all([commonSaga(), profileSaga(), walletSaga()]);
}

export { actions, actionTypes as types, selectors, rootReducer, rootSaga };
