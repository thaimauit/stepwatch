import React from 'react';
import { StyleSheet } from 'react-native';
import { get } from 'lodash';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from 'src/components';
import Submit from './components/turnOn/components/Submit';
import TurnOn from './components/turnOn';

const Toggle2FA = props => {
  const { route, navigation } = props;
  const isEnable = get(route, 'params.isEnable', false);

  const renderContent = () => {
    if (!isEnable) return <Submit isDisabled />;
    return <TurnOn />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEnable ? 'Turn on 2FA' : 'Turn off 2FA'}
        titleStyle={{ color: '#fff', fontWeight: 'bold' }}
        navigation={navigation}
      />
      {renderContent()}
    </SafeAreaView>
  );
};

Toggle2FA.propTypes = {};

export default React.memo(Toggle2FA);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
