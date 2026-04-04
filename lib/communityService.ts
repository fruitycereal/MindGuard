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

  const res = await fetch('https://web-production-e9438.up.railway.app/check-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const check = await res.json()

  if (!check.safe) {
    throw new Error(check.reason)
  }

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

export async function getReplies(postId: number) {
  const { data, error } = await supabase
    .from('post_replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function addReply(postId: number, content: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const res = await fetch('https://web-production-e9438.up.railway.app/check-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const check = await res.json()

  if (!check.safe) {
    throw new Error(check.reason)
  }

  const { error } = await supabase
    .from('post_replies')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })

  if (error) throw error
}