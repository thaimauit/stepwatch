import { all } from 'redux-saga/effects';
import { SagaUtils } from 'src/utils';

const sagaActions = {
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
