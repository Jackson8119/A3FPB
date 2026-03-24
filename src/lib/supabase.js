// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://xtjehjfomxqjphxoneem.supabase.co'
const supabaseKey = 'sb_publishable_vXcnTSfbnjrGTZ3ziV_t1Q_PyUKUvBP'

export const supabase = createClient(supabaseUrl, supabaseKey)