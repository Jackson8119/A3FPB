// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Substitua o que está entre aspas pelos dados que você copiou do painel
const supabaseUrl = 'https://xtjehjfomxqjphxoneem.supabase.co'
const supabaseKey = 'sb_publishable_vXcnTSfbnjrGTZ3ziV_t1Q_PyUKUvBP'

export const supabase = createClient(supabaseUrl, supabaseKey)