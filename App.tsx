import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { BaseToast } from 'react-native-toast-message/lib/src/components/BaseToast';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import QRScannerScreen from './src/screens/QRScannerScreen';
import QRGeneratorScreen from './src/screens/QRGeneratorScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
  error: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'red', backgroundColor: '#000' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        color: '#FFFF',
        fontFamily: 'Roboto-Bold',
      }}
    />
  ),
};

export type RootStackParams = {
  QRScannerScreen: any;
  QRGeneratorScreen: any;
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="QRScannerScreen"
            screenOptions={{ headerShown: false }}>
            {/* <QRScannerScreen /> */}
            <Stack.Screen name="QRScannerScreen" component={QRScannerScreen} />
            {/* <QRGeneratorScreen /> */}
            <Stack.Screen
              name="QRGeneratorScreen"
              component={QRGeneratorScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
