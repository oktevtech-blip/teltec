import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SignUpScreen({ navigation, setRole }: any) {
  const [role, setLocalRole] = useState('Project Manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    setRole(role);
    if (role === 'Project Manager') {
      navigation.replace('PMHome');
    } else {
      navigation.replace('TechnicianHome');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 10 }} />
      <Picker selectedValue={role} onValueChange={setLocalRole} style={{ marginBottom: 10 }}>
        <Picker.Item label="Project Manager" value="Project Manager" />
        <Picker.Item label="Senior Technician" value="Senior Technician" />
      </Picker>
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}