import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ViewPropTypes,
  TouchableOpacity,
  // Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import constants from 'src/constants';
import Text from '../Text';
import { Icon } from '../Icon';

const MESSAGE_TIME_BOX = 4000;

const MessageView = props => {
  const {
    content = '',
    visible,
    autoClose,
    type = constants.common.MESSAGE_TYPES.SUCCESS,
    onHide,
    isModal,
    hideClose,
    style,
    contentStyle,
  } = props;

  const { top } = useSafeAreaInsets();

  const timer = useRef();

  useEffect(() => {
    if (!visible) return;
    clearTimeout(timer.current);
    if (autoClose)
      timer.current = setTimeout(() => {
        onHide();
      }, MESSAGE_TIME_BOX);
  }, [visible, autoClose, onHide]);

  const renderContent = () => {
    const backgroundColor = theme.colors.messageBox[type];
    return (
      <View style={[styles.content, { backgroundColor }, contentStyle]}>
        <View style={styles.contentMessage}>
          <Text color="#fff">{content}</Text>
        </View>
        {!hideClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onHide}>
            <Icon name="close" color={'#fff'} size={20} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!isModal) {
    if (!visible) return <View />;
    return <View style={[styles.container, style]}>{renderContent()}</View>;
  }

  if (!visible) return <View />;
  return (
    <View style={[styles.containerModal, { top: top + 25 }]}>
      {renderContent()}
    </View>
  );
};

MessageView.propTypes = {
  type: PropTypes.string,
  content: PropTypes.string,
  autoClose: PropTypes.bool,
  visible: PropTypes.bool,
  onHide: PropTypes.func,
  isModal: PropTypes.bool,
  hideClose: PropTypes.bool,
  style: ViewPropTypes.style,
  contentStyle: ViewPropTypes.style,
  isGlobal: PropTypes.bool,
};

MessageView.defaultProps = {
  isModal: true,
  isGlobal: true,
  content: '',
  visible: false,
  autoClose: true,
  hideClose: false,
  type: constants.common.MESSAGE_TYPES.SUCCESS,
  style: {},
  contentStyle: {},
  onHide: () => {},
};

export default React.memo(MessageView);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  containerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    minWidth: '80%',
    maxWidth: '90%',
    borderRadius: 10,
    paddingRight: 0,
    alignItems: 'center',
  },
  contentMessage: {
    flex: 1,
    padding: 10,
    paddingRight: 0,
  },
  closeBtn: {
    padding: 10,
    paddingLeft: 5,
  },
});
