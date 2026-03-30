import { supabase } from './supabase'

export async function saveMoodEntry(
  mood: string,
  entry: string,
  aiResponse: string
) {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { error } = await supabase
    .from('mood_checkins')
    .insert({ 
      user_id: user?.id ?? 'anonymous',
      mood: mood, 
      entry: entry,
    })

  if (error) throw error
}

export async function getMoodEntries() {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('user_id', user?.id ?? 'anonymous')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}