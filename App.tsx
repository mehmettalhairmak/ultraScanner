import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { BaseToast } from 'react-native-toast-message/lib/src/components/BaseToast';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import HomeScreen from './src/screens/HomeScreen';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#FFFF', backgroundColor: '#2D4263' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        color: '#FFFF',
        fontFamily: 'Roboto-Bold',
      }}
    />
  ),
};

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HomeScreen />
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
