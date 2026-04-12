import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uagnuhefmfdnjuvofqcf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhZ251aGVmbWZkbmp1dm9mcWNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTI0NzMsImV4cCI6MjA4ODAyODQ3M30.vaCShIaDuZbls7mpjEA2fQgVwKjuzc_Vy3M7j-Jknww";

export const supabase = createClient(supabaseUrl, supabaseKey);