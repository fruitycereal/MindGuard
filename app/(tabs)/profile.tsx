import { getMoodEntries } from '@/lib/moodService';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const moodColors: Record<string, string> = {
  "I'm really happy": '#9FE1CB',
  "I'm doing okay": '#B5D4F4',
  'A bit heavy': '#FAC775',
  'Really struggling': '#D3D1C7',
  "I don't even know": '#EEEDFE',
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function ProfileScreen() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      const data = await getMoodEntries();
      setEntries(data || []);
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  const goToPrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const goToNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const entry = entries.find(e => e.created_at && e.created_at.startsWith(dateStr));
      days.push({ day: d, color: entry ? (moodColors[entry.mood] || '#B5D4F4') : null });
    }

    return days;
  };

  const getPraiseMessage = () => {
    const count = entries.length;
    if (count === 0) return { text: "Welcome. This is your space.", sub: "Check in whenever you're ready." };
    if (count === 1) return { text: "You showed up. That's everything.", sub: "Come back tomorrow." };
    if (count < 5) return { text: `You've checked in ${count} days.`, sub: "You're building something." };
    if (count < 10) return { text: `You've shown up ${count} days.`, sub: "That's you choosing yourself, again and again." };
    return { text: `${count} days. You keep coming back.`, sub: "That takes more strength than you know." };
  };

  const calendarDays = getCalendarDays();
  const praise = getPraiseMessage();
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#185FA5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your week</Text>
          <Text style={styles.sub}>Patterns help you understand yourself.</Text>
        </View>
      </View>

      <View style={styles.praiseCard}>
        <Text style={styles.praiseText}>{praise.text}</Text>
        <Text style={styles.praiseSub}>{praise.sub}</Text>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Mood key</Text>
        {[
          { color: '#9FE1CB', label: 'Really happy' },
          { color: '#B5D4F4', label: 'Okay' },
          { color: '#FAC775', label: 'A bit heavy' },
          { color: '#D3D1C7', label: 'Struggling' },
          { color: '#EEEDFE', label: "Don't know" },
        ].map((item) => (
          <View key={item.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPrevMonth} style={styles.arrow}>
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.arrow} disabled={isCurrentMonth}>
            <Text style={[styles.arrowText, isCurrentMonth && styles.arrowDisabled]}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dayLabelsRow}>
          {DAY_LABELS.map(d => (
            <Text key={d} style={styles.dayLabelText}>{d}</Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {calendarDays.map((item, index) => (
            <View key={index} style={styles.calendarCell}>
              {item ? (
                <View style={[styles.calendarDot, { backgroundColor: item.color || '#F1EFE8' }]}>
                  <Text style={styles.calendarDayNum}>{item.day}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 4,
  },
  sub: {
    fontSize: 14,
    color: '#888780',
    lineHeight: 22,
  },
  praiseCard: {
    backgroundColor: '#E6F1FB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  praiseText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0C447C',
    marginBottom: 4,
  },
  praiseSub: {
    fontSize: 13,
    color: '#185FA5',
    lineHeight: 20,
  },
  legend: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#888780',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendLabel: {
    fontSize: 14,
    color: '#2C2C2A',
  },
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    marginBottom: 32,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  arrow: {
    padding: 8,
  },
  arrowText: {
    fontSize: 18,
    color: '#185FA5',
  },
  arrowDisabled: {
    color: '#D3D1C7',
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2C2C2A',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayLabelText: {
    fontSize: 10,
    color: '#888780',
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  calendarDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayNum: {
    fontSize: 11,
    color: '#2C2C2A',
    fontWeight: '500',
  },
});