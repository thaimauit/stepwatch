import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import { Icon, Text } from 'src/components';

var CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.linear,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
};

if (Platform.OS === 'android')
  if (UIManager.setLayoutAnimationEnabledExperimental)
    UIManager.setLayoutAnimationEnabledExperimental(true);

const ActionItem = props => {
  const { data, onPressItem } = props;
  const { childs } = data;
  const [isExpand, setIsExpand] = useState(false);

  const onPress = useCallback(
    item => () => {
      if (!isEmpty(item.childs)) {
        LayoutAnimation.configureNext(CustomLayoutLinear);
        return setIsExpand(true);
      }
      onPressItem(item);
    },
    [onPressItem],
  );

  const onPressSeparator = useCallback(() => {
    LayoutAnimation.configureNext(CustomLayoutLinear);
    setIsExpand(false);
  }, []);

  const renderChild = useCallback(
    isChild => (content, index) => {
      const style = {};
      if (isChild)
        if (index === 0) {
          style.borderTopRightRadius = 0;
          style.borderBottomRightRadius = 0;
        } else {
          style.borderTopLeftRadius = 0;
          style.borderBottomLeftRadius = 0;
        }
      else style.marginHorizontal = '5%';

      return (
        <TouchableOpacity style={styles.itemWrapper} key={content.key}>
          <View>
            <TouchableOpacity
              style={[styles.item, style]}
              onPress={onPress(content)}>
              <Icon {...content.icon} size={25} color="#fff" />
            </TouchableOpacity>
            <Text color="#fff" bold center size={10}>
              {content.name}
            </Text>
          </View>
          {isChild && index === 0 && (
            <TouchableOpacity
              style={styles.separator}
              onPress={onPressSeparator}
            />
          )}
        </TouchableOpacity>
      );
    },
    [onPress, onPressSeparator],
  );

  const renderContent = useCallback(() => {
    const hasChild = !isEmpty(childs);
    if (!isExpand || !hasChild) return renderChild()(data);
    return (
      <TouchableOpacity style={styles.expandView}>
        {childs.map(renderChild(true))}
      </TouchableOpacity>
    );
  }, [isExpand, childs, renderChild, data]);

  return <View>{renderContent()}</View>;
};

ActionItem.propTypes = {
  data: PropTypes.object.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

export default React.memo(ActionItem);

const styles = StyleSheet.create({
  item: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: theme.colors.button.primary,
    width: 50,
    marginBottom: 5,
  },
  expandView: {
    flexDirection: 'row',
    width: 130,
    marginHorizontal: '5%',
  },
  itemWrapper: {
    flexDirection: 'row',
  },
  separator: {
    width: 30,
    height: 50,
    backgroundColor: theme.colors.button.primary,
    marginBottom: 5,
  },
});
