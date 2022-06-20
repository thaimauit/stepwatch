import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from 'src/models';
import ToastView, { TOAST_POSITIONS } from './view';

const MessageBox = () => {
  const {
    content = '',
    visible,
    delay,
    position,
  } = useSelector(selectors.common.toast) || {};

  const dispatch = useDispatch();

  const hide = () => {
    dispatch(actions.common.hideToast());
  };

  return (
    <ToastView
      visible={visible}
      content={content}
      onHide={hide}
      delay={delay}
      position={position}
    />
  );
};

export default React.memo(MessageBox);

export { ToastView, TOAST_POSITIONS };
