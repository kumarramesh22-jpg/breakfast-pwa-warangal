import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://nytrfiofpknvykigphfm.supabase.co';
export const supabaseAnonKey = 'sb_publishable_SYfoceRqs10rgDDFjnpYA_R0tNyEYo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
