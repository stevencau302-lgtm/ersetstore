import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjklcbicacbfqeitfzau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2xjYmljYWNiZnFlaXRmemF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNDE4MjYsImV4cCI6MjA5NDgxNzgyNn0.uIpmrfLh6hdntkADcBINNZ3xQV9gjzs0BACXPpw8aJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
