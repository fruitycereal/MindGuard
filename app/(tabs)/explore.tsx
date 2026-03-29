import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function JournalScreen() {
  const { mood } = useLocalSearchParams();
  const router = useRouter();
  const [entry, setEntry] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const prompts: Record<string, string> = {
    "I'm really happy": "That's wonderful. What made today feel good? Write it down so you can come back to this feeling.",
    "I'm doing okay": "Okay is enough. What's been on your mind lately — even if it doesn't make sense?",
    "A bit heavy": "Heavy days are real. What's been sitting with you? You don't have to figure it out — just write.",
    "Really struggling": "Thank you for showing up even when it's hard. What does struggling feel like for you right now?",
    "I don't even know": "Not knowing is okay. Just write whatever comes — even if it's just one word.",
  };

  const prompt = prompts[mood as string] ?? "How are you feeling right now? Just write — no wrong answers.";

  const handleDone = async () => {
    if (!entry.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://192.168.0.14:8000/journal-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, entry }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Something went wrong. But your words still matter.");
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.prompt}>{prompt}</Text>

      {!response ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Write anything. No one will judge you here..."
            placeholderTextColor="#B4B2A9"
            multiline
            textAlignVertical="top"
            value={entry}
            onChangeText={setEntry}
          />
          <TouchableOpacity
            style={[styles.btn, !entry.trim() && styles.btnDisabled]}
            onPress={handleDone}
            disabled={!entry.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#E6F1FB" />
            ) : (
              <Text style={styles.btnText}>Done — just for me</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.responseContainer}>
          <View style={styles.responseBubble}>
            <Text style={styles.responseText}>{response}</Text>
            <Text style={styles.aiLabel}>This is an AI response — not a human. But it heard you.</Text>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.doneBtnText}>Back to home</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    padding: 24,
    paddingTop: 60,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C2C2A',
    lineHeight: 28,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2A',
    lineHeight: 26,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#185FA5',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnDisabled: {
    backgroundColor: '#B4B2A9',
  },
  btnText: {
    color: '#E6F1FB',
    fontSize: 16,
    fontWeight: '500',
  },
  responseContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  responseBubble: {
    backgroundColor: '#E6F1FB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#185FA5',
  },
  responseText: {
    fontSize: 17,
    color: '#0C447C',
    lineHeight: 28,
    fontWeight: '500',
    marginBottom: 12,
  },
  aiLabel: {
    fontSize: 12,
    color: '#378ADD',
    lineHeight: 18,
  },
  doneBtn: {
    backgroundColor: '#FAFAF8',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  doneBtnText: {
    color: '#2C2C2A',
    fontSize: 16,
    fontWeight: '500',
  },
});