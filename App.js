import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import Router from './src/router';
import {LogBox} from 'react-native';
import {store} from './src/redux';
import {Provider} from 'react-redux';

export default function App() {
  // LogBox.ignoreLogs(['Setting a timer', 'Animated: `useNativeDriver`']);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </Provider>
  );
}
