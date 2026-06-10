import React from 'react';
import { View, Text, Button } from 'react-native';

export default function TechnicianHomeScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, Senior Technician!</Text>
      <Button title="Receive Documents from Project Manager" onPress={() => navigation.navigate('ReceiveDocument')} />
      <Button title="Send Document to Project Manager" onPress={() => navigation.navigate('SendDocument', { recipient: 'ProjectManager' })} />
    </View>
  );
}