import { createSelector } from 'reselect';
const allLoading = state => state.common.loading;
export const constants = state => state.common.constants;
export const systemNetworks = state => state.common.networks;
export const walletPin = state => state.common.walletPin;

export const loading = createSelector(
  type => type,
  type => {
    return createSelector(allLoading, loadings => loadings[type]);
  },
);
export const getConstantByKey = createSelector(
  key => key,
  key => {
    return createSelector(constants, constantData => constantData[key]);
  },
);
export const actionModalData = state => state.common.actionModalData;

export const message = state => state.common.message;
export const toast = state => state.common.toast;

export const isAccountDrawer = state => state.common.isAccountDrawer;
