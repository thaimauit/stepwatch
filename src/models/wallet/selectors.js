import { isEmpty } from 'lodash';
import { createSelector } from 'reselect';

export const wallet = state => state.wallet.wallet;
export const fundings = state => state.wallet.fundings;
