import { supabase } from './supabase'

export async function getCommunityPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*, post_feels(user_id)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addCommunityPost(content: string) {
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('community_posts')
    .insert({
      user_id: user?.id ?? 'anonymous',
      content,
      feels_count: 0,
    })

  if (error) throw error
}

export async function toggleFeel(postId: string, currentlyFelt: boolean) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (currentlyFelt) {
    const { error } = await supabase
      .from('post_feels')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('post_feels')
      .insert({ post_id: postId, user_id: user.id })
    if (error) throw error
  }
}