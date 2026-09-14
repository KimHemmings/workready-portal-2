import { supabase } from './supabaseClient';

// Sign in user with email & password
export const signInUser = async (email: string, pass: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });
  if (error) throw error;
  return data;
};

// Sign out current user session
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Retrieve active user session
export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};