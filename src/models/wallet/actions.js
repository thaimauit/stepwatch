const types = {
  SAVE_DATA: 'wallet@SAVE_DATA',
  GET_FUNDING: 'wallet@GET_FUNDING',
};

const actions = {
  saveData: data => ({
    type: types.SAVE_DATA,
    payload: data,
  }),
  getFundingWallet: callback => ({
    type: types.GET_FUNDING,
    callback,
  }),
};
export { types, actions };
