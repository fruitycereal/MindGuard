import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.replace('/(tabs)');
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Create your space.</Text>
      <Text style={styles.sub}>Free, private, always here.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#B4B2A9"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#B4B2A9"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#E6F1FB" /> : <Text style={styles.btnText}>Create account</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 8,
  },
  sub: {
    fontSize: 15,
    color: '#888780',
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2A',
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#185FA5',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  btnDisabled: {
    backgroundColor: '#B4B2A9',
  },
  btnText: {
    color: '#E6F1FB',
    fontSize: 16,
    fontWeight: '500',
  },
  link: {
    textAlign: 'center',
    color: '#185FA5',
    fontSize: 14,
  },
  error: {
    color: '#A32D2D',
    fontSize: 13,
    marginBottom: 8,
    textAlign: 'center',
  },
});