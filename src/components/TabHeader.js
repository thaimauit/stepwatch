import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  Text as TextRN,
} from 'react-native';
import PropTypes from 'prop-types';
import theme from 'src/theme';
import Text from './Text';

export const TAB_HEADER_TYPES = {
  SEGMENT: 'segment',
  SEGMENT_CENTER: 'segmentCenter',
  TAB_BAR: 'tabBar',
  STEP: 'step',
};

const TabHeader = props => {
  const {
    type,
    tabs,
    style,
    currentTab,
    onChangeTab,
    tabItemStyle,
    tabItemTitleStyle,
    unSelectStyle,
    separator,
  } = props;

  const selectedIndex = useMemo(() => {
    return tabs.findIndex(({ key }) => key === currentTab);
  }, [tabs, currentTab]);

  const handleChangeTab = tab => () => onChangeTab(tab.key);

  const renderTabBarHeader = tab => {
    const { key, name, style: tabStyle = {} } = tab;
    const isSelected = key === currentTab;

    return (
      <TouchableOpacity
        style={[
          styles.tabBarItem,
          isSelected ? styles.tabBarSelected : {},
          tabStyle,
          tabItemStyle,
        ]}
        key={key}
        onPress={handleChangeTab(tab)}>
        <Text
          style={[
            styles.tabBarTitle,
            isSelected ? styles.tabBarTitleSelected : {},
          ]}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStepHeader = (tab, index) => {
    const { key } = tab;
    const isFirst = index === 0;
    const isLast = index === tabs.length - 1;
    const isPass = index <= selectedIndex;
    const backgroundColor = isPass ? theme.colors.button.primary : '#fff';
    const isCenter = !isFirst && !isLast;
    const centerStyle = isCenter ? { flex: 1 } : {};
    return (
      <View style={[styles.stepItemView, centerStyle]} key={key}>
        {isCenter && (
          <View style={styles.lineStepContainer}>
            <View style={styles.lineStep} />
          </View>
        )}
        <TouchableOpacity
          style={[styles.circleStep, { backgroundColor }]}
          onPress={handleChangeTab(tab)}>
          <Text style={styles.titleStep}>{index + 1}</Text>
        </TouchableOpacity>
        {isCenter && (
          <View style={styles.lineStepContainer}>
            <View style={styles.lineStep} />
          </View>
        )}
      </View>
    );
  };

  const renderTabHeader = (tab, index) => {
    // tabbar
    if (type === TAB_HEADER_TYPES.TAB_BAR) return renderTabBarHeader(tab);

    // step
    if (type === TAB_HEADER_TYPES.STEP) return renderStepHeader(tab, index);

    // default segment
    const {
      key,
      name,
      style: tabStyle = {},
      selectedColor,
      selectedTitleColor,
    } = tab;
    const isSelected = tab.key === currentTab;
    const textStyle = isSelected
      ? {
          color: selectedTitleColor || '#fff',
        }
      : {};
    const unSelectItemStyle = !isSelected && unSelectStyle;
    const selectedStyle = (isSelected && {
      backgroundColor: selectedColor || theme.colors.button.primary,
      borderColor: selectedColor || theme.colors.button.primary,
    }) || { backgroundColor: 'transparent' };

    return (
      <React.Fragment key={index}>
        {separator && index !== 0 && <View style={styles.separator} />}
        <TouchableOpacity
          key={key}
          style={[
            styles.tabHeader,
            tabStyle,
            tabItemStyle,
            unSelectItemStyle,
            selectedStyle,
          ]}
          onPress={handleChangeTab(tab)}>
          <Text style={[styles.tabName, tabItemTitleStyle, textStyle]}>
            {name}
          </Text>
        </TouchableOpacity>
      </React.Fragment>
    );
  };

  const containerStyle = {
    ...styles.container,
    ...(type === TAB_HEADER_TYPES.TAB_BAR ? styles.tabBarContainer : {}),
  };

  return (
    <View style={[containerStyle, style]}>{tabs.map(renderTabHeader)}</View>
  );
};

TabHeader.propTypes = {
  type: PropTypes.string,
  tabs: PropTypes.array.isRequired,
  currentTab: PropTypes.string.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  tabItemStyle: ViewPropTypes.style,
  tabItemTitleStyle: TextRN.propTypes.style,
};

TabHeader.defaultProps = {
  type: TAB_HEADER_TYPES.SEGMENT,
};

export default React.memo(TabHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBarContainer: {
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255,255,255, 0.05)',
  },
  tabBarItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tabBarSelected: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.button.primary,
  },
  tabBarTitle: { color: '#fff', fontSize: 14 },
  tabBarTitleSelected: { fontWeight: '600' },
  tabHeader: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  tabName: {},
  stepItemView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleStep: {
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStep: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  lineStepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  lineStep: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255,255,255, 0.1)',
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
