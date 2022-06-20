const types = {
  SAVE_DATA: 'common@SAVE_DATA',
  UPDATE_ACTION_MODAL: 'common@UPDATE_ACTION_MODAL',
  UPDATE_LOADING: 'common@UPDATE_LOADING',
  SHOW_MESSAGE: 'common@SHOW_MESSAGE',
  HIDE_MESSAGE: 'common@HIDE_MESSAGE',
  SHOW_TOAST: 'common@SHOW_TOAST',
  HIDE_TOAST: 'common@HIDE_TOAST',
  UPLOAD_PHOTOS: 'common@UPLOAD_PHOTOS',
  GET_CONSTANTS: 'common@GET_CONSTANTS',
  GET_NETWORKS: 'common@GET_NETWORKS',
};

const actions = {
  saveData: data => ({
    type: types.SAVE_DATA,
    payload: data,
  }),
  updateLoading: ({ type, loading }) => ({
    type: types.UPDATE_LOADING,
    payload: { type, loading },
  }),
  updateActionModal: params => ({
    type: types.UPDATE_ACTION_MODAL,
    payload: params,
  }),
  showMessage: message => ({
    type: types.SHOW_MESSAGE,
    payload: { message },
  }),
  hideMessage: () => ({
    type: types.HIDE_MESSAGE,
  }),
  showToast: (content, position, delay) => ({
    type: types.SHOW_TOAST,
    payload: { content, delay, position },
  }),
  hideToast: () => ({
    type: types.HIDE_TOAST,
  }),
  getConstants: () => ({
    type: types.GET_CONSTANTS,
  }),
  getSystemNetworks: () => ({
    type: types.GET_NETWORKS,
  }),
};
export { types, actions };
