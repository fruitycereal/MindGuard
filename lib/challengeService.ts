import { supabase } from './supabase'

export async function getCurrentChallenge() {
  const { data, error } = await supabase
    .from('weekly_challenges')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(1)
    .single()

  if (error) throw error
  return data
}

export async function getChallengeResponses(challengeId: number) {
  const { data, error } = await supabase
    .from('challenge_responses')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addChallengeResponse(challengeId: number, content: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const res = await fetch('https://web-production-e9438.up.railway.app/check-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  const check = await res.json()
  if (!check.safe) throw new Error(check.reason)

  const { error } = await supabase
    .from('challenge_responses')
    .insert({
      challenge_id: challengeId,
      user_id: user.id,
      content,
    })

  if (error) throw error
}

export async function hasUserResponded(challengeId: number) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from('challenge_responses')
    .select('id')
    .eq('challenge_id', challengeId)
    .eq('user_id', user.id)
    .single()

  return !!data
}