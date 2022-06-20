import { types } from './actions';

const initState = {
  token: '',
  userData: {},
  nfts: [],
  isSkipCode: false,
  boxs: [],
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case types.SAVE_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case types.UPDATE_REFID:
      return {
        ...state,
        userData: {
          ...state.userData,
          referralId: action.payload,
        },
      };
    case types.UPDATE_DISPLAY_NAME:
      return {
        ...state,
        userData: {
          ...state.userData,
          displayName: action.payload,
        },
      };
    case types.UPDATE_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.payload,
        },
      };
    case types.SKIP_CODE:
      return {
        ...state,
        userData: {
          ...state.userData,
          skipReferral: true,
        },
      };
    default:
      return state;
  }
}
