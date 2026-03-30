import { supabase } from './supabase'

export async function saveMoodEntry(
  mood: string,
  entry: string,
  aiResponse: string
) {
  const { error } = await supabase
    .from('mood_checkins')
    .insert({ 
      user_id: 'anonymous',
      mood: mood, 
      entry: entry,
    })

  if (error) throw error
}

export async function getMoodEntries() {
  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}