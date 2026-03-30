import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setEmail(user.email ?? '');
      setDisplayName(user.user_metadata?.display_name ?? '');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Saved', 'Your settings have been updated.');
    setSaving(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => Alert.alert('Contact us', 'Please email us to delete your account. We will process it within 24 hours.'),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <Text style={styles.sectionLabel}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.fieldLabel}>Display name</Text>
        <TextInput
          style={styles.input}
          placeholder="What should we call you?"
          placeholderTextColor="#B4B2A9"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <Text style={styles.fieldLabel}>Email</Text>
        <Text style={styles.fieldValue}>{email}</Text>
      </View>

      <Text style={styles.sectionLabel}>Preferences</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Language</Text>
          <View style={styles.langToggle}>
            <TouchableOpacity
              style={[styles.langBtn, language === 'English' && styles.langBtnActive]}
              onPress={() => setLanguage('English')}
            >
              <Text style={[styles.langBtnText, language === 'English' && styles.langBtnTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, language === 'Thai' && styles.langBtnActive]}
              onPress={() => setLanguage('Thai')}
            >
              <Text style={[styles.langBtnText, language === 'Thai' && styles.langBtnTextActive]}>TH</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowLabel}>Daily reminder</Text>
            <Text style={styles.rowSub}>A gentle nudge to check in</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#D3D1C7', true: '#185FA5' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save changes'}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>Account</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.accountRow} onPress={handleLogout}>
          <Text style={styles.accountRowText}>Log out</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.accountRow} onPress={handleDeleteAccount}>
          <Text style={[styles.accountRowText, { color: '#A32D2D' }]}>Delete account</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>MindGuard — free, private, always here.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    padding: 24,
    paddingTop: 60,
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: '#185FA5',
    fontSize: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#888780',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#888780',
    marginBottom: 6,
    marginTop: 8,
  },
  fieldValue: {
    fontSize: 15,
    color: '#2C2C2A',
    paddingVertical: 4,
  },
  input: {
    fontSize: 15,
    color: '#2C2C2A',
    borderBottomWidth: 0.5,
    borderBottomColor: '#D3D1C7',
    paddingVertical: 8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1EFE8',
  },
  rowLabel: {
    fontSize: 15,
    color: '#2C2C2A',
  },
  rowSub: {
    fontSize: 12,
    color: '#888780',
    marginTop: 2,
  },
  langToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  langBtnActive: {
    backgroundColor: '#185FA5',
    borderColor: '#185FA5',
  },
  langBtnText: {
    fontSize: 13,
    color: '#888780',
    fontWeight: '500',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
  saveBtn: {
    backgroundColor: '#185FA5',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveBtnDisabled: {
    backgroundColor: '#B4B2A9',
  },
  saveBtnText: {
    color: '#E6F1FB',
    fontSize: 16,
    fontWeight: '500',
  },
  accountRow: {
    paddingVertical: 14,
  },
  accountRowText: {
    fontSize: 15,
    color: '#2C2C2A',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#D3D1C7',
  },
  footer: {
    fontSize: 12,
    color: '#B4B2A9',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  settingsIcon: {
    fontSize: 22,
    color: '#888780',
    marginTop: 4,
}});