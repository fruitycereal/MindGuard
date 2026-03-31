import { getMoodEntries, saveMoodEntry, updateMoodEntry } from '@/lib/moodService';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function JournalScreen() {
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [entry, setEntry] = useState('');
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadEntries(); }, []);

  const loadEntries = async () => {
    try {
      const data = await getMoodEntries();
      setEntries((data || []).filter((e: any) => e.entry));
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEntry(item.entry);
    setResponse('');
    setWriting(true);
  };

  const handleDone = async () => {
    if (!entry.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateMoodEntry(editingId, entry);
        setResponse("Updated. Your words are safe here.");
      } else {
        const res = await fetch('http://192.168.1.198:8000/journal-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood: '', entry }),
        });
        const data = await res.json();
        setResponse(data.response);
        await saveMoodEntry('', entry, data.response);
      }
      await loadEntries();
    } catch (error) {
      console.log('Error:', error);
      setResponse("Something went wrong. But your words still matter.");
    }
    setSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const hasWrittenToday = () => {
    const today = new Date().toDateString();
    return entries.some(e => new Date(e.created_at).toDateString() === today);
  };

  const handleBack = () => {
    setWriting(false);
    setEntry('');
    setResponse('');
    setEditingId(null);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#185FA5" />
      </View>
    );
  }

  if (writing) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {!response ? (
          <>
            <Text style={styles.prompt}>
              {editingId ? "Edit your entry." : "How are you feeling right now? Just write — no wrong answers."}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Write anything. No one will judge you here..."
              placeholderTextColor="#B4B2A9"
              multiline
              textAlignVertical="top"
              value={entry}
              onChangeText={setEntry}
              autoFocus
            />
            <TouchableOpacity
              style={[styles.btn, !entry.trim() && styles.btnDisabled]}
              onPress={handleDone}
              disabled={!entry.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#E6F1FB" />
              ) : (
                <Text style={styles.btnText}>{editingId ? 'Save changes' : 'Done — just for me'}</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.responseContainer}>
            <View style={styles.responseBubble}>
              <Text style={styles.responseText}>{response}</Text>
              <Text style={styles.aiLabel}>This is an AI response — not a human. But it heard you.</Text>
            </View>
            <TouchableOpacity style={styles.doneBtn} onPress={handleBack}>
              <Text style={styles.doneBtnText}>Back to journal</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal</Text>
        {!hasWrittenToday() && (
        <TouchableOpacity style={styles.writeBtn} onPress={() => { setEditingId(null); setEntry(''); setWriting(true); }}>
          <Text style={styles.writeBtnText}>+ Write</Text>
        </TouchableOpacity>
        )}
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nothing here yet.</Text>
          <Text style={styles.emptySub}>Your journal is private. Write anything — no one will see it but you.</Text>
           {!hasWrittenToday() && (
            <TouchableOpacity style={styles.btn} onPress={() => setWriting(true)}>
              <Text style={styles.btnText}>Write your first entry</Text>
            </TouchableOpacity>
           )}
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {entries.map((item, index) => (
            <View key={index} style={styles.entryCard}>
              <Text style={styles.entryDate}>{formatDate(item.created_at)}</Text>
              {item.mood ? <Text style={styles.entryMood}>{item.mood}</Text> : null}
              <Text style={styles.entryText} numberOfLines={4}>{item.entry}</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2C2C2A',
  },
  writeBtn: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  writeBtnText: {
    color: '#E6F1FB',
    fontSize: 14,
    fontWeight: '500',
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: '#185FA5',
    fontSize: 15,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#888780',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  entryDate: {
    fontSize: 12,
    color: '#888780',
    marginBottom: 4,
  },
  entryMood: {
    fontSize: 12,
    color: '#185FA5',
    marginBottom: 8,
  },
  entryText: {
    fontSize: 15,
    color: '#2C2C2A',
    lineHeight: 24,
    marginBottom: 12,
  },
  editBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  editBtnText: {
    fontSize: 12,
    color: '#888780',
  },
});