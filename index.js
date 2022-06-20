/**
 * @format
 */
import { Buffer } from 'buffer';
import 'react-native-get-random-values';
import '@ethersproject/shims';
global.Buffer = Buffer;
import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'src/models';
import { store, persistor } from 'src/redux';
import App from 'src/App';
import { name as appName } from './app.json';

const AppContainer = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => AppContainer);
