import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Subscribe a user to the newsletter
 */
export async function subscribeToNewsletter(email: string): Promise<boolean> {
  try {
    // First check if already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
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
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email,
        subscribed_at: new Date().toISOString(),
        active: true
      }]);
    
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
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ active: false, unsubscribed_at: new Date().toISOString() })
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
