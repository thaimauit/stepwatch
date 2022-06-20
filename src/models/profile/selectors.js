import { isEmpty } from 'lodash';

export const isSigned = state =>
  !!state.profile.token && !isEmpty(state.profile.userData);
export const token = state => state.profile.token;
export const userData = state => state.profile.userData;
export const nfts = state => state.profile.nfts;
export const boxs = state => state.profile.boxs;
export const userAddress = state => state.profile.userData.address;
export const isSkipCode = state => state.profile.isSkipCode;
