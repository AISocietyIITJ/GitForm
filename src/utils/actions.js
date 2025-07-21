'use server'

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const signInWith = provider => async () => {
    const supabase = await createClient()
    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const {data,error} = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    });
    if (error) {
        console.error('Error signing in with OAuth:', error);
        throw error;
    }
    
    redirect(data.url)
}

const signInWithGithub = signInWith('github')

async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
  
  redirect('/')
}

export { signInWithGithub, signOut }