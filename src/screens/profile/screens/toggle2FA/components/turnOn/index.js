import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { get } from 'lodash';
import {
  Button,
  TabContent,
  TabHeader,
  TAB_HEADER_TYPES,
} from 'src/components';
import DownloadApp from './components/DownloadApp';
import ScanQRCode from './components/ScanQRCode';
import Submit from './components/Submit';
import theme from 'src/theme';

const TAB_KEYS = {
  DOWNLOAD_APP: 'downloadApp',
  SCAN_CODE: 'scanCode',
  SUBMIT: 'submit',
};

const TABS = [
  {
    key: TAB_KEYS.DOWNLOAD_APP,
    label: 'Tải xuống và cài đặt ứng dụng Google Authenticator',
  },
  {
    key: TAB_KEYS.SCAN_CODE,
    name: 'Scan QR Code',
  },
  {
    key: TAB_KEYS.SUBMIT,
    name: 'Enable GA',
  },
];

const TabComponents = {
  [TAB_KEYS.DOWNLOAD_APP]: DownloadApp,
  [TAB_KEYS.SCAN_CODE]: ScanQRCode,
  [TAB_KEYS.SUBMIT]: Submit,
};

const TurnOnGA = props => {
  const { onClose } = props;
  const [currentTab, setCurrentTab] = useState(TAB_KEYS.DOWNLOAD_APP);
  const selectedIndex = useMemo(() => {
    const currentIndex = TABS.findIndex(({ key }) => key === currentTab);
    return currentIndex;
  }, [currentTab]);

  const handlePrev = useCallback(() => {
    const newIndex = selectedIndex - 1;
    const newKey = get(TABS, `${newIndex}.key`);
    if (newKey) setCurrentTab(newKey);
  }, [selectedIndex]);

  const handleNext = useCallback(() => {
    const newIndex = selectedIndex + 1;
    const newKey = get(TABS, `${newIndex}.key`);
    if (newKey) setCurrentTab(newKey);
  }, [selectedIndex]);

  return (
    <View style={styles.container}>
      {/* <TabHeader
        type={TAB_HEADER_TYPES.STEP}
        tabs={TABS}
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        style={styles.tabHeader}
      /> */}
      <TabContent
        tabs={TABS}
        currentTab={currentTab}
        style={styles.content}
        tabComponents={TabComponents}
        tabProps={{
          onClose,
        }}
      />
      <View style={styles.footer}>
        <Button
          title="Prev"
          style={styles.footerButton}
          disabled={selectedIndex < 1}
          onPress={handlePrev}
          titleProps={{ color: '#fff' }}
        />
        <Button
          title="Next"
          style={styles.footerButton}
          disabled={selectedIndex >= TABS.length - 1}
          onPress={handleNext}
          titleProps={{ color: '#fff' }}
        />
      </View>
    </View>
  );
};
export default React.memo(TurnOnGA);

TurnOnGA.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '5%',
  },
  tabHeader: {
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
  },
  footerButton: {
    backgroundColor: theme.colors.button.primary,
    marginHorizontal: 5,
    width: '30%',
    marginBottom: '10%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
