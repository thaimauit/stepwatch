import { last } from 'lodash';
import { Utils } from 'src/utils';
import { types } from './actions';

const initState = {
  wallet: {
    mnemonic: '',
    privateKey: '',
    path: '',
    name: '',
  },
  fundings: [],
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case types.SAVE_DATA:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}
