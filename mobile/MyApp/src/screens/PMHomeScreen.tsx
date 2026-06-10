import React from 'react';
import { View, Text, Button } from 'react-native';

export default function PMHomeScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, Project Manager!</Text>
      <Button title="Send Document to Web App" onPress={() => navigation.navigate('SendDocument', { recipient: 'WebApp' })} />
    </View>
  );
}