import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/LoginScreen.tsx';
import PMHomeScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/PMHomeScreen';
import ReceiveDocumentScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/ReceiveDocumentScreen';
import SendDocumentScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/SendDocumentScreen';
import SignUpScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/SignUpScreen';
import TechnicianHomeScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/TechnicianHomeScreen';


const Stack= createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="PMHomeScreen" component={PMHomeScreen} />
            <Stack.Screen name="ReceiveDocumentScreen" component={ReceiveDocumentScreen} />
            <Stack.Screen name="SendDocumentScreen" component={SendDocumentScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="TechnicianHomeScreen" component={TechnicianHomeScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => App);