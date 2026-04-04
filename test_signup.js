import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gmtiwbdbettjjbdzmrlh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtdGl3YmRiZXR0ampiZHptcmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyOTk2NjcsImV4cCI6MjA5MDg3NTY2N30.H90lkGOKKD9r6-dn5XC47FqkiJyJza_fD40Z4frYwug';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup() {
  const email = `test_${Date.now()}@gmail.com`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password: 'password123',
  });

  if (error) {
    console.error('Signup Error:', error.message);
  } else {
    console.log('Signup Success:', data.user?.id);
  }
}

testSignup();
