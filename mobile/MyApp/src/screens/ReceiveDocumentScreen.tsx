import React from 'react';
import { View, Text, Button, Alert } from 'react-native';

export default function ReceiveDocumentScreen() {
  // For demo, just show a static message
  return (
    <View style={{ padding: 20 }}>
      <Text>Received Documents from Project Manager</Text>
      <Button title="Download/View Document" onPress={() => Alert.alert('Document downloaded/viewed')} />
    </View>
  );
}