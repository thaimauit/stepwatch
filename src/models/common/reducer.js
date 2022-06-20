import { types } from './actions';

const initState = {
  loading: {},
  actionModalData: {
    visible: false,
    modalProps: {},
    type: '',
    name: '',
  },
  message: {
    content: '',
    autoClose: true,
    type: '',
    visible: false,
  },
  toast: {
    visible: false,
    content: '',
    delay: 0,
  },
  isAccountDrawer: true,
  constants: {},
  networks: {},
  walletPin: '',
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case types.SAVE_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case types.UPDATE_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading,
        },
      };
    case types.UPDATE_ACTION_MODAL:
      return {
        ...state,
        actionModalData: action.payload,
      };
    case types.SHOW_MESSAGE:
      return {
        ...state,
        message: {
          ...state.message,
          visible: true,
          ...action.payload.message,
        },
      };
    case types.HIDE_MESSAGE:
      return {
        ...state,
        message: {
          content: '',
          autoClose: true,
          type: '',
          visible: false,
        },
      };
    case types.SHOW_TOAST:
      return {
        ...state,
        toast: {
          visible: true,
          content: action.payload.content,
          delay: action.payload.delay,
          position: action.payload.position,
        },
      };
    case types.HIDE_TOAST:
      return {
        ...state,
        toast: {
          content: '',
          visible: false,
        },
      };
    default:
      return state;
  }
}
