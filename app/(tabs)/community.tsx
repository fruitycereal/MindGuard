import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const posts = [
  { text: "I've been pretending I'm fine for so long I forgot what fine actually feels like.", feels: 84 },
  { text: "Today was hard but I made it through. That's enough.", feels: 210 },
  { text: "I don't know why I'm sad. I just am.", feels: 156 },
  { text: "Told myself I'd be better by now. Still working on it.", feels: 98 },
  { text: "Small win today — I got out of bed. That counts.", feels: 321 },
];

export default function CommunityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You're not alone in this.</Text>
      <Text style={styles.sub}>Anonymous thoughts from people just like you.</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map((post, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.postText}>{post.text}</Text>
            <TouchableOpacity style={styles.feelBtn}>
              <Text style={styles.feelText}>{post.feels} people felt this</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  postText: {
    fontSize: 15,
    color: '#2C2C2A',
    lineHeight: 24,
    marginBottom: 12,
  },
  feelBtn: {
    alignSelf: 'flex-start',
  },
  feelText: {
    fontSize: 12,
    color: '#888780',
  },
});