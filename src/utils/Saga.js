import { get, isArray } from 'lodash';
import { takeEvery, put, call } from 'redux-saga/effects';
import { actions } from 'src/models';

function actionWithLoading(type, action) {
  return function* nextAction(data) {
    yield put(actions.common.updateLoading({ type, loading: true }));
    yield call(action, data);
    yield put(actions.common.updateLoading({ type, loading: false }));
  };
}

function* sagaFunction(type, effect, action) {
  yield effect(type, actionWithLoading(type, action));
}

export function combineWatchers(actionConfigs) {
  const sagas = Object.keys(actionConfigs).map(type => {
    const action = actionConfigs[type];
    if (typeof action === 'function')
      return sagaFunction(type, takeEvery, action);

    if (isArray(action)) {
      const actionFn = get(action, '0');
      const actionEff = get(action, '1', takeEvery);
      return sagaFunction(type, actionEff, actionFn);
    }
  });
  return sagas;
}
