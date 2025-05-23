
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define a type for newsletter subscriber to avoid TypeScript errors
type NewsletterSubscriber = {
  id?: string;
  email: string;
  subscribed_at?: string;
  unsubscribed_at?: string | null;
  active?: boolean;
  source?: string | null;
}

/**
 * Subscribe a user to the newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<boolean> {
  try {
    // First check if already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers' as any)
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking newsletter subscription:', checkError);
      return false;
    }
    
    // If already subscribed, return success
    if (existing) return true;
    
    // Otherwise create new subscription
    const subscriber: NewsletterSubscriber = {
      email,
      subscribed_at: new Date().toISOString(),
      active: true
    };
    
    const { error } = await supabase
      .from('newsletter_subscribers' as any)
      .insert([subscriber as any]);
    
    if (error) {
      console.error('Error subscribing to newsletter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return false;
  }
}

/**
 * Unsubscribe a user from the newsletter
 */
export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  try {
    const updates = {
      active: false,
      unsubscribed_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('newsletter_subscribers' as any)
      .update(updates as any)
      .eq('email', email);
    
    if (error) {
      console.error('Error unsubscribing from newsletter:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return false;
  }
}
