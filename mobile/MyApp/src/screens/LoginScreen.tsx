import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function LoginScreen({ navigation, setRole }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // For demo, just select role after login
  const [role, setLocalRole] = useState('Project Manager');

  const handleLogin = () => {
    setRole(role);
    if (role === 'Project Manager') {
      navigation.replace('PMHome');
    } else {
      navigation.replace('TechnicianHome');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, marginBottom: 10 }} />
      <Text>Select Role (for demo):</Text>
      <Button title="Project Manager" onPress={() => setLocalRole('Project Manager')} />
      <Button title="Senior Technician" onPress={() => setLocalRole('Senior Technician')} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}