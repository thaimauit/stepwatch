import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import constants from 'src/constants';
import { actions, selectors } from 'src/models';
import MessageView from './view';

const MessageBox = () => {
  const {
    content = '',
    visible,
    autoClose,
    type = constants.common.MESSAGE_TYPES.SUCCESS,
  } = useSelector(selectors.common.message) || {};

  const dispatch = useDispatch();

  const hideMessage = () => {
    dispatch(actions.common.hideMessage());
  };

  return (
    <MessageView
      visible={visible}
      content={content}
      autoClose={autoClose}
      type={type}
      onHide={hideMessage}
    />
  );
};

export default React.memo(MessageBox);

export { MessageView };
