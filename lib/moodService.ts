import { supabase } from './supabase';

const getTodayStr = () => new Date().toISOString().split('T')[0];

export async function saveMoodEntry(mood: string, entry: string, aiResponse: string) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: existing } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('user_id', user?.id ?? 'anonymous')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const isToday = existing?.created_at
    ? new Date(existing.created_at).toDateString() === new Date().toDateString()
    : false;

  if (existing && isToday) {
    const { error } = await supabase
      .from('mood_checkins')
      .update({
        mood: mood || existing.mood,
        entry: entry || existing.entry,
      })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('mood_checkins')
      .insert({
        user_id: user?.id ?? 'anonymous',
        mood: mood || null,
        entry: entry || null,
      });
    if (error) throw error;
  }
}

export async function getMoodEntries() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('mood_checkins')
    .select('*')
    .eq('user_id', user?.id ?? 'anonymous')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}