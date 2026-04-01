import { addCommunityPost, getCommunityPosts, toggleFeel } from '@/lib/communityService';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CommunityScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
    loadPosts();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);
  };

  const loadPosts = async () => {
    try {
      const data = await getCommunityPosts();
      setPosts(data || []);
    } catch (error) {
      console.log('Error:', error);
    }
    setLoading(false);
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await addCommunityPost(content);
      setContent('');
      setWriting(false);
      await loadPosts();
    } catch (error) {
      console.log('Error:', error);
    }
    setSubmitting(false);
  };

  const handleToggleFeel = async (post: any) => {
    const currentlyFelt = post.post_feels?.some((f: any) => f.user_id === currentUserId);
    try {
      await toggleFeel(post.id, currentlyFelt);
      await loadPosts();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
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
        <TouchableOpacity onPress={() => { setWriting(false); setContent(''); }} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.prompt}>Share something anonymously.</Text>
        <Text style={styles.promptSub}>No names. No judgment. Just people who get it.</Text>

        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#B4B2A9"
          multiline
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
          autoFocus
          maxLength={280}
        />
        <Text style={styles.charCount}>{280 - content.length} characters left</Text>

        <TouchableOpacity
          style={[styles.btn, !content.trim() && styles.btnDisabled]}
          onPress={handlePost}
          disabled={!content.trim() || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#E6F1FB" />
          ) : (
            <Text style={styles.btnText}>Share anonymously</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>You're not alone.</Text>
        <Text style={styles.sub}>Anonymous thoughts from people just like you.</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={() => setWriting(true)}>
          <Text style={styles.shareBtnText}>+ Share something</Text>
        </TouchableOpacity>
      </View>

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nothing here yet.</Text>
          <Text style={styles.emptySub}>Be the first to share something. You're anonymous — no one knows it's you.</Text>
          <TouchableOpacity style={styles.btn} onPress={() => setWriting(true)}>
            <Text style={styles.btnText}>Share something</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {posts.map((post) => {
            const felt = post.post_feels?.some((f: any) => f.user_id === currentUserId);
            const feelCount = post.post_feels?.length ?? 0;
            return (
              <View key={post.id} style={styles.card}>
                <Text style={styles.postText}>{post.content}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.postDate}>{formatDate(post.created_at)}</Text>
                  <TouchableOpacity
                    style={[styles.feelBtn, felt && styles.feelBtnActive]}
                    onPress={() => handleToggleFeel(post)}
                  >
                    <Text style={[styles.feelText, felt && styles.feelTextActive]}>
                      {felt ? '♥' : '♡'} {feelCount} felt this
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
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
    marginBottom: 12,
  },
  shareBtn: {
    backgroundColor: '#185FA5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  shareBtnText: {
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
    fontSize: 20,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 6,
  },
  promptSub: {
    fontSize: 14,
    color: '#888780',
    marginBottom: 24,
    lineHeight: 22,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C2C2A',
    lineHeight: 26,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#B4B2A9',
    textAlign: 'right',
    marginBottom: 16,
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
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postDate: {
    fontSize: 12,
    color: '#888780',
  },
  feelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
  },
  feelBtnActive: {
    backgroundColor: '#E6F1FB',
    borderColor: '#185FA5',
  },
  feelText: {
    fontSize: 12,
    color: '#888780',
  },
  feelTextActive: {
    color: '#185FA5',
  },
});