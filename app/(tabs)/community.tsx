import { addCommunityPost, addReply, getCommunityPosts, getReplies, toggleFeel } from '@/lib/communityService';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CommunityScreen() {
  const [viewingReplies, setViewingReplies] = useState<any | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [writing, setWriting] = useState(false);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replies, setReplies] = useState<Record<number, any[]>>({});
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

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

  const loadReplies = async (postId: number) => {
    try {
      const data = await getReplies(postId);
      setReplies(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.log('Error loading replies:', error);
    }
  };

  const handleToggleExpand = async (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      await loadReplies(postId);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await addCommunityPost(content);
      setContent('');
      setWriting(false);
      await loadPosts();
    } catch (error: any) {
      alert(error.message || 'Something went wrong.');
    }
    setSubmitting(false);
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !replyingTo) return;
    setSubmitting(true);
    try {
      await addReply(replyingTo.id, replyContent);
      setReplyContent('');
      setReplyingTo(null);
      await loadReplies(replyingTo.id);
    } catch (error: any) {
      alert(error.message || 'Something went wrong.');
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

      <Modal
        visible={!!replyingTo}
        transparent
        animationType="slide"
        onRequestClose={() => { setReplyingTo(null); setReplyContent(''); }}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Reply with kindness</Text>
            <Text style={styles.modalSub}>Write something supportive — one sentence is enough.</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="You're not alone..."
              placeholderTextColor="#B4B2A9"
              multiline
              value={replyContent}
              onChangeText={setReplyContent}
              autoFocus
              maxLength={200}
            />
            <Text style={styles.charCount}>{200 - replyContent.length} characters left</Text>
            <TouchableOpacity
              style={[styles.btn, !replyContent.trim() && styles.btnDisabled]}
              onPress={handleReply}
              disabled={!replyContent.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#E6F1FB" />
              ) : (
                <Text style={styles.btnText}>Send support</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setReplyingTo(null); setReplyContent(''); }} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={!!viewingReplies}
        transparent
        animationType="slide"
        onRequestClose={() => setViewingReplies(null)}
      >
        <View 
          style={styles.modalOverlay}
          onTouchEnd={() => setViewingReplies(null)}>
          <View 
            style={styles.repliesModalCard}
            onTouchEnd={(e) => e.stopPropagation()}>
            <View style={styles.repliesModalHeader}>
              <Text style={styles.modalTitle}>Replies</Text>
              <TouchableOpacity onPress={() => setViewingReplies(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.repliesPostText} numberOfLines={3}>
              {viewingReplies?.content}
            </Text>
            <ScrollView style={styles.repliesScroll} showsVerticalScrollIndicator={false}>
              {(replies[viewingReplies?.id] || []).length === 0 ? (
                <Text style={styles.noReplies}>No replies yet. Be the first to show support.</Text>
              ) : (
                (replies[viewingReplies?.id] || []).map((reply: any, index: number) => (
                  <View key={index} style={styles.replyCard}>
                    <Text style={styles.replyText}>{reply.content}</Text>
                    <Text style={styles.replyDate}>{formatDate(reply.created_at)}</Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                  <View style={styles.footerActions}>
                    <TouchableOpacity
                      style={[styles.feelBtn, felt && styles.feelBtnActive]}
                      onPress={() => handleToggleFeel(post)}
                    >
                      <Text style={[styles.feelText, felt && styles.feelTextActive]}>
                        {felt ? '♥' : '♡'} {feelCount}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.replyBtn}
                      onPress={() => setReplyingTo(post)}
                    >
                      <Text style={styles.replyBtnText}>Reply with kindness</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.showRepliesBtn}
                  onPress={async () => {
                    await loadReplies(post.id);
                    setViewingReplies(post);
                  }}
                >
                  <Text style={styles.showRepliesText}>
                    {(replies[post.id] || []).length > 0
                      ? `${(replies[post.id] || []).length} supportive ${(replies[post.id] || []).length === 1 ? 'reply' : 'replies'}`
                      : 'No replies yet'}
                  </Text>
                </TouchableOpacity>
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
    marginBottom: 12,
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
    flexWrap: 'wrap',
    gap: 8,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#888780',
  },
  feelBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
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
  replyBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: '#9FE1CB',
  },
  replyBtnText: {
    fontSize: 12,
    color: '#085041',
  },
  showRepliesBtn: {
    marginTop: 10,
  },
  showRepliesText: {
    fontSize: 12,
    color: '#185FA5',
  },
  repliesContainer: {
    marginTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#F1EFE8',
    paddingTop: 10,
  },
  noReplies: {
    fontSize: 13,
    color: '#B4B2A9',
    fontStyle: 'italic',
  },
  replyCard: {
    backgroundColor: '#F1EFE8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 14,
    color: '#2C2C2A',
    lineHeight: 22,
    marginBottom: 4,
  },
  replyDate: {
    fontSize: 11,
    color: '#888780',
  },
  repliesModalCard: {
  backgroundColor: '#FAFAF8',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 24,
  paddingBottom: 40,
  height: '80%',
},
repliesModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
closeBtn: {
  fontSize: 18,
  color: '#888780',
  padding: 8,
},
repliesPostText: {
  fontSize: 14,
  color: '#888780',
  lineHeight: 22,
  marginBottom: 16,
  paddingBottom: 16,
  borderBottomWidth: 0.5,
  borderBottomColor: '#D3D1C7',
},
repliesScroll: {
  flex: 1,
  marginBottom: 16,
},
replyFromModalBtn: {
  backgroundColor: '#E1F5EE',
  padding: 16,
  borderRadius: 14,
  alignItems: 'center',
},
replyFromModalBtnText: {
  fontSize: 15,
  color: '#085041',
  fontWeight: '500',
},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FAFAF8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C2C2A',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 14,
    color: '#888780',
    marginBottom: 16,
    lineHeight: 22,
  },
  modalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#2C2C2A',
    minHeight: 80,
    borderWidth: 0.5,
    borderColor: '#D3D1C7',
    marginBottom: 8,
  },
  cancelBtn: {
    alignItems: 'center',
    padding: 12,
  },
  cancelText: {
    fontSize: 14,
    color: '#888780',
  },
});