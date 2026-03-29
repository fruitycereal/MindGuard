import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

export default function JournalScreen() {
  const { mood } = useLocalSearchParams();

  const prompts: Record<string, string> = {
    "I'm really happy": "That's wonderful. What made today feel good? Write it down so you can come back to this feeling.",
    "I'm doing okay": "Okay is enough. What's been on your mind lately — even if it doesn't make sense?",
    "A bit heavy": "Heavy days are real. What's been sitting with you? You don't have to figure it out — just write.",
    "Really struggling": "Thank you for showing up even when it's hard. What does struggling feel like for you right now?",
    "I don't even know": "Not knowing is okay. Just write whatever comes — even if it's just one word.",
  };

  const prompt = prompts[mood as string] ?? "How are you feeling right now? Just write — no wrong answers.";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.prompt}>{prompt}</Text>
      <TextInput
        style={styles.input}
        placeholder="Write anything. No one will judge you here..."
        placeholderTextColor="#B4B2A9"
        multiline
        textAlignVertical="top"
      />
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Done — just for me</Text>
      </TouchableOpacity>
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
  btnText: {
    color: '#E6F1FB',
    fontSize: 16,
    fontWeight: '500',
  },
});