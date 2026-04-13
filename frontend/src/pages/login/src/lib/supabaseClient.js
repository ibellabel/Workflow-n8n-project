import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uagnuhefmfdnjuvofqcf.supabase.co"
const supabaseKey = "sb_publishable_Iwq6D5R9-tiQ_do1z7hkUQ_fpyZoyPh"

export const supabase = createClient(supabaseUrl, supabaseKey)