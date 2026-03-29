import { supabase } from './supabase'

export async function saveMoodEntry(
  mood: string,
  journalText: string,
  aiResponse: string
) {
  const { error } = await supabase
    .from('mood_checkins')
    .insert({ mood_label: mood, journal_text: journalText, ai_response: aiResponse })

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