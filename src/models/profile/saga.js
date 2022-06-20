import { all, call, put } from 'redux-saga/effects';
import services from 'src/services';
import { Logger, MessageBox, SagaUtils, Toast } from 'src/utils';
import { types, actions } from './actions';
import { actions as walletActions } from '../wallet';
import { actions as runActions } from '../run';
import { isArray } from 'lodash';

const sagaActions = {
  [types.LOGIN]: function* login({ payload: { params, callback, onFail } }) {
    const { success, error, data } = yield call(services.user.login, params);
    if (!success) {
      if (error?.code === 'GACODE_REQUIRED')
        return callback({ isGaRequire: true });
      onFail();
      if (error?.code === 'WRONG_CREDENTIALS')
        return MessageBox.showError('Email or password is wrong');

      return MessageBox.showError(error?.msg || 'Login fail. Pleasr try again');
    }
    yield put(actions.saveData({ token: data.accessToken }));
    callback({});
  },
  [types.GET_PROFILE]: function* getProfile({ callback }) {
    const { success, data } = yield call(services.user.getProfile);
    if (callback) callback(success ? data : null);
    if (!success) return Toast.show('Get user fail');
    yield put(actions.saveData({ userData: data }));
  },
  [types.LOGOUT]: function* logout() {
    services.setToken('');
    yield put(walletActions.saveData({ wallet: {} }));
    yield put(
      actions.saveData({
        userData: {},
        token: '',
        isSkipCode: false,
      }),
    );
    yield put(
      runActions.saveData({
        currentProgress: {},
      }),
    );
  },
  [types.GET_NFTS]: function* getNftList() {
    const { data } = yield call(services.nft.getMyNfts);
    if (isArray(data)) yield put(actions.saveData({ nfts: data }));
  },
  [types.GET_BOXS]: function* getBoxs() {
    const { data } = yield call(services.nft.getMyBoxs);
    if (isArray(data)) yield put(actions.saveData({ boxs: data }));
  },
};

export default function* saga() {
  const watchers = SagaUtils.combineWatchers(sagaActions);
  yield all(watchers);
}
