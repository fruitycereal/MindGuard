import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const SUPABASE_URL = 'https://tudpsmuloendqfvfkvms.supabase.co'    // Project Settings → API
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZHBzbXVsb2VuZHFmdmZrdm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzEyNjIsImV4cCI6MjA5MDM0NzI2Mn0.gPaIN3QlbYSCE9e0RxZaSXxTTstiR5yyTEBaVAT9z3w'  // Project Settings → API

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

supabase.from('mood_checkins').select('*').then(({ data, error }) => {
  console.log('Supabase test:', data, error)
})