const types = {
  SAVE_DATA: 'profile@SAVE_DATA',
  UPDATE_KM: 'profile@UPDATE_KM',
  LOGIN: 'profile@LOGIN',
  LOGOUT: 'profile@LOGOUT',
  GET_PROFILE: 'profile@GET_PROFILE',
  GET_NFTS: 'profile@GET_NFT',
  GET_BOXS: 'profile@GET_BOX',
  UPDATE_REFID: 'profile@UPDATE_REFID',
  UPDATE_DISPLAY_NAME: 'profile@UPDATE_DISPLAY_NAME',
  UPDATE_USER_DATA: 'profile@UPDATE_USER_DATA',
  SKIP_CODE: 'profile@SKIP_CODE',
};

const actions = {
  saveData: data => ({
    type: types.SAVE_DATA,
    payload: data,
  }),
  getProfile: callback => ({
    type: types.GET_PROFILE,
    callback,
  }),
  updateKm: newKm => ({
    type: types.UPDATE_KM,
    payload: newKm,
  }),
  login: (params, callback, onFail) => ({
    type: types.LOGIN,
    payload: {
      params,
      callback,
      onFail,
    },
  }),
  logout: () => ({
    type: types.LOGOUT,
  }),
  getNFT: () => ({
    type: types.GET_NFTS,
  }),
  getBox: () => ({
    type: types.GET_BOXS,
  }),
  updateRefId: refId => ({
    type: types.UPDATE_REFID,
    payload: refId,
  }),
  updateDisplayName: newName => ({
    type: types.UPDATE_DISPLAY_NAME,
    payload: newName,
  }),
  updateUserData: newData => ({
    type: types.UPDATE_USER_DATA,
    payload: newData,
  }),
  skipCode: () => ({
    type: types.SKIP_CODE,
  }),
};
export { types, actions };
