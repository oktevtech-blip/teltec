import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function SendDocumentScreen({ route }: any) {
  const [document, setDocument] = useState('');
  const recipient = route.params?.recipient || 'Unknown';

  const handleSend = () => {
    // Implement document sending logic here
    Alert.alert('Success', `Document sent to ${recipient}`);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Send Document</Text>
      <Text>Recipient: {recipient}</Text>
      <TextInput placeholder="Document Name or Path" value={document} onChangeText={setDocument} style={{ borderWidth: 1, marginBottom: 10 }} />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}