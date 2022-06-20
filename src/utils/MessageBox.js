import constants from 'src/constants';
import { actions } from 'src/models';
import { store } from 'src/redux';

export const showError = (content, autoClose = true) => {
  store.dispatch(
    actions.common.showMessage({
      content,
      autoClose,
      type: constants.common.MESSAGE_TYPES.ERROR,
    }),
  );
};

export const showSuccess = (content, autoClose = true) => {
  store.dispatch(
    actions.common.showMessage({
      content,
      autoClose,
      type: constants.common.MESSAGE_TYPES.SUCCESS,
    }),
  );
};
