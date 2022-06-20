import { TOAST_POSITIONS } from 'src/components';
import { actions } from 'src/models';
import { store } from 'src/redux';

export const show = (
  content,
  position = TOAST_POSITIONS.BOTTOM,
  delay = 4000,
) => {
  store.dispatch(actions.common.showToast(content, position, delay));
};
