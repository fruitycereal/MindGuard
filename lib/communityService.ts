import { supabase } from './supabase'

export async function getCommunityPosts() {
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
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

export async function incrementFeels(postId: string, currentCount: number) {
  const { error } = await supabase
    .from('community_posts')
    .update({ feels_count: currentCount + 1 })
    .eq('id', postId)

  if (error) throw error
}