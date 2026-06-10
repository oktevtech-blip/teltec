import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/SignUpScreen.tsx';
import LoginScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/LoginScreen.tsx';
import PMHomeScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/PMHomeScreen.tsx';
import TechnicianHomeScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/TechnicianHomeScreen.tsx';
import SendDocumentScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/SendDocumentScreen.tsx';
import ReceiveDocumentScreen from 'C:/Users/DELL/Desktop/Teltec Complete/mobile/MyApp/src/screens/ReceiveDocumentScreen.tsx';

const Stack = createStackNavigator();

export default function App() {
  // For demo: store role in state after login/signup
  const [role, setRole] = useState<string | null>(null);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="SignUp">
          {(props) => <SignUpScreen {...props} setRole={setRole} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setRole={setRole} />}
        </Stack.Screen>
        <Stack.Screen name="PMHome">
          {(props) => <PMHomeScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="TechnicianHome">
          {(props) => <TechnicianHomeScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="SendDocument" component={SendDocumentScreen} />
        <Stack.Screen name="ReceiveDocument" component={ReceiveDocumentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// npx @react-native-community/cli init MyApp