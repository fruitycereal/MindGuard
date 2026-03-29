import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const moods = [
  { label: "I'm really happy", color: '#9FE1CB', text: '#085041' },
  { label: "I'm doing okay", color: '#B5D4F4', text: '#0C447C' },
  { label: 'A bit heavy', color: '#FAC775', text: '#633806' },
  { label: 'Really struggling', color: '#D3D1C7', text: '#444441' },
  { label: "I don't even know", color: '#EEEDFE', text: '#3C3489' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hey. How are you doing today — really?</Text>
      <Text style={styles.sub}>No wrong answers. Just how you actually feel.</Text>

      {moods.map((mood) => (
        <TouchableOpacity
          key={mood.label}
          style={[styles.moodBtn, { backgroundColor: mood.color }]}
          onPress={() => router.push({
            pathname: '/(tabs)/explore',
            params: { mood: mood.label }
          })}
        >
          <Text style={[styles.moodText, { color: mood.text }]}>{mood.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '500',
    color: '#2C2C2A',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
  },
  sub: {
    fontSize: 14,
    color: '#888780',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  moodBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'center',
  },
  moodText: {
    fontSize: 16,
    fontWeight: '500',
  },
});