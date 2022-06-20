import { isArray } from 'lodash';
import { all, call, put } from 'redux-saga/effects';
import services from 'src/services';
import { SagaUtils } from 'src/utils';
import { actions, types } from './actions';

const sagaActions = {
  [types.GET_CONSTANTS]: function* getConstants() {
    const { data } = yield call(services.system.getConstants);
    yield put(actions.saveData({ constants: data }));
  },
  [types.GET_NETWORKS]: function* getSystemNetworks() {
    const { data, success } = yield call(services.system.getNetworks);
    if (success && isArray(data)) {
      const defaultNetwork = data.find(({ isDefault }) => isDefault);
      if (!defaultNetwork) return;
      yield put(actions.saveData({ networks: defaultNetwork }));
    }
  },
  // [types.UPLOAD_PHOTOS]: function* uploadPhotos({
  //   payload: photos,
  //   onSuccess,
  //   onFail,
  // }) {
  //   const uploadMap = photos.map(photo => {
  //     return {
  //       id: photo.id,
  //       uploader: call(services.common.uploadPhoto, photo),
  //     };
  //   });
  //   for (let item of uploadMap) {
  //     const { uploader, id } = item;
  //     const { success, data } = yield uploader;
  //     if (success) return onSuccess(id, data.name);
  //     onFail(id);
  //   }
  // },
};

export default function* saga() {
  const watchers = SagaUtils.combineWatchers(sagaActions);
  yield all(watchers);
}
