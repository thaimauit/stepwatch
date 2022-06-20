import React, { useCallback } from 'react';
import { View, StyleSheet, Modal, Image as RNImage } from 'react-native';
import PropTypes from 'prop-types';
import { ImageAssets } from 'src/assets';
import theme from 'src/theme';
import Text from './Text';
import Button from './Button';
import ButtonWithBg from './ButtonWithBg';

const Confirm = props => {
  const {
    visible,
    title,
    titleProps,
    content,
    contentProps,
    children,
    onConfirm,
    onClose,
    submitLabel,
    cancelLabel,
  } = props;

  const renderContent = useCallback(() => {
    if (children) return children;
    if (content)
      return (
        <Text color="#fff" size={15} center {...contentProps}>
          {content}
        </Text>
      );
  }, [content, contentProps, children]);

  return (
    <Modal transparent visible={visible}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.bgView}>
            <RNImage source={ImageAssets.squareLinearBg} style={styles.bg} />
          </View>
          <View style={styles.header}>
            <View style={styles.headerSide} />
            <Text
              bold
              color="#fff"
              size={25}
              center
              style={styles.title}
              {...titleProps}>
              {title}
            </Text>
            <Button
              style={[styles.headerSide, styles.closeBtn]}
              icon={{ name: 'close', size: 25 }}
              onPress={onClose}
            />
          </View>
          <View style={styles.body}>{renderContent()}</View>
          <View style={styles.footer}>
            <ButtonWithBg
              borderRadius={45}
              style={styles.cancelBtn}
              title={cancelLabel}
              titleProps={{ bold: true, size: 15 }}
              onPress={onClose}
            />
            <Button
              style={styles.submitBtn}
              title={submitLabel}
              titleProps={{ bold: true, size: 15 }}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

Confirm.propTypes = {
  visible: PropTypes.bool,
  titleProps: PropTypes.object,
  contentProps: PropTypes.object,
  cancelLabel: PropTypes.string,
  submitLabel: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

Confirm.defaultProps = {
  title: 'NOTICE',
  titleProps: {},
  contentProps: {},
  cancelLabel: 'Cancel',
  submitLabel: 'Confirm',
};

export default React.memo(Confirm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  content: {
    width: '85%',
    padding: theme.contentPadding,
  },
  bgView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  title: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSide: {
    width: 40,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  closeBtn: {
    backgroundColor: theme.colors.button.primary,
    borderWidth: 1,
    height: 40,
    borderRadius: 40,
  },
  body: {
    paddingVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    height: 45,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#fff',
    width: '40%',
    marginRight: 10,
  },
  submitBtn: {
    height: 45,
    borderRadius: 45,
    alignItems: 'center',
    width: '40%',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
