import { getMoodEntries, saveMoodEntry } from '@/lib/moodService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    checkTodaysMood();
  }, []);

  const checkTodaysMood = async () => {
    try {
      const data = await getMoodEntries();
      if (!data) return;
      const today = new Date().toDateString();
      const todayEntry = data.find(e => 
        e.created_at && new Date(e.created_at).toDateString() === today && e.mood
      );
      if (todayEntry) {
        setSelected(todayEntry.mood);
        setSaved(true);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleMoodSelect = async (mood: string) => {
    if (saving || saved) return;
    setSelected(mood);
    setSaving(true);
    try {
      await saveMoodEntry(mood, '', '');
      setSaved(true);
    } catch (error) {
      console.log('Error saving mood:', error);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      {!saved ? (
        <>
          <Text style={styles.greeting}>Hey. How are you doing today — really?</Text>
          <Text style={styles.sub}>No wrong answers. Just how you actually feel.</Text>

          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.label}
              style={[
                styles.moodBtn,
                { backgroundColor: mood.color },
                selected === mood.label && styles.moodBtnSelected,
              ]}
              onPress={() => handleMoodSelect(mood.label)}
              disabled={saving}
            >
              <Text style={[styles.moodText, { color: mood.text }]}>
                {saving && selected === mood.label ? 'Saving...' : mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
<View style={styles.confirmedContainer}>
  <Text style={styles.confirmedEmoji}>🌿</Text>
  <Text style={styles.confirmedTitle}>Noted.</Text>
  <Text style={styles.confirmedSub}>
    You checked in as "{selected}". {'\n'}
    Want to write about it?
  </Text>

  {selected === 'Really struggling' && (
    <View style={styles.crisisCard}>
      <Text style={styles.crisisTitle}>You don't have to carry this alone.</Text>
      <Text style={styles.crisisSub}>Real people are available right now:</Text>
      <View style={styles.crisisRow}>
        <Text style={styles.crisisName}>Samaritans Thailand</Text>
        <Text style={styles.crisisNumber}>02 713 6793</Text>
      </View>
      <View style={styles.crisisRow}>
        <Text style={styles.crisisName}>Mental Health Hotline</Text>
        <Text style={styles.crisisNumber}>1323</Text>
      </View>
      <Text style={styles.crisisNote}>Free · 24 hours · confidential</Text>
    </View>
  )}

  <TouchableOpacity
    style={styles.journalBtn}
    onPress={() => router.push('/(tabs)/explore')}
  >
    <Text style={styles.journalBtnText}>Open journal</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setSaved(false)} style={styles.changeBtn}>
    <Text style={styles.changeBtnText}>Change my mood</Text>
  </TouchableOpacity>
</View>
      )}
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
  moodBtnSelected: {
    opacity: 0.7,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmedContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confirmedEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  confirmedTitle: {
    fontSize: 28,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 10,
  },
  confirmedSub: {
    fontSize: 15,
    color: '#888780',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  journalBtn: {
    backgroundColor: '#185FA5',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  journalBtnText: {
    color: '#E6F1FB',
    fontSize: 16,
    fontWeight: '500',
  },
  changeBtn: {
    padding: 12,
  },
  changeBtnText: {
    color: '#888780',
    fontSize: 14,
  },
  crisisCard: {
  backgroundColor: '#FCEBEB',
  borderRadius: 14,
  padding: 16,
  marginBottom: 20,
  width: '100%',
  borderLeftWidth: 3,
  borderLeftColor: '#A32D2D',
  },
  crisisTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#791F1F',
    marginBottom: 4,
  },
  crisisSub: {
    fontSize: 13,
    color: '#A32D2D',
    marginBottom: 12,
  },
  crisisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F7C1C1',
  },
  crisisName: {
    fontSize: 13,
    color: '#791F1F',
    fontWeight: '500',
  },
  crisisNumber: {
    fontSize: 13,
    color: '#A32D2D',
  },
  crisisNote: {
    fontSize: 11,
    color: '#A32D2D',
    marginTop: 8,
    textAlign: 'center',
  },
});