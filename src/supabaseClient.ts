import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dHJmaW9mcGtueXZraWdwaGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzNjAwMDAsImV4cCI6MjAyMDkyMDAwMH0.sb_publishable_SYFoceRqs10rGDDFjnPyA_R0tNyeYo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
