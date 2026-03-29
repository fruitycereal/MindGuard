import { ScrollView, StyleSheet, Text, View } from 'react-native';

const weekMoods = [
  { day: 'M', mood: 'okay', color: '#B5D4F4' },
  { day: 'T', mood: 'happy', color: '#9FE1CB' },
  { day: 'W', mood: 'heavy', color: '#FAC775' },
  { day: 'T', mood: 'okay', color: '#B5D4F4' },
  { day: 'F', mood: 'struggling', color: '#D3D1C7' },
  { day: 'S', mood: 'none', color: '#F1EFE8' },
  { day: 'S', mood: 'none', color: '#F1EFE8' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your week</Text>
      <Text style={styles.sub}>Patterns help you understand yourself.</Text>

      <View style={styles.weekRow}>
        {weekMoods.map((item, index) => (
          <View key={index} style={styles.dayCol}>
            <View style={[styles.circle, { backgroundColor: item.color }]} />
            <Text style={styles.dayLabel}>{item.day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.praiseCard}>
        <Text style={styles.praiseText}>You've been showing up for 5 days.</Text>
        <Text style={styles.praiseSub}>That's you choosing yourself, again and again.</Text>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Mood key</Text>
        {[
          { color: '#9FE1CB', label: 'Really happy' },
          { color: '#B5D4F4', label: 'Okay' },
          { color: '#FAC775', label: 'A bit heavy' },
          { color: '#D3D1C7', label: 'Struggling' },
          { color: '#F1EFE8', label: 'No check-in' },
        ].map((item) => (
          <View key={item.label} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
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
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: '#888780',
    marginBottom: 24,
    lineHeight: 22,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  dayLabel: {
    fontSize: 12,
    color: '#888780',
  },
  praiseCard: {
    backgroundColor: '#E6F1FB',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
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
});