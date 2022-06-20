import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';

const TabContent = props => {
  const [tabRendered, setTabRendered] = useState({});
  const {
    tabs,
    currentTab,
    style,
    tabStyle = {},
    tabProps,
    tabItemProps,
    tabComponents,
    propsByTab,
  } = props;

  useEffect(() => {
    setTabRendered(prev => ({
      ...prev,
      [currentTab]: true,
    }));
  }, [currentTab]);

  const renderTab = tab => {
    const { key, component } = tab;
    const propTab = get(propsByTab, key, {});
    const propTabComponent = get(tabComponents, key);
    const itemProps = get(tabItemProps, `${currentTab}`, {});
    const TabComponent = propTabComponent || component;
    const isSelected = key === currentTab;
    const currentStyle = isSelected
      ? [styles.tabItem, tabStyle]
      : styles.hiddenTab;
    return (
      <View key={key} style={currentStyle}>
        {tabRendered[key] && (
          <TabComponent
            {...tabProps}
            {...itemProps}
            visible={isSelected}
            {...propTab}
          />
        )}
      </View>
    );
  };

  return <View style={style}>{tabs.map(renderTab)}</View>;
};

TabContent.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tabStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tabs: PropTypes.array.isRequired,
  currentTab: PropTypes.string.isRequired,
  tabProps: PropTypes.object,
  tabComponents: PropTypes.object,
  propsByTab: PropTypes.object,
};

TabContent.defaultProps = {
  tabProps: {},
  propsByTab: {},
};

export default React.memo(TabContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabItem: {
    flex: 1,
  },
  hiddenTab: { width: 0, height: 0, overflow: 'hidden' },
});
